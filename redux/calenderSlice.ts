import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { RootState } from './store';
import { TPlan, TScheduleKind } from '../type';
const initialState: {
    date: string,
    kind: string,
    plan: TPlan[] | undefined,
    isShowDialog: boolean,
    isTaskShowShowDialog: boolean,
    scheduleKind: TScheduleKind[],
    colors: string[],
    thickness: number[],
    newPlan: TPlan,
    action: string,
} =
{
    date: moment(new Date()).format("MM-DD-YYYY"),
    kind: "month_1",
    plan: undefined,
    isShowDialog: false,
    isTaskShowShowDialog: false,
    scheduleKind: [
        { _id: "1", name: "meeting" },
        { _id: "2", name: "dating" },
        { _id: "3", name: "holiday" },
        { _id: "4", name: "birthday" },
        { _id: "5", name: "work" },
    ],
    colors: [
        "red", "green", "blue", "yellow", "orange", "purple", "pink", "teal", "brown", "gray", "cyan", "magenta", "indigo", "lime", "olive", "coral"],
    thickness: [2, 3, 4, 5, 6],
    newPlan: {
        _id: "",
        color: 'indigo',
        width: 2,
        startDate: moment(new Date()).format("YYYY-MM-DD"),
        endDate: moment(new Date()).format("YYYY-MM-DD"),
        demo: "",
        kind: "-1",
        title: "",
        user: {
            id: "",
            username: "",
            email: "",
        },
        __v: "",
        createdAt: "",
        updatedAt: ""
    },
    action: "create"
};
export const CalenderSlice = createSlice({
    name: "Calender",
    initialState,
    reducers: {
        setDate(state, action) {
            state.date = action.payload
        },
        setNewPlan(state, action) {
            state.newPlan = action.payload
        },
        setAction(state, action) {
            state.action = action.payload
        },
        setKind(state, action) {
            state.kind = action.payload
        },
        setPlan(state, action) {
            const plan: TPlan[] = action.payload
            state.plan = plan.sort((a, b) => moment(a.startDate).isBefore(moment(b.startDate)) ? -1 : 1)
        },
        addPlan(state, action) {
            state.plan?.push(action.payload);
            state.newPlan = action.payload;
        },
        updatePlan(state, action) {
            state.plan = state.plan?.map((v: TPlan, i: number) => {
                if (v._id === action.payload._id) return action.payload;
                else return v;
            })
            state.newPlan = action.payload;
        },
        deletePlan(state, action) {
            state.plan = state.plan?.filter((v: TPlan) => {
                return (v._id != action.payload)
            })
        },
        setDateAndPlan(state, action) {
            state.date = action.payload.date
            state.plan = action.payload.plan
        },
        setIsShowDialog(state, action) {
            state.isShowDialog = action.payload
        },
        setIsTaskShowShowDialog(state, action) {
            state.isTaskShowShowDialog = action.payload
        },
        addNewScheduleKind(state, action) {
            state.scheduleKind.push(action.payload)
        },
        getScheduleKind(state, action) {
            state.scheduleKind = action.payload;
        }

    }
});

export const {
    setDate,
    setKind,
    setPlan,
    addPlan,
    updatePlan,
    deletePlan,
    setAction,
    setNewPlan,
    setDateAndPlan,
    setIsShowDialog,
    setIsTaskShowShowDialog,
    addNewScheduleKind,
    getScheduleKind,
} = CalenderSlice.actions;
export const getCalender = (state: RootState) => state.Calender;

export default CalenderSlice.reducer;