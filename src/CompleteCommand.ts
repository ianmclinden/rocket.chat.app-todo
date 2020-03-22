import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { ToDoApp } from '../ToDoApp';
import { UUID, buildToDoList } from './common';
import { IToDoList, IToDoItem } from './IToDoList';

const alias = 'ToDo';

export class CompleteCommand implements ISlashCommand {

    public command = 'complete';
    public i18nParamsExample = 'cmd_complete_example';
    public i18nDescription = 'cmd_complete_desc';
    public providesPreview = false;

    public constructor(private readonly app: ToDoApp) {
    }

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {

        const args = context.getArguments().slice();

        if (!args || args.length < 2) {
            console.log('Invalid params', args);
            throw new Error('Invalid params');
        }

        const todolistID = args.shift();
        const itemIndex = Number(args.shift());
        const association = new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, todolistID!);

        if (isNaN(itemIndex)) {
            console.log('Invalid todo item index', itemIndex);
            throw new Error('Invalid todo item index');
        }

        const todolists = await read.getPersistenceReader().readByAssociation(association);
        if (!todolists || todolists.length < 1) {
            console.log('No todo lists found', todolists);
            throw new Error('No todo lists found');
        }
        const todolist = todolists[0] as IToDoList;

        const useUserName = await read.getEnvironmentReader().getSettings().getById('use-user-name');
        const showCompletionTime = await read.getEnvironmentReader().getSettings().getById('show-completion-time');

        const displayedName = useUserName.value ? context.getSender().name : '@' + context.getSender().username;

        const isCompleted = todolist.todos[itemIndex].completed;
        const hasCompleted = todolist.todos[itemIndex].completedBy === displayedName;

        if (!isCompleted && !hasCompleted) {
            todolist.todos[itemIndex].completed = true;
            todolist.todos[itemIndex].completedBy = displayedName;
            todolist.numCompletedItems++;
        } else {
            todolist.todos[itemIndex].completed = false;
            todolist.todos[itemIndex].completedBy = ""; 
            todolist.numCompletedItems--;
        }
        await persis.updateByAssociation(association, todolist);

        const message = await modify.getUpdater().message(todolist.messageID, context.getSender());
        message.setEditor(message.getSender());

        const attachments = message.getAttachments();
        attachments[0] = buildToDoList(todolistID!, todolist);
        message.setAttachments(attachments);

        try {
            await modify.getUpdater().finish(message);
        } catch (e) {
            console.error('Error completing todo item: ', e);

            this.app.getLogger().error('Error completing todo item: ', e);

            const errorMessage = modify.getCreator().startMessage()
                .setSender(context.getSender())
                .setRoom(context.getRoom())
                .setText('err_could_not_complete')
                .setUsernameAlias(alias);
            modify.getNotifier().notifyUser(context.getSender(), errorMessage.getMessage());
        }
    }
}
