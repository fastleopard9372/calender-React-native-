import { ScheduleDTO } from "./schedule.dto";

export interface DayDTO {
    date: string;
    day: number;
    weekNum: number;
    isOut: boolean;
    isMonday: boolean;
    isSunday: boolean;
    schedules: ScheduleDTO[];
}

export interface OneDayDTO {
    color?: string | "indigo";
    width: number;
    datesCnt?: number;
    date: string;
    month: number;
    no: number;
    schedule?: ScheduleDTO[];
}
