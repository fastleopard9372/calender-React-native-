import React, { useEffect, useState } from "react";
import moment from "moment";
import { SelectList } from "react-native-dropdown-select-list";
import { SafeAreaView, StyleSheet, View } from "react-native";
import {
    Text,
    Portal,
    Modal,
    Surface,
    IconButton,
    Button,
    TextInput,
    MD3Colors,
    TouchableRipple,
    Icon,
} from "react-native-paper";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { updateScheduleAPI, addScheduleAPI } from "../api/schedule";
import ColorIcon from "./colorIcon";
import LineThickness from "./lineThickness";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { getCalender, setDate, updatePlan, addPlan, setIsShowDialog } from "../redux/calenderSlice";
import { TPlan, TScheduleKind } from "../type/calender";

const TaskCreate = () => {
    const dispatch = useAppDispatch();
    const { isShowDialog, scheduleKind, colors, thickness, newPlan, action } = useAppSelector(getCalender);
    const [data, setData] = useState<TPlan>(newPlan);
    const [visibleLine, setVisibleLine] = React.useState(false);
    const [showCalenderS, setShowCalenderS] = useState(false);
    const [showCalenderE, setShowCalenderE] = useState(false);
    const [error, setError] = useState({
        message: "",
        open: false,
    });
    const handleColorClick = (e: string) => {
        setData({ ...data, color: e });
    };
    const handleLineThicknessClick = (e: number) => {
        setData({ ...data, width: e });
    };
    const handleSubmit = () => {
        if (moment(data?.endDate).isBefore(data?.startDate)) {
            setError({
                message: "End date must be after start date",
                open: true,
            });
            return;
        }
        // if (data?.kind == "-1" || data?.kind == "") {
        //     setError({
        //         message: "Kind must be selected",
        //         open: true
        //     })
        //     return
        // }
        if (data?.title == "") {
            setError({
                message: "Title must be required",
                open: true,
            });
            return;
        }
        if (data?.demo == "") {
            setError({
                message: "Demo must be required",
                open: true,
            });
            return;
        }
        if (action == "Edit") {
            updateScheduleAPI(data)
                .then((schedule) => {
                    dispatch(updatePlan(schedule.data));
                    dispatch(setIsShowDialog(!isShowDialog));
                    // toast.info("Plan is updated");
                })
                .catch((error) => {
                    setError({
                        message: "Server Error.",
                        open: true,
                    });
                });
        } else if (action == "Create") {
            addScheduleAPI(data)
                .then((schedule) => {
                    dispatch(addPlan(schedule.data));
                    dispatch(setIsShowDialog(!isShowDialog));
                    // toast.info("Plan is added newly");
                })
                .catch((error) => {
                    setError({
                        message: "Server Error.",
                        open: true,
                    });
                });
        }
    };
    const handleStartDateChange = (date: moment.Moment) => {
        setShowCalenderS(false);
        setData({ ...data, startDate: date.format("YYYY-MM-DD") });
    };
    const handleEndDateChange = (date: moment.Moment) => {
        setShowCalenderE(false);
        setData({ ...data, endDate: date.format("YYYY-MM-DD") });
    };
    const handleKind = (value: string) => {
        setData({ ...data, kind: value });
    };
    const handleInputChange = (name: string, value: string) => {
        console.log(name, value);
        setData({ ...data, [name]: value });
    };
    const hideModal = () => {
        dispatch(setIsShowDialog(false));
    };

    const showModalLine = () => setVisibleLine(true);
    const hideModalLine = () => setVisibleLine(false);
    useEffect(() => {
        if (data?.kind == "-1") {
            setError({
                message: "Kind must be started",
                open: true,
            });
        } else {
            setError({ message: "", open: false });
        }
        if (moment(newPlan?.endDate).isBefore(moment(newPlan?.startDate))) {
            setError({
                message: "End date must be after start date",
                open: true,
            });
        } else {
            setError({ message: "", open: false });
        }
        setData(newPlan);
    }, [newPlan]);
    const kindSch = scheduleKind.map((v: TScheduleKind, i: number) => ({ key: v._id, value: v.name }));
    const current_kindSch = action == "Edit" ? kindSch.find((v: any) => v.key == data?.kind) : { key: "", value: "" };
    const containerStyle = {
        flex: 1,
        margin: 0,
    };
    return (
        <>
            <Portal>
                <Modal visible={isShowDialog} onDismiss={hideModalLine} contentContainerStyle={containerStyle}>
                    <Surface style={styles.containerStyle}>
                        <SafeAreaView style={styles.safeContainerStyle}>
                            <IconButton
                                icon={"close-circle"}
                                iconColor={MD3Colors.primary40}
                                size={32}
                                onPress={hideModal}
                                style={{ position: "absolute", right: 10, top: 10, zIndex: 100 }}
                            />
                            <View>
                                <Text variant="headlineLarge" style={styles.header}>
                                    {action} Schedule
                                </Text>
                            </View>
                            {error.open && (
                                <View
                                    style={{
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexDirection: "row",
                                        backgroundColor: "#FF000060",
                                        paddingLeft: 20,
                                        borderRadius: 10,
                                        marginTop: 10,
                                    }}
                                >
                                    <Text>{error.message}</Text>
                                    <IconButton
                                        icon={"close"}
                                        iconColor={MD3Colors.primary40}
                                        size={24}
                                        onPress={() => setError({ message: "", open: false })}
                                    />
                                </View>
                            )}
                            <View>
                                <Text style={styles.title_1}>Title</Text>
                                <TextInput
                                    mode="outlined"
                                    value={data?.title}
                                    onChangeText={(text) => handleInputChange("title", text)}
                                />
                            </View>

                            <View style={{ flexGrow: 1 }}>
                                <Text style={styles.title_1}>Demo</Text>
                                <TextInput
                                    mode="outlined"
                                    multiline={true}
                                    value={data?.demo}
                                    onChangeText={(text) => handleInputChange("demo", text)}
                                    style={{
                                        flex: 1,
                                    }}
                                />
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                                <View>
                                    <Text style={styles.title_1}>Line Color</Text>
                                    <View>
                                        <View
                                            style={{
                                                gap: 5,
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Surface
                                                style={{
                                                    width: 100,
                                                    height: 40,
                                                    borderRadius: 5,
                                                    backgroundColor: MD3Colors.primary90,
                                                    position: "relative",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                <TouchableRipple
                                                    style={{
                                                        flex: 1,
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        width: "100%",
                                                        height: "100%",
                                                        borderRadius: 50,
                                                    }}
                                                    onPress={showModalLine}
                                                    rippleColor="rgba(0, 0, 0, .32)"
                                                >
                                                    <>
                                                        <View style={{ gap: 2, flexDirection: "row" }}>
                                                            <Text style={{ fontWeight: "600" }}>{data?.width}</Text>
                                                            <Text>px </Text>
                                                        </View>
                                                        <View
                                                            style={{
                                                                width: "80%",
                                                                height: data?.width,
                                                                backgroundColor: data?.color,
                                                            }}
                                                        ></View>
                                                    </>
                                                </TouchableRipple>
                                            </Surface>
                                        </View>
                                    </View>
                                </View>
                                <View>
                                    <Text style={styles.title_1}>Date</Text>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Button mode="contained-tonal" onPress={() => setShowCalenderS(true)}>
                                            {moment(data?.startDate).format("YYYY-MM-DD")}
                                        </Button>
                                        <Text> ~ </Text>
                                        <Button mode="contained-tonal" onPress={() => setShowCalenderE(true)}>
                                            {moment(data?.endDate).format("YYYY-MM-DD")}
                                        </Button>
                                    </View>
                                    {showCalenderS && (
                                        <RNDateTimePicker
                                            value={moment(data?.startDate).toDate()}
                                            mode="date"
                                            onChange={(event: any, date: Date) => handleStartDateChange(moment(date))}
                                        />
                                    )}

                                    {showCalenderE && (
                                        <RNDateTimePicker
                                            value={moment(data?.endDate).toDate()}
                                            mode="date"
                                            minimumDate={moment(data?.startDate).toDate()}
                                            onChange={(event: any, date: Date) => handleEndDateChange(moment(date))}
                                        />
                                    )}
                                </View>
                                {/* <View style={{
                                    width: 150
                                }}>
                                    <Text style={styles.title_1}>Kind</Text>
                                    <SelectList
                                        setSelected={(val: string) => handleKind(val)}
                                        data={scheduleKind.map((v: TScheduleKind, i: number) =>
                                            ({ key: v._id, value: v.name })
                                        )}
                                        save="key"
                                        boxStyles={{
                                            position: 'relative'
                                        }}
                                        dropdownStyles={{
                                            top: 40,
                                            position: 'absolute',
                                            backgroundColor: 'white',
                                            width: '100%',
                                            zIndex: 100
                                        }}

                                        defaultOption={current_kindSch}
                                    />
                                </View> */}
                            </View>
                            <Button mode="contained" onPress={handleSubmit} style={{ marginTop: 20 }}>
                                Submit
                            </Button>
                        </SafeAreaView>
                    </Surface>
                </Modal>
                <Modal
                    visible={visibleLine}
                    onDismiss={hideModalLine}
                    contentContainerStyle={{
                        backgroundColor: "white",
                        padding: 20,
                        margin: 30,
                        position: "relative",
                        borderRadius: 10,
                    }}
                >
                    <View>
                        <Text variant="headlineMedium" style={styles.header}>
                            Line Setting
                        </Text>
                    </View>
                    <IconButton
                        icon={"close-circle"}
                        iconColor={MD3Colors.primary40}
                        size={32}
                        onPress={hideModalLine}
                        style={{ position: "absolute", right: 10, top: 10, zIndex: 100 }}
                    />
                    <Text>Line Color</Text>
                    <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: 3,
                            marginTop: 10,
                        }}
                    >
                        {colors.map((v: string, i: number) => (
                            <ColorIcon key={i} value={v} selected={v === data?.color} handleClick={handleColorClick} />
                        ))}
                    </View>
                    <Text style={{ marginTop: 20 }}>Line Thickness</Text>
                    <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: 10,
                            marginTop: 10,
                        }}
                    >
                        {thickness.map((v: number, i: number) => (
                            <LineThickness
                                key={i}
                                value={v}
                                color={data?.color}
                                selected={data?.width === v}
                                handleClick={handleLineThicknessClick}
                            />
                        ))}
                    </View>
                </Modal>
            </Portal>
        </>
    );
};

export default TaskCreate;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
    },
    header: {
        textAlign: "center",
    },
    title: {
        textAlign: "center",
    },
    pickerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    picker: {
        width: "100%",
        marginBottom: 16,
    },
    containerStyle: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    safeContainerStyle: {
        flex: 1,
        padding: 20,
        justifyContent: "flex-start",
        position: "relative",
        width: "100%",
    },
    title_1: {
        marginTop: 10,
        marginLeft: 10,
        marginBottom: 5,
    },
});
