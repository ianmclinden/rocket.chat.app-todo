export interface IToDoItem {
    description: string;
    completed: boolean;
    completedBy: string
}
export interface IToDoList {
    messageID: string;
    name: string;
    numItems: number;
    numCompletedItems: number;
    todos: Array<IToDoItem>;
}
