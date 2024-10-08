import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { RootState } from "./store";
import { TaskDTO, TScheduleKind, UserDTO, ScheduleDTO } from "../type";
const initialState: {
    user: UserDTO;
    date: string;
    kind: string;
    schedule: ScheduleDTO[] | null;
    isShowDialog: boolean;
    isTaskShowShowDialog: boolean;
    isTodoListShowDialog: boolean;
    scheduleKind: TScheduleKind[];
    colors: string[];
    thickness: number[];
    newSchedule: ScheduleDTO;
    newTask: TaskDTO;
    action: string;
    language: "En" | "中文";
    refresh: boolean;
} = {
    user: null,
    date: moment(new Date()).format("20YY-MM-DD"),
    kind: "month_1",
    schedule: null,
    isShowDialog: false,
    isTaskShowShowDialog: false,
    isTodoListShowDialog: false,
    scheduleKind: [
        // { _id: "1", name: "meeting" },
        // { _id: "2", name: "dating" },
        // { _id: "3", name: "holiday" },
        // { _id: "4", name: "birthday" },
        // { _id: "5", name: "work" },
    ],
    colors: [
        "red",
        "green",
        "blue",
        "yellow",
        "orange",
        "purple",
        "pink",
        "teal",
        "brown",
        "gray",
        "cyan",
        "magenta",
        "indigo",
        "lime",
        "olive",
        "coral",
    ],
    thickness: [2, 3, 4, 5, 6],
    newSchedule: {
        id: 0,
        color: "indigo",
        width: 2,
        startDate: moment(new Date()).format("YYYY-MM-DD"),
        endDate: moment(new Date()).format("YYYY-MM-DD"),
        description: "",
        type: "-1",
        title: "",
        createAt: "",
        updateAt: "",
    },
    newTask: {
        id: -1,
        title: "",
        description: "",
        dueDate: moment(new Date()).format("YYYY-MM-DD"),
        startTime: moment(new Date()).format("YYYY-MM-DD 08:00"),
        endTime: moment(new Date()).format("YYYY-MM-DD 16:00"),
        complete: false,
    },

    action: "create",
    refresh: true,
    language: "En",
};
export const CalenderSlice = createSlice({
    name: "Calender",
    initialState,
    reducers: {
        setLanguage(state, action) {
            state.language = action.payload;
        },
        refresh(state) {
            state.refresh = !state.refresh;
        },
        setDate(state, action) {
            state.date = action.payload;
        },
        setNewSchedule(state, action) {
            state.newSchedule = action.payload;
        },
        setNewTask(state, action) {
            state.newTask = action.payload;
        },
        setAction(state, action) {
            state.action = action.payload;
        },
        setKind(state, action) {
            state.kind = action.payload;
        },
        setSchedule(state, action) {
            state.schedule = action.payload;
        },
        addSchedule(state, action) {
            state.schedule?.push(action.payload);
            state.newSchedule = action.payload;
        },
        updateSchedule(state, action) {
            state.schedule = state.schedule?.map((v: ScheduleDTO, i: number) => {
                if (v === action.payload.id) return action.payload;
                else return v;
            });
            state.newSchedule = action.payload;
        },
        deleteSchedule(state, action) {
            state.schedule = state.schedule?.filter((v: ScheduleDTO) => {
                return v.id != action.payload;
            });
        },
        setDateAndSchedule(state, action) {
            state.date = action.payload.date;
            state.schedule = action.payload.schedule;
        },
        setIsShowDialog(state, action) {
            state.isShowDialog = action.payload;
        },
        setIsTaskShowShowDialog(state, action) {
            state.isTaskShowShowDialog = action.payload;
        },
        setIsTodoListShowDialog(state, action) {
            state.isTodoListShowDialog = action.payload;
        },
        addNewScheduleKind(state, action) {
            state.scheduleKind.push(action.payload);
        },
        getScheduleKind(state, action) {
            state.scheduleKind = action.payload;
        },
    },
});

export const {
    setLanguage,
    setDate,
    setKind,
    setSchedule,
    addSchedule,
    updateSchedule,
    refresh,
    deleteSchedule,
    setAction,
    setNewSchedule,
    setNewTask,
    setDateAndSchedule,
    setIsShowDialog,
    setIsTaskShowShowDialog,
    setIsTodoListShowDialog,
    addNewScheduleKind,
    getScheduleKind,
} = CalenderSlice.actions;
export const getCalender = (state: RootState) => state.Calender;
export const getLanguage = (state: RootState) => state.Calender.language;

export default CalenderSlice.reducer;
