import React, { useState } from "react";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { getCalender, setDate, setIsTaskShowShowDialog } from "../redux/calenderSlice";
// import TaskShow from './taskShow'
import { View, StyleSheet } from "react-native";
import { Text, Portal, Modal, TouchableRipple } from "react-native-paper";
import { OneDayDTO, ScheduleDTO } from "../type";

const Bar = ({ color, width, position }: { color: string; position: number; width?: number }) => {
    const wid = width == undefined ? 2 : width;
    return (
        <View
            style={{
                position: "absolute",
                borderWidth: wid / 2,
                borderColor: color,
                marginTop: position,
                width: "100%",
                height: 0,
            }}
        ></View>
    );
};
const Conner = ({ no, width, color, position }: { no: number; width?: number; color?: string; position?: number }) => {
    let pos = width;
    let col = "gray";
    let wid = 2;
    if (width) wid = width;
    if (position) pos = position;
    if (color) col = color;
    if (no == 0) {
        //start
        return (
            <View
                style={{
                    position: "absolute",
                    top: "50%",
                    marginTop: -wid / 2 + pos,
                    borderBottomWidth: wid,
                    borderBottomColor: col,
                    borderLeftWidth: wid,
                    borderLeftColor: col,
                    width: "100%",
                    borderRightWidth: 0,
                    borderTopWidth: 0,
                }}
            ></View>
        );
    } else if (no == 1) {
        //n+1=end
        return (
            <View
                style={{
                    position: "absolute",
                    top: "50%",
                    marginTop: -0.5 * wid + pos,
                    borderBottomWidth: wid,
                    borderBottomColor: col,
                    borderLeftWidth: wid,
                    borderLeftColor: col,
                    width: "100%",
                    borderRightWidth: 0,
                    borderTopWidth: 0,
                }}
            ></View>
        );
    } else if (no == 2) {
        return (
            <View
                style={{
                    position: "absolute",
                    top: "50%",
                    transform: [{ translateY: -0.5 * wid + pos }],
                    borderBottomWidth: wid,
                    borderBottomColor: col,
                    borderLeftWidth: wid,
                    borderLeftColor: col,
                    width: "50%",
                    borderRightWidth: 0,
                    borderTopWidth: 0,
                }}
            ></View>
        );
    } else if (no == 3) {
        //%13
        return (
            <View
                style={{
                    position: "absolute",
                    borderTopWidth: wid,
                    borderTopColor: col,
                    borderLeftWidth: wid,
                    borderLeftColor: col,
                    borderTopLeftRadius: 10,
                    width: "100%",
                    height: "80%",
                    left: 0,
                    top: "50%",
                    transform: [{ translateY: -0.5 * wid + pos }],
                    borderRightWidth: 0,
                    borderBottomWidth: 0,
                }}
            ></View>
        );
    } else if (no == 4) {
        return (
            <View
                style={{
                    position: "absolute",
                    borderBottomWidth: wid,
                    borderBottomColor: col,
                    borderLeftWidth: wid,
                    borderLeftColor: col,
                    borderBottomLeftRadius: 10,
                    width: "100%",
                    left: 0,
                    bottom: "50%",
                    height: "70%",
                    transform: [{ translateY: 0.5 * wid + pos }],
                    borderRightWidth: 0,
                    borderTopWidth: 0,
                }}
            ></View>
        );
    } else if (no == 5) {
        return (
            <View
                style={{
                    position: "absolute",
                    borderTopWidth: wid,
                    borderTopColor: col,
                    borderRightWidth: wid,
                    borderRightColor: col,
                    borderTopRightRadius: 10,
                    width: "100%",
                    height: "70%",
                    top: "50%",
                    transform: [{ translateY: -0.5 * wid + pos }],
                    borderLeftWidth: 0,
                    borderBottomWidth: 0,
                }}
            ></View>
        );
    } else {
        //%7=0
        return (
            <View
                style={{
                    position: "absolute",
                    overflow: "visible",
                    borderBottomWidth: wid,
                    borderBottomColor: col,
                    borderRightWidth: wid,
                    borderRightColor: col,
                    borderBottomRightRadius: 10,
                    width: "100%",
                    height: "70%",
                    bottom: "50%",
                    transform: [{ translateY: 0.5 * wid + pos }],
                    // marginBottom: -0.5 * wid - pos,
                    borderLeftWidth: 0,
                    borderTopWidth: 0,
                }}
            ></View>
        );
    }
};

