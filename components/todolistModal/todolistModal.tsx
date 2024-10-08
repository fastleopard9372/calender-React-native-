import React, { useEffect, useState } from "react";
import moment from "moment";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Text, Portal, Modal, Surface, IconButton, Button, TextInput, MD3Colors, Appbar } from "react-native-paper";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Toast } from "toastify-react-native";
import { AxiosError } from "axios";
import { createTask as createTaskApi, updateTask as updateTaskApi } from "../../api";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { refresh, getCalender, setIsTodoListShowDialog } from "../../redux/calenderSlice";
import { getData } from "../../redux/authSlice";
import ENCHINTL from "../../lang/EN-CH.json";
import { dateToYYYYMMDDF } from "../../helper";
import { TaskDTO, NewTaskDTO, UpdateTaskDTO } from "../../type/todolist.dto";

const TodoListModal = ({ workspaceId }: { workspaceId?: number }) => {
    const dispatch = useAppDispatch();
    const intl = useAppSelector(getData).language;
    const token = useAppSelector(getData).accessToken;
    const { isTodoListShowDialog, newTask, action } = useAppSelector(getCalender);
    const [data, setData] = useState<TaskDTO>(newTask);
    const [visibleLine, setVisibleLine] = React.useState(false);
    const [showCalenderS, setShowCalenderS] = useState(false);
    const [showCalenderE, setShowCalenderE] = useState(false);
    const [showCalenderD, setShowCalenderD] = useState(false);
    const [error, setError] = useState({
        message: "",
        open: false,
    });
    const handleSubmit = async () => {
        if (!data.title) {
            setError({ message: ENCHINTL["error"]["todolist"]["modal"]["empty-title"][intl], open: true });
            return;
        }
        if (!data.description) {
            setError({ message: ENCHINTL["error"]["todolist"]["modal"]["empty-description"][intl], open: true });
            return;
        }
        if (!data.startTime) {
            setError({ message: ENCHINTL["error"]["todolist"]["modal"]["empty-starttime"][intl], open: true });
            return;
        }
        if (!data.endTime) {
            setError({ message: ENCHINTL["error"]["todolist"]["modal"]["empty-endtime"][intl], open: true });
            return;
        }
        if (data.startTime.localeCompare(data.endTime) > 0) {
            setError({ message: ENCHINTL["error"]["todolist"]["modal"]["invalid-endtime"][intl], open: true });
            return;
        }

        if (action == "Edit") {
            let payload: UpdateTaskDTO = {
                title: data.title,
                description: data.description,
                startTime: data.startTime,
                endTime: data.endTime,
            };
            const res = await updateTaskApi(data.id, payload, token);
            if (res.status && res.status < 400) {
                dispatch(setIsTodoListShowDialog(!isTodoListShowDialog));
                dispatch(refresh());
                Toast.success(ENCHINTL["toast"]["todolist"]["update-success"][intl]);
            } else {
                const err = res as AxiosError;
                if (err.response.status == 401) {
                    Toast.error(ENCHINTL["toast"]["common"]["token-expired"][intl]);
                }
            }
        } else if (action == "Create") {
            let payload: NewTaskDTO = {
                title: data.title,
                description: data.description,
                dueDate: dateToYYYYMMDDF(data.dueDate),
                startTime: data.startTime,
                endTime: data.endTime,
            };
            if (workspaceId != null || workspaceId !== undefined) payload.workspaceId = workspaceId;
            const res = await createTaskApi(payload, token);
            if (res.status && res.status < 400) {
                Toast.success(ENCHINTL["toast"]["todolist"]["create-success"][intl]);
                dispatch(setIsTodoListShowDialog(false));
                dispatch(refresh());
            } else {
                const err = res as AxiosError;
                if (err.response.status == 401) {
                    Toast.error(ENCHINTL["toast"]["common"]["token-expired"][intl]);
                }
            }
        }
    };
    const handleStartTimeChange = (date: moment.Moment) => {
        setShowCalenderS(false);
        setData({ ...data, startTime: date.format("YYYY-MM-DD hh:mm") });
    };
    const handleEndTimeChange = (date: moment.Moment) => {
        setShowCalenderE(false);
        setData({ ...data, endTime: date.format("YYYY-MM-DD hh:mm") });
    };
    const handleDueDateChange = (date: moment.Moment) => {
        setShowCalenderD(false);
        setData({ ...data, dueDate: date.format("YYYY-MM-DD") });
    };
    const handleInputChange = (name: string, value: string) => {
        setData({ ...data, [name]: value });
    };
    const hideModal = () => {
        dispatch(setIsTodoListShowDialog(false));
    };

    const showModalLine = () => setVisibleLine(true);
    const hideModalLine = () => setVisibleLine(false);

    const containerStyle = {
        flex: 1,
        margin: 0,
    };
    useEffect(() => {
        setData(newTask);
    }, [newTask]);
    return (
        <>
            <Portal>
                <Modal visible={isTodoListShowDialog} onDismiss={hideModalLine} contentContainerStyle={containerStyle}>
                    <Surface style={styles.containerStyle}>
                        <Appbar.Header style={{ width: "100%" }}>
                            <Appbar.BackAction onPress={hideModal} />
                            <Appbar.Content
                                title={`${
                                    action == "Edit"
                                        ? ENCHINTL["modal"]["todolist"]["title-d"]["update"][intl]
                                        : ENCHINTL["modal"]["todolist"]["title-d"]["create"][intl]
                                }`}
                            />
                        </Appbar.Header>
                        <SafeAreaView style={styles.safeContainerStyle}>
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
                                <Text style={styles.title_1}>{ENCHINTL["modal"]["todolist"]["title-p"][intl]}</Text>
                                <TextInput
                                    mode="outlined"
                                    value={data?.title}
                                    onChangeText={(text) => handleInputChange("title", text)}
                                />
                            </View>

                            <View style={{ flexGrow: 1 }}>
                                <Text style={styles.title_1}>
                                    {ENCHINTL["modal"]["todolist"]["description-p"][intl]}
                                </Text>
                                <TextInput
                                    mode="outlined"
                                    multiline={true}
                                    value={data?.description}
                                    onChangeText={(text) => handleInputChange("description", text)}
                                    style={{
                                        paddingTop: 8,
                                        flex: 1,
                                    }}
                                />
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                                <View>
                                    <Text style={styles.title_1}>
                                        {ENCHINTL["modal"]["todolist"]["due-date-p"][intl]}
                                    </Text>
                                    <View>
                                        <Button mode="contained-tonal" onPress={() => setShowCalenderD(true)}>
                                            {moment(data?.dueDate).format("YYYY-MM-DD")}
                                        </Button>
                                        {showCalenderD && (
                                            <RNDateTimePicker
                                                value={moment(data?.dueDate).toDate()}
                                                mode="date"
                                                minimumDate={moment(data?.dueDate).toDate()}
                                                onChange={(event: any, date: Date) => handleDueDateChange(moment(date))}
                                            />
                                        )}
                                    </View>
                                </View>
                                <View>
                                    <Text style={styles.title_1}>{ENCHINTL["modal"]["todolist"]["time-p"][intl]}</Text>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Button mode="contained-tonal" onPress={() => setShowCalenderS(true)}>
                                            {moment(data?.startTime).format("hh:mm A")}
                                        </Button>
                                        <Text> ~ </Text>
                                        <Button mode="contained-tonal" onPress={() => setShowCalenderE(true)}>
                                            {moment(data?.endTime).format("hh:mm A")}
                                        </Button>
                                    </View>
                                    {showCalenderS && (
                                        <RNDateTimePicker
                                            value={moment(data?.startTime).toDate()}
                                            mode="time"
                                            onChange={(event: any, date: Date) => handleStartTimeChange(moment(date))}
                                        />
                                    )}

                                    {showCalenderE && (
                                        <RNDateTimePicker
                                            value={moment(data?.endTime).toDate()}
                                            mode="time"
                                            minimumDate={moment(data?.startTime).toDate()}
                                            onChange={(event: any, date: Date) => handleEndTimeChange(moment(date))}
                                        />
                                    )}
                                </View>
                            </View>
                            <Button mode="contained" onPress={handleSubmit} style={{ marginTop: 20 }}>
                                {ENCHINTL["modal"]["schedule"]["button"]["submit"][intl]}
                            </Button>
                        </SafeAreaView>
                    </Surface>
                </Modal>
            </Portal>
        </>
    );
};

export default TodoListModal;

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
        position: "absolute",
        width: "100%",
        height: "100%",
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
