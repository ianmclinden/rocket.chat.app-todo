import { MessageActionButtonsAlignment } from '@rocket.chat/apps-engine/definition/messages/MessageActionButtonsAlignment';
import { MessageActionType } from '@rocket.chat/apps-engine/definition/messages/MessageActionType';
import { IToDoList, IToDoItem } from './IToDoList';

export function UUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function ifDone(item: IToDoItem, pos: string, neg: string = '') {
    return item.completed ? pos : neg;
}

function buildToDoItem(item: IToDoItem) {
    return `${ifDone(item, '☑', '☐')} ${item.description} ${ifDone(item,` | ${item.completedBy}`,'')}`;
}

function buildToDoListTitle(todolist: IToDoList) {
    return `${todolist.name} (${todolist.numCompletedItems} of ${todolist.numItems})`;
}

export function buildToDoList(uuid: string, todolist: IToDoList) {
//    const collapseOnComplete = await read.getEnvironmentReader().getSettings().getById('collapse-on-complete');

    return {
        color: '#339999',
        title: { value: buildToDoListTitle(todolist) },
        collapsed: (todolist.numCompletedItems == todolist.numItems),
        actionButtonsAlignment: MessageActionButtonsAlignment.VERTICAL,
        actions: todolist.todos.map((item: IToDoItem, index: number) => ({
            type: MessageActionType.BUTTON,
            text: buildToDoItem(item),
            msg_in_chat_window: true,
            msg: `/complete ${uuid} ${index}`,
        })),
    }
}