const OneDay = (prop: any) => {
    const dispatch = useAppDispatch();
    const kind = useAppSelector(getCalender).kind;
    const { no, month, datesCnt, schedule, width, color } = prop;
    const date = moment(prop.date);
    const sel_date = useAppSelector(getCalender).date;

    const handleShowModal = () => {
        dispatch(setIsTaskShowShowDialog(true));
        dispatch(setDate(date.format("YYYY-MM-DD")));
    };
    const handleIconButton = (date: moment.Moment) => {
        dispatch(setDate(date.format("YYYY-MM-DD")));
        // dispatch(setDateAndSchedule({ date: date.format("YYYY-MM-DD"), schedule }))
    };
    let cornerL = null;
    let cornerR = null;
    let k = no;
    if (~~(no / 7) % 2) k = ~~(no / 7) * 7 + (6 - (no % 7));
    if (kind == "month_1") {
        if (no == 0) {
            let pos = 0;
            let _pos = pos;
            let connerSchedule = schedule?.map((v: ScheduleDTO, i: number) => {
                if (
                    moment(v.endDate).clone().weekday(6).isSameOrAfter(date, "day") &&
                    moment(v.endDate).isSameOrAfter(moment(v.startDate), "day")
                ) {
                    _pos += v.width;
                }
                // for (let j = 0; j <= i; j++) {
                //   if (moment(a[j].endDate).clone().weekday(6).isSameOrAfter(date, 'day') && moment(a[j].endDate).isSameOrAfter(moment(v.startDate), 'day')) {
                //     _pos += v.width;
                //   }
                // }
                if (date.isBetween(moment(v.startDate), moment(v.endDate), "day", "[)")) {
                    return (
                        <Conner key={i} {...{ no: 0, width: v.width, color: v.color, position: _pos - v.width / 2 }} />
                    );
                } else return null;
            });
            cornerL = (
                <View
                    style={{
                        position: "relative",
                        width: "50%",
                        height: "100%",
                    }}
                >
                    {Conner({ no: 0, width })}
                    {connerSchedule}
                </View>
            );
        } else if (datesCnt == no + 1) {
            let pos = 0;
            let _pos = pos;
            let connerSchedule = schedule?.map((v: ScheduleDTO, i: number) => {
                // for (let j = 0; j <= i; j++) {
                //   if (moment(a[j].endDate).clone().weekday(6).isSameOrAfter(date, 'day') && moment(a[j].endDate).isSameOrAfter(moment(v.startDate), 'day')) {
                //     _pos += v.width;
                //   }
                // }
                if (
                    moment(v.endDate).clone().weekday(6).isSameOrAfter(date, "day") &&
                    moment(v.endDate).isSameOrAfter(moment(v.startDate), "day")
                ) {
                    _pos += v.width;
                }
                if (date.isBetween(moment(v.startDate), moment(v.endDate), "day", "[)")) {
                    return (
                        <Conner key={i} {...{ no: 1, width: v.width, color: v.color, position: _pos - v.width / 2 }} />
                    );
                } else return <></>;
            });
            if (~~(datesCnt / 7) % 2) {
                // cornerR = Conner({ no: 1, width })
                cornerR = (
                    <View
                        style={{
                            position: "relative",
                            width: "50%",
                            height: "100%",
                        }}
                    >
                        {Conner({ no: 1, width })}
                        {connerSchedule}
                    </View>
                );
            } else {
                // cornerL = Conner({ no: 2, width })
                cornerL = (
                    <View
                        style={{
                            position: "relative",
                            width: "50%",
                            height: "100%",
                        }}
                    >
                        {Conner({ no: 2, width })}
                        {connerSchedule}
                    </View>
                );
            }
        } else if (no % 14 == 13) {
            let pos = 0;
            let _pos = pos;
            let connerSchedule = schedule?.map((v: ScheduleDTO, i: number) => {
                // for (let j = 0; j <= i; j++) {
                //   if (moment(a[j].endDate).clone().weekday(6).isSameOrAfter(date, 'day') && moment(a[j].endDate).isSameOrAfter(moment(v.startDate), 'day')) {
                //     _pos += v.width;
                //   }
                // }
                if (
                    moment(v.endDate).clone().weekday(6).isSameOrAfter(date, "day") &&
                    moment(v.endDate).isSameOrAfter(moment(v.startDate), "day")
                ) {
                    _pos += v.width;
                }
                if (date.isBetween(moment(v.startDate), moment(v.endDate), "day", "[)")) {
                    return (
                        <Conner
                            key={i}
                            {...{
                                no: 3,
                                width: v.width,
                                color: v.color,
                                position: _pos - v.width / 2,
                            }}
                        />
                    );
                } else return <></>;
            });
            cornerL = (
                <View
                    style={{
                        position: "relative",
                        width: "50%",
                        height: "100%",
                    }}
                >
                    {Conner({ no: 3, width })}
                    {connerSchedule}
                </View>
            );
        } else if (no % 14 == 0) {
            let pos = 0;
            let _pos = pos;
            let connerSchedule = schedule?.map((v: ScheduleDTO) => {
                // for (let j = 0; j <= i; j++) {
                //   if (moment(a[j].endDate).clone().weekday(6).isSameOrAfter(date, "day") && moment(a[j].endDate).isSameOrAfter(moment(v.startDate), "day")) {
                //     _pos += v.width;
                //   }
                // }
                if (
                    moment(v.endDate).clone().weekday(6).isSameOrAfter(date, "day") &&
                    moment(v.endDate).isSameOrAfter(moment(v.startDate), "day")
                ) {
                    _pos += v.width;
                }

                if (date.isBetween(moment(v.startDate), moment(v.endDate), "day", "(]")) {
                    return Conner({ no: 4, width: v.width, color: v.color, position: _pos - v.width / 2 });
                } else return <></>;
            });
            cornerL = (
                <View
                    style={{
                        position: "relative",
                        width: "50%",
                        height: "100%",
                    }}
                >
                    {Conner({ no: 4, width })}
                    {connerSchedule}
                </View>
            );
        } else if (no % 14 == 6) {
            let pos = 0;
            let _pos = pos;
            let connerSchedule = schedule?.map((v: ScheduleDTO) => {
                // for (let j = 0; j <= i; j++) {
                //   if (moment(a[j].endDate).clone().weekday(6).isSameOrAfter(date, "day") && moment(a[j].endDate).isSameOrAfter(moment(v.startDate), "day")) {
                //     _pos += v.width;
                //   }
                // }
                if (
                    moment(v.endDate).clone().weekday(6).isSameOrAfter(date, "day") &&
                    moment(v.endDate).isSameOrAfter(moment(v.startDate), "day")
                ) {
                    _pos += v.width;
                }
                if (date.isBetween(moment(v.startDate), moment(v.endDate), "day", "[)")) {
                    return Conner({ no: 5, width: v.width, color: v.color, position: _pos - v.width / 2 });
                } else return <></>;
            });
            cornerR = (
                <View
                    style={{
                        position: "relative",
                        width: "50%",
                        height: "100%",
                    }}
                >
                    {Conner({ no: 5, width })}
                    {connerSchedule}
                </View>
            );
        } else if (no % 14 == 7) {
            let pos = 0;
            let _pos = pos;
            let connerSchedule = schedule?.map((v: ScheduleDTO, i: number) => {
                // for (let j = 0; j <= i; j++) {
                //   if (moment(a[j].endDate).clone().weekday(6).isSameOrAfter(date, "day") && moment(a[j].endDate).isSameOrAfter(moment(v.startDate), "day")) {
                //     _pos += v.width;
                //   }
                // }
                if (
                    moment(v.endDate).clone().weekday(6).isSameOrAfter(date, "day") &&
                    moment(v.endDate).isSameOrAfter(moment(v.startDate), "day")
                ) {
                    _pos += v.width;
                }
                if (date.isBetween(moment(v.startDate), moment(v.endDate), "day", "(]")) {
                    return (
                        <Conner key={i} {...{ no: 6, width: v.width, color: v.color, position: _pos - v.width / 2 }} />
                    );
                } else return <></>;
            });
            cornerR = (
                <View
                    style={{
                        position: "relative",
                        width: "50%",
                        height: "100%",
                    }}
                >
                    {Conner({ no: 6, width })}
                    {connerSchedule}
                </View>
            );
        }
    }

    let pos = width == undefined ? 1 : width;
    const main_width = width == undefined ? 1 : width / 2;

    let scheduleDay = false;
    let OneScheduleDay = {
        state: false,
        border: 1,
        color: "",
    };
    let _pos = 0;
    const scheduleBarL = schedule?.map((v: ScheduleDTO, i: number) => {
        if (~~(no / 7) % 2 == 1) {
            if (moment(v.endDate).clone().isAfter(date, "day")) {
                _pos += v.width;
            }
        } else {
            if (moment(v.endDate).clone().isSameOrAfter(date, "day")) {
                _pos += v.width;
            }
        }
        if (date.isSame(moment(v.startDate), "day") || date.isSame(moment(v.endDate), "day")) {
            scheduleDay = true;
        }
        if (moment(v.startDate).isSame(moment(v.endDate), "day") && date.isSame(moment(v.startDate), "day")) {
            scheduleDay = true;
            OneScheduleDay = {
                state: true,
                border: v.width,
                color: v.color,
            };
            return <></>;
        }
        if (kind == "month_2") {
            if (date.isSame(moment(v.endDate), "day")) {
                return <Bar key={i} color={v.color} position={_pos - v.width} width={v.width} />;
            }
            if (date.isSame(moment(v.startDate), "day")) {
                return <></>;
            }
        }
        if (~~(no / 7) % 2 == 1) {
            if (date.isSame(moment(v.startDate), "day")) {
                return <Bar key={i} color={v.color} position={_pos - v.width} width={v.width} />;
            }
        } else {
            if (date.isSame(moment(v.endDate), "day")) {
                return <Bar key={i} color={v.color} position={_pos - v.width} width={v.width} />;
            }
        }
        if (date.isBetween(moment(v.startDate), moment(v.endDate), "day")) {
            return <Bar key={i} color={v.color} position={_pos - v.width} width={v.width} />;
        } else {
            return null;
        }
    });
    pos = 0;

    _pos = pos;
    const scheduleBarR = schedule?.map((v: ScheduleDTO, i: number) => {
        if (~~(no / 7) % 2 == 1) {
            if (moment(v.endDate).clone().isSameOrAfter(date, "day")) {
                _pos += v.width;
            }
        } else {
            if (moment(v.endDate).clone().isAfter(date, "day")) {
                _pos += v.width;
            }
        }
        if (moment(v.startDate).isSame(moment(v.endDate), "day")) {
            return <></>;
        }
        if (kind == "month_2") {
            if (date.isSame(moment(v.startDate), "day")) {
                return <Bar key={i} color={v.color} position={_pos - v.width} width={v.width} />;
            }
            if (date.isSame(moment(v.endDate), "day")) {
                return <></>;
            }
        }
        if (~~(no / 7) % 2 == 1) {
            if (date.isSame(moment(v.endDate), "day")) {
                return <Bar key={i} color={v.color} position={_pos - v.width} width={v.width} />;
            }
        } else {
            if (date.isSame(moment(v.startDate), "day")) {
                return <Bar key={i} color={v.color} position={_pos - v.width} width={v.width} />;
            }
        }
        if (date.isBetween(moment(v.startDate), moment(v.endDate), "day")) {
            return <Bar key={i} color={v.color} position={_pos - v.width} width={v.width} />;
        } else {
            return null;
        }
    });
    let dateColor = "#f5f5f5";
    let buttonBorderColor: any = "gray";
    if (date.month() === month) buttonBorderColor = "indigo";
    if (scheduleDay) buttonBorderColor = "red";
    if (sel_date == prop.date) buttonBorderColor = "cyan";

    if (kind == "week") {
        if (date.clone().endOf("week").isSame(date, "day")) {
            // style.container.borderRightWidth = 1
        }
    }

    if (date.isSame(moment(), "day")) {
        dateColor = "coral";
    }
    schedule?.forEach((element: ScheduleDTO) => {
        if (date.isSame(moment(element.startDate), "day") || date.isSame(moment(element.endDate), "day")) {
            OneScheduleDay = {
                state: true,
                border: 2.5,
                color: element.color,
            };
        }
    });

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            borderWidth: 0,
            flexDirection: "row",
            position: "relative",
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
            width: "14.285%",
            height: "100%",
            borderRightColor: "gray",
            borderStyle: "dashed",
            borderRightWidth: kind == "week" && date.clone().endOf("week").isSame(date, "day") ? 1 : 0,
        },
    });
    return (
        <View style={styles.container}>
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    overflow: "hidden",
                    borderRadius: 30,
                    borderWidth: OneScheduleDay.state ? OneScheduleDay.border : 1,
                    zIndex: 1000,
                    backgroundColor: dateColor,
                    borderColor: OneScheduleDay.state ? OneScheduleDay.color : buttonBorderColor,
                    width: 36,
                    height: 36,
                }}
            >
                <TouchableRipple
                    onPress={handleShowModal}
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        width: 36,
                        height: 36,
                    }}
                >
                    <Text style={{ fontWeight: "500" }}>{date.date()}</Text>
                </TouchableRipple>
            </View>
            {cornerL}
            {cornerL == null && (
                <View style={{ position: "relative", width: "50%" }}>
                    <View
                        style={{
                            borderColor: "gray",
                            position: "relative",
                            borderWidth: main_width,
                            width: "100%",
                            height: 0,
                        }}
                    ></View>
                    <>{scheduleBarL}</>
                </View>
            )}
            {cornerR == null && (
                <View style={{ position: "relative", width: "50%" }}>
                    <View
                        style={{
                            borderColor: "gray",
                            position: "relative",
                            borderWidth: main_width,
                            width: "100%",
                            height: 0,
                        }}
                    ></View>
                    <>{scheduleBarR}</>
                </View>
            )}
            {cornerR}
        </View>
    );
};

export default OneDay;
