export interface TaskDTO {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    startTime: string;
    endTime: string;
    complete: boolean;
    ownerId?: number;
    workspaceId?: number;
}

export interface NewTaskDTO {
    title: string;
    description: string;
    dueDate: string;
    startTime: string;
    endTime: string;
    workspaceId?: number;
}

export interface UpdateTaskDTO {
    title?: string;
    description?: string;
    dueDate?: string;
    startTime?: string;
    endTime?: string;
    complete?: boolean;
}

export interface TodoListDTO {
    date: string;
    todolist: TaskDTO[];
}

export interface TodoListOnWorkSpaces {
    id: number;
    title: string;
    todolists: TaskDTO[];
}