import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
//import { MessageActionButtonsAlignment } from '@rocket.chat/apps-engine/definition/messages/MessageActionButtonsAlignment';
//import { MessageActionType } from '@rocket.chat/apps-engine/definition/messages/MessageActionType';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';
import { UUID, buildToDoList } from './common';
import { IToDoList, IToDoItem } from './IToDoList';

const clearQuotes = (item) => item.replace(/(^['"]|['"]$)/g, '');

const alias = 'ToDo';
const avatar = ':clipboard:';

export class ToDoCommand implements ISlashCommand {

    public command = 'todo';
    public i18nParamsExample = 'cmd_todo_example';
    public i18nDescription = 'cmd_todo_desc';
    public providesPreview = false;

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const params = context.getArguments().join(' ');
        const match = params.match(/((["'])(?:(?=(\\?))\3.)*?\2)/g);

        if (!match) {
            throw new Error('Invalid params');
        }

        const tasks = match.map(clearQuotes).filter((task)=>task.length);
        const listname = (tasks.length > 1) ? tasks.shift() : tasks[0];
        const builder = modify.getCreator().startMessage()
            .setSender(context.getSender())
            .setRoom(context.getRoom())
            .setEmojiAvatar(avatar)
            .setUsernameAlias(alias)
            .setGroupable(false);

        try {
            const todolistID = UUID();

            const todolist: IToDoList = {
                messageID: '',
                name: listname,
                numItems: tasks.length,
                numCompletedItems: 0,
                todos: tasks.map((task: string) => ({
                    description: task,
                    completed: false,
                    completedBy: ''
                })),
            };

            builder.addAttachment(buildToDoList(todolistID, todolist));

            todolist.messageID = await modify.getCreator().finish(builder);

            const association = new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, todolistID);
            await persis.createWithAssociation(todolist, association);
        } catch (e) {
            const errorText = `An error occured when trying to create the ${this.command} :disappointed_relieved:

Command executed:
\`\`\`
/${this.command} ${ params }
\`\`\`
${e}
`;
            const builder = modify.getCreator().startMessage()
                .setSender(context.getSender())
                .setRoom(context.getRoom())
                .setEmojiAvatar(avatar)
                .setText(errorText)
                .setUsernameAlias(alias)
                .setGroupable(false);

            modify.getNotifier().notifyUser(context.getSender(), builder.getMessage());
        }
    }
}

