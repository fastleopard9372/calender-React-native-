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