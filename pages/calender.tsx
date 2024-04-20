'use client'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { View, StyleSheet } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../redux/hook';
import { getCalender, getScheduleKind, setDate, setPlan } from '../redux/calenderSlice';
import { getSchedulesAPI, getScheduleKindAPI } from '../api/schedule';
import TaskShow from '../components/taskShow';
import TaskCreate from '../components/taskCreate';
import OneDay from '../components/oneDay';
import { TPlan } from '../type';

const DatesOfMonth = (
    { startDate, endDate, date, kind, plan }
        :
        {
            startDate: moment.Moment,
            endDate: moment.Moment,
            date: moment.Moment,
            kind: string,
            plan: TPlan[] | undefined
        }) => {
    let datesCnt = endDate.diff(startDate, 'days') + 1;
    let day: JSX.Element[] = [];
    if (kind == "month_1") {
        for (let i = 0; i < datesCnt / 7; i++) {
            let inner_item: JSX.Element[] = [];
            for (let j = 0; j < 7; j++) {
                let k = j;
                if (i % 2)
                    k = 6 - j
                inner_item.push(<OneDay key={i * 7 + k} {
                    ...{
                        no: i * 7 + k,
                        date: startDate.clone().add(i * 7 + k, "days").format("YYYY-MM-DD"),
                        month: date.clone().month(),
                        datesCnt,
                        width: 4,
                        plan
                    }} />);
            }
            day.push(<View style={styles.row} key={i}>{inner_item}
            </View>);
        }
    } else if (kind == "month_2") {
        for (let i = 0; i < datesCnt / 7; i++) {
            let inner_item: JSX.Element[] = [];
            for (let j = 0; j < 7; j++) {
                inner_item.push(<OneDay key={i * 7 + j} {
                    ...{
                        no: i * 7 + j,
                        date: startDate.clone().add(i * 7 + j, "days").format("YYYY-MM-DD"),
                        month: date.clone().month(),
                        datesCnt,
                        width: 4,
                        plan
                    }} />);
            }
            day.push(<View style={styles.row} key={i}>{inner_item}
            </View>);
        }
    } else if (kind == "week") {
        let inner_item: JSX.Element[] = [];
        for (let i = 0; i < 7; i++) {
            inner_item.push(<OneDay key={i} {
                ...{
                    no: i,
                    date: date.clone().add(i, "days").format("YYYY-MM-DD"),
                    month: date.clone().month(),
                    datesCnt: 7,
                    width: 4,
                    plan
                }} />);
        }
        day.push(<View style={styles.row}>{inner_item}
        </View>);
    }
    return <>{day}</>;
}
const Calender = () => {
    const calender_data = useAppSelector(getCalender);
    const kind = calender_data.kind;
    const date = moment(calender_data.date);
    const dispatch = useAppDispatch();
    const startDate = date.clone().startOf('month').startOf('week');
    const endDate = date.clone().endOf('month').endOf('week');
    // const plan1: TPlan[] = [
    //     {
    //         _id: "1", color: 'red', width: 4, startDate: "2010-03-13", endDate: "2010-03-19", title: "title1", demo: "This is my demo1", kind: '1', user: { id: '', username: '', email: '' },
    //         createdAt: '',
    //         updatedAt: '',
    //         __v: ''
    //     }, {
    //         _id: "2", color: 'blue', width: 4, startDate: "2010-03-02", endDate: "2010-03-15", title: "title2", demo: "This is my demo2", kind: '1', user: { id: '', username: '', email: '' },
    //         createdAt: '',
    //         updatedAt: '',
    //         __v: ''
    //     }, {
    //         _id: "3", color: 'green', width: 4, startDate: "2010-03-25", endDate: "2010-04-16", title: "title3", demo: "This is my demo3", kind: '2', user: { id: '', username: '', email: '' },
    //         createdAt: '',
    //         updatedAt: '',
    //         __v: ''
    //     }, {
    //         _id: "4", color: 'cyan', width: 4, startDate: "2010-03-02", endDate: "2010-03-22", title: "title4", demo: "This is my demo4", kind: '3', user: { id: '', username: '', email: '' },
    //         createdAt: '',
    //         updatedAt: '',
    //         __v: ''
    //     }, {
    //         _id: "5", color: 'magenta', width: 4, startDate: "2010-03-16", endDate: "2010-03-22", title: "title5", demo: "This is my demo5", kind: '1', user: { id: '', username: '', email: '' },
    //         createdAt: '',
    //         updatedAt: '',
    //         __v: ''
    //     },
    // ]
    useEffect(() => {
        // dispatch(setPlan(plan1))
        getSchedulesAPI({ startDate, endDate }).then((schedules: any) => {
            // console.log("data:", schedules)
            dispatch(setPlan(schedules.data))
        })
    }, [calender_data.date, kind])

    useEffect(() => {
        getScheduleKindAPI().then((scheduleKind: any) => {
            dispatch(getScheduleKind(scheduleKind.data));
        })
    }, [])

    return (
        <View style={{ flex: 1, width: '100%' }}>
            <PaperProvider>
                <View style={styles.app}>
                    <View style={styles.container}>
                        <DatesOfMonth startDate={startDate} date={date} endDate={endDate} kind={kind} plan={calender_data.plan} />
                    </View>
                </View>
                <TaskShow />
                <TaskCreate />
            </PaperProvider>
        </View >
    )
}

export default Calender

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    app: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    row: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
