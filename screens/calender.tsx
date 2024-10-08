"use client";
import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { View, StyleSheet, PanResponder } from "react-native";
import { FAB, Portal } from "react-native-paper";

import { Toast } from "toastify-react-native";
import { AxiosError, AxiosResponse } from "axios";
import { useAppSelector, useAppDispatch } from "../redux/hook";
import ScheduleModal from "../components/schedule/scheduleModal";
import ListShow from "../components/ListShow";
import TodoListModal from "../components/todolistModal/todolistModal";
import OneDay from "../components/oneDay";
import { ScheduleDTO } from "../type";
import { findAllScheduleByMonth } from "../api";
import ENCHINTL from "../lang/EN-CH.json";
import { getMonth, getYear } from "../helper";
import { getData } from "../redux/authSlice";
import ScreenWrapper from "../components/common/screenWrapper";
import {
    setSchedule,
    setDate,
    getCalender,
    setIsShowDialog,
    setIsTaskShowShowDialog,
    setIsTodoListShowDialog,
    setAction,
    setNewSchedule,
    setNewTask,
} from "../redux/calenderSlice";

const DatesOfMonth = ({
    startDate,
    endDate,
    date,
    kind,
    schedule,
}: {
    startDate: moment.Moment;
    endDate: moment.Moment;
    date: moment.Moment;
    kind: string;
    schedule: ScheduleDTO[] | null;
}) => {
    let datesCnt = endDate.diff(startDate, "days") + 1;
    let day: JSX.Element[] = [];
    if (kind == "month_1") {
        for (let i = 0; i < datesCnt / 7; i++) {
            let inner_item: JSX.Element[] = [];
            for (let j = 0; j < 7; j++) {
                let k = j;
                if (i % 2) k = 6 - j;
                inner_item.push(
                    <OneDay
                        key={i * 7 + k}
                        {...{
                            no: i * 7 + k,
                            date: startDate
                                .clone()
                                .add(i * 7 + k, "days")
                                .format("YYYY-MM-DD"),
                            month: date.clone().month(),
                            datesCnt,
                            width: 2,
                            schedule: schedule[i * 7 + k],
                        }}
                    />
                );
            }
            day.push(
                <View style={styles.row} key={i}>
                    {inner_item}
                </View>
            );
        }
    } else if (kind == "month_2") {
        for (let i = 0; i < datesCnt / 7; i++) {
            let inner_item: JSX.Element[] = [];
            for (let j = 0; j < 7; j++) {
                inner_item.push(
                    <OneDay
                        key={i * 7 + j}
                        {...{
                            no: i * 7 + j,
                            date: startDate
                                .clone()
                                .add(i * 7 + j, "days")
                                .format("YYYY-MM-DD"),
                            month: date.clone().month(),
                            datesCnt,
                            width: 2,
                            schedule: schedule[i * 7 + j],
                        }}
                    />
                );
            }
            day.push(
                <View style={styles.row} key={i}>
                    {inner_item}
                </View>
            );
        }
    } else if (kind == "week") {
        let inner_item: JSX.Element[] = [];
        for (let i = 0; i < 7; i++) {
            inner_item.push(
                <OneDay
                    key={i}
                    {...{
                        no: i,
                        date: date
                            .clone()
                            .add(i - 3, "days")
                            .format("YYYY-MM-DD"),
                        month: date.clone().month(),
                        datesCnt: 7,
                        width: 2,
                        schedule,
                    }}
                />
            );
        }
        day.push(<View style={styles.row}>{inner_item}</View>);
    }
    return <>{day}</>;
};
const Calender = (props) => {
    const calender_data = useAppSelector(getCalender);
    const intl = useAppSelector(getData).language;
    const kind = calender_data.kind;
    const token = useAppSelector(getData).accessToken;
    const date = moment(calender_data.date);
    const dispatch = useAppDispatch();
    const startDate = date.clone().startOf("M").startOf("W");
    const endDate = date.clone().endOf("M").endOf("W");
    const deltaXRef = useRef(0);

    const [state, setState] = useState({ open: false });
    const onStateChange = ({ open }) => setState({ open });
    const { open } = state;

    const handleScheduleDialogOpen = () => {
        dispatch(
            setNewSchedule({
                id: "",
                color: "indigo",
                width: 2,
                startDate: moment(new Date()).format("YYYY-MM-DD"),
                endDate: moment(new Date()).format("YYYY-MM-DD"),
                description: "",
                type: "-1",
                title: "",
            })
        );
        dispatch(setAction("Create"));
        dispatch(setIsShowDialog(true));
        dispatch(setIsTaskShowShowDialog(false));
    };
    const handleTodoListDialogOpen = () => {
        dispatch(
            setNewTask({
                id: "",
                startTime: "08:00 am",
                endTime: "04:00 pm",
                description: "",
                title: "",
                complete: true,
            })
        );
        dispatch(setAction("Create"));
        dispatch(setIsTodoListShowDialog(true));
    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gestureState) => {
            const { dx } = gestureState;

            deltaXRef.current = dx;
        },
        onPanResponderRelease: () => {
            let kd: moment.unitOfTime.DurationConstructor = "days";
            if (kind == "week") kd = "days";
            else kd = "months";
            let direction = 0;
            if (deltaXRef.current < -100) {
                direction = 1;
            } else if (deltaXRef.current > 100) {
                direction = -1;
            }
            dispatch(setDate(date.clone().add(direction, kd).format("YYYY-MM-DD")));
            deltaXRef.current = 0;
        },
    });
    async function getCalendarSchedules(month: number, year: number) {
        const res = await findAllScheduleByMonth(token, month, year);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            // handlerInitCalendarDayList(result.data as Array<Array<ScheduleDTO>>);
            dispatch(setSchedule(result.data));
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                Toast.error(ENCHINTL["toast"]["common"]["token-expired"][intl]);
                props.navigation.navigate("SignIn");
            }
        }
    }
    useEffect(() => {
        getCalendarSchedules(getMonth(calender_data.date), getYear(calender_data.date));
    }, [calender_data.date, kind, calender_data.refresh]);
    return (
        <View style={{ flex: 1 }} {...panResponder.panHandlers}>
            <View style={styles.app}>
                <View
                    style={{
                        height: kind === "week" ? 100 : "95%",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        paddingHorizontal: 10,
                    }}
                >
                    {calender_data.schedule != null && (
                        <>
                            <DatesOfMonth
                                startDate={startDate}
                                date={date}
                                endDate={endDate}
                                kind={kind}
                                schedule={calender_data.schedule}
                            />
                            <ListShow />
                            <ScheduleModal />
                            <TodoListModal />
                        </>
                    )}
                </View>
            </View>
            <Portal>
                <FAB.Group
                    open={open}
                    visible
                    variant="primary"
                    icon={open ? "close" : "plus"}
                    actions={[
                        {
                            icon: "calendar",
                            label: "Add TodoList",
                            onPress: () => handleTodoListDialogOpen(),
                        },
                        {
                            icon: "calendar-month",
                            label: "Add Schedule",
                            onPress: () => handleScheduleDialogOpen(),
                        },
                    ]}
                    onStateChange={onStateChange}
                    onPress={() => {
                        if (open) {
                            // do something if the speed dial is open
                        }
                    }}
                />
            </Portal>
        </View>
    );
};

const CalenderScreen = (props) => {
    return (
        <ScreenWrapper {...props}>
            <Calender {...props} />
        </ScreenWrapper>
    );
};
export default CalenderScreen;

const styles = StyleSheet.create({
    app: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        height: "100%",
    },
    row: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
    },
});
