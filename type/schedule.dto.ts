export interface ScheduleDTO {
    id: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    color: string | "indigo";
    width: number | 4;
    type: string;
    ownerId?: number;
    workspaceId?: number;
    createAt?: string;
    updateAt?: string;
}
export interface NewScheduleDTO {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    color: string;
    width: number;
    type: string;
    workspaceId?: number;
}

export interface UpdateScheduleDTO {
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    color?: string;
    width?: number;
    type?: string;
}

export interface ScheduleTypesDTO {
    meeting: string[];
    birthday: string[];
    work: string[];
    holiday: string[];
    travel: string[];
    memory: string[];
    date: string[];
}

export interface ScheduleOnWorkSpaces {
    id: number;
    title: string;
    schedules: Array<ScheduleDTO>;
}
