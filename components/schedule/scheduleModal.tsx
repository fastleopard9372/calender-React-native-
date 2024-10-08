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
    Appbar,
} from "react-native-paper";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Toast } from "toastify-react-native";
import { AxiosResponse, AxiosError } from "axios";
import { createSchedule as createScheduleApi, updateSchedule as updateScheduleApi } from "../../api";
import ColorIcon from "./colorIcon";
import LineThickness from "./lineThickness";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { refresh, getCalender, setIsShowDialog } from "../../redux/calenderSlice";
import { getData } from "../../redux/authSlice";
import ENCHINTL from "../../lang/EN-CH.json";
import { TScheduleKind } from "../../type/calender";
import { ScheduleDTO, NewScheduleDTO, UpdateScheduleDTO } from "../../type/schedule.dto";

const ScheduleModal = ({ workspaceId }: { workspaceId?: number }) => {
    const dispatch = useAppDispatch();
    const intl = useAppSelector(getData).language;
    const kind = useAppSelector(getCalender).kind;
    const token = useAppSelector(getData).accessToken;
    const { isShowDialog, scheduleKind, colors, thickness, newSchedule, action } = useAppSelector(getCalender);
    const [data, setData] = useState<ScheduleDTO>(newSchedule);
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
    const handleSubmit = async () => {
        if (moment(data?.endDate).isBefore(data?.startDate)) {
            setError({
                message: ENCHINTL["error"]["schedule"]["modal"]["invalid-end-date"][intl],
                open: true,
            });
            return;
        }
        if (data?.title == "") {
            setError({
                message: ENCHINTL["error"]["schedule"]["modal"]["empty-title"][intl],
                open: true,
            });
            return;
        }
        if (data?.description == "") {
            setError({
                message: ENCHINTL["error"]["schedule"]["modal"]["empty-content"][intl],
                open: true,
            });
            return;
        }
        if (action == "Edit") {
            let payload: UpdateScheduleDTO = {
                title: data.title,
                description: data.description,
                startDate: data.startDate,
                endDate: data.endDate,
                color: data.color,
                width: data.width,
                type: data.type,
            };
            const res = await updateScheduleApi(data.id, payload, token);
            if (res.status && res.status < 400) {
                dispatch(setIsShowDialog(!isShowDialog));
                dispatch(refresh());
                Toast.success(ENCHINTL["toast"]["schedule"]["update-success"][intl]);
            } else {
                const err = res as AxiosError;
                if (err.response.status == 401) {
                    Toast.error(ENCHINTL["toast"]["common"]["token-expired"][intl]);
                }
            }
        } else if (action == "Create") {
            let payload: NewScheduleDTO = {
                title: data.title,
                description: data.description,
                color: data.color,
                width: data.width,
                type: data.type,
                startDate: data.startDate,
                endDate: data.endDate,
            };
            if (workspaceId != null || workspaceId !== undefined) payload.workspaceId = workspaceId;
            const res = await createScheduleApi(payload, token);
            if (res.status && res.status < 400) {
                const result = res as AxiosResponse;
                dispatch(setIsShowDialog(!isShowDialog));
                dispatch(refresh());
                Toast.success(ENCHINTL["toast"]["schedule"]["create-success"][intl]);
            } else {
                const err = res as AxiosError;
                if (err.response.status == 401) {
                    Toast.error(ENCHINTL["toast"]["common"]["token-expired"][intl]);
                }
            }
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
    const handleInputChange = (name: string, value: string) => {
        setData({ ...data, [name]: value });
    };
    const hideModal = () => {
        dispatch(setIsShowDialog(false));
    };

    const showModalLine = () => setVisibleLine(true);
    const hideModalLine = () => setVisibleLine(false);
    useEffect(() => {
        if (data?.type == "-1") {
            setError({
                message: "Kind must be started",
                open: true,
            });
        } else {
            setError({ message: "", open: false });
        }
        if (moment(newSchedule?.endDate).isBefore(moment(newSchedule?.startDate))) {
            setError({
                message: "End date must be after start date",
                open: true,
            });
        } else {
            setError({ message: "", open: false });
        }
        setData(newSchedule);
    }, [newSchedule]);
    const containerStyle = {
        flex: 1,
        margin: 0,
    };
    return (
        <>
            <Portal>
                <Modal visible={isShowDialog} onDismiss={hideModalLine} contentContainerStyle={containerStyle}>
                    <Surface style={styles.containerStyle}>
                        <Appbar.Header style={{ width: "100%" }}>
                            <Appbar.BackAction onPress={hideModal} />
                            <Appbar.Content
                                title={`${
                                    action == "Edit"
                                        ? ENCHINTL["modal"]["schedule"]["title-d"]["update"][intl]
                                        : ENCHINTL["modal"]["schedule"]["title-d"]["create"][intl]
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
                                <Text style={styles.title_1}>{ENCHINTL["modal"]["schedule"]["title-p"][intl]}</Text>
                                <TextInput
                                    mode="outlined"
                                    value={data?.title}
                                    onChangeText={(text) => handleInputChange("title", text)}
                                />
                            </View>

                            <View style={{ flexGrow: 1 }}>
                                <Text style={styles.title_1}>
                                    {ENCHINTL["modal"]["schedule"]["description-p"][intl]}
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
                                        {ENCHINTL["modal"]["schedule"]["bar-setting"][intl]}
                                    </Text>
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
                                    <Text style={styles.title_1}>
                                        {ENCHINTL["modal"]["schedule"]["width-bar-p"][intl]}
                                    </Text>
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
                            </View>
                            <Button mode="contained" onPress={handleSubmit} style={{ marginTop: 20 }}>
                                {ENCHINTL["modal"]["schedule"]["button"]["submit"][intl]}
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
                            {ENCHINTL["modal"]["schedule"]["bar-setting"][intl]}
                        </Text>
                    </View>
                    <IconButton
                        icon={"close-circle"}
                        iconColor={MD3Colors.primary40}
                        size={32}
                        onPress={hideModalLine}
                        style={{ position: "absolute", right: 10, top: 10, zIndex: 100 }}
                    />
                    <Text>{ENCHINTL["modal"]["schedule"]["color-bar-p"][intl]}</Text>
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
                    <Text style={{ marginTop: 20 }}>{ENCHINTL["modal"]["schedule"]["width-bar-p"][intl]}</Text>
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

export default ScheduleModal;

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
