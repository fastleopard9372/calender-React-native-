import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { StyleSheet, View } from "react-native";
import { Text, Portal, Modal, Appbar, Surface, List, MD3Colors } from "react-native-paper";
import AlertPro from "react-native-alert-pro";
import { Toast } from "toastify-react-native";
import { AxiosResponse, AxiosError } from "axios";
import ENCHINTL from "../lang/EN-CH.json";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import ScheduleShow from "./schedule/scheduleShow";
import {
    getCalender,
    setIsTaskShowShowDialog,
    setIsShowDialog,
    setAction,
    setNewSchedule,
    refresh,
    setNewTask,
    setIsTodoListShowDialog,
} from "../redux/calenderSlice";
import { getData } from "../redux/authSlice";
import {
    findAllScheduleByDay,
    findAllScheduleOnWorkspaces,
    findAllTaskByDay,
    findAllTodoListOnWorkSpaces,
} from "../api";
import { removeSchedule as removeScheduleApi } from "../api";
import { ScheduleOnWorkSpaces, TodoListOnWorkSpaces, ScheduleDTO, TaskDTO } from "../type";
import TodoListShow from "./todolistModal/todolistShow";

function cutString(str: string, len: number): string {
    if (str.length > len) {
        return str.substring(0, len) + " ...";
    }
    return str;
}

const ListShow = () => {
    const dispatch = useAppDispatch();
    const alertRef = useRef(null);
    const token = useAppSelector(getData).accessToken;
    const intl = useAppSelector(getData).language;
    const activeDate = useAppSelector(getCalender).date;
    const [privateScheduleList, setPrivateScheduleList] = useState<Array<ScheduleDTO>>([]);
    const [workspaceScheduleList, setWorkSpaceScheduleList] = useState<Array<ScheduleOnWorkSpaces>>([]);
    const [privateTodoList, setPrivateTodoList] = useState<Array<TaskDTO>>([]);
    const [workspaceTodoList, setWorkSpaceTodoList] = useState<Array<TodoListOnWorkSpaces>>([]);
    const date = moment(useAppSelector(getCalender).date);
    const { isTaskShowShowDialog } = useAppSelector(getCalender);
    const [viewList, setViewList] = useState<{
        isShow: boolean;
        kind: "SCHEDULE" | "TODOLIST";
        data: ScheduleDTO | TaskDTO | null;
    }>({
        isShow: false,
        kind: "SCHEDULE",
        data: null,
    });
    const hideModal = () => {
        dispatch(setIsTaskShowShowDialog(false));
    };
    const handleClose = () => {
        setViewList({ ...viewList, isShow: false });
    };
    const handleScheduleEdit = (data: ScheduleDTO) => {
        dispatch(setNewSchedule(data));
        dispatch(setAction("Edit"));
        dispatch(setIsShowDialog(true));
        hideModal();
    };
    const handleTodoListEdit = (data: TaskDTO) => {
        dispatch(setNewTask(data));
        dispatch(setAction("Edit"));
        dispatch(setIsTodoListShowDialog(true));
        hideModal();
    };
    const handleDelete = () => {
        alertRef.current.open();
    };
    const handleDeleteOk = async () => {
        const id = viewList.data.id;
        alertRef.current.close();
        const res = await removeScheduleApi(id, token);
        if (res.status && res.status < 400) {
            setPrivateScheduleList(privateScheduleList.filter((a) => a.id !== id));
            Toast.success(ENCHINTL["toast"]["schedule"]["remove-success"][intl]);
            dispatch(refresh());
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                Toast.error(ENCHINTL["toast"]["common"]["token-expired"][intl]);
            }
        }
    };
    async function handlerFindAllPrivateSchedule() {
        const res = await findAllScheduleByDay(date.format("YYYY-MM-DD"), token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setPrivateScheduleList([...result.data]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                Toast.error(ENCHINTL["toast"]["common"]["token-expired"][intl]);
            }
        }
    }

    async function handlerFindAllWorkSpaceSchedule() {
        const res = await findAllScheduleOnWorkspaces(token, date.format("YYYY-MM-DD"));
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setWorkSpaceScheduleList(result.data);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                Toast.error(ENCHINTL["toast"]["common"]["token-expired"][intl]);
            }
        }
    }

    async function handlerFindAllPrivateTodoList() {
        const res = await findAllTaskByDay(date.format("YYYY-MM-DD"), token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setPrivateTodoList([...result.data]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                Toast.error(ENCHINTL["toast"]["common"]["token-expired"][intl]);
            }
        }
    }

    async function handlerFindAllTodoListOnWorkSpaces() {
        const res = await findAllTodoListOnWorkSpaces(token, date.format("YYYY-MM-DD"));
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setWorkSpaceTodoList(result.data);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                Toast.error(ENCHINTL["toast"]["common"]["token-expired"][intl]);
            }
        }
    }

    const handlePrivateSchedule = (id) => {
        setViewList({
            isShow: true,
            kind: "SCHEDULE",
            data: privateScheduleList.find((item: ScheduleDTO) => item.id == id),
        });
    };
    const handlePrivateTodoList = (id) => {
        setViewList({
            isShow: true,
            kind: "TODOLIST",
            data: privateTodoList.find((item: TaskDTO) => item.id == id),
        });
    };

    useEffect(() => {
        handlerFindAllPrivateSchedule();
        handlerFindAllWorkSpaceSchedule();
        handlerFindAllPrivateTodoList();
        handlerFindAllTodoListOnWorkSpaces();
        setViewList({ ...viewList, isShow: false, data: null });
    }, [activeDate]);
    useEffect(() => {
        if (isTaskShowShowDialog == true) {
            setViewList({ ...viewList, isShow: false });
        }
    }, [isTaskShowShowDialog]);
    const containerStyle = {
        flex: 1,
        margin: 0,
    };
    return (
        <Portal>
            <Modal visible={isTaskShowShowDialog} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                <Surface style={styles.containerStyle}>
                    {viewList.isShow ? (
                        viewList.kind == "SCHEDULE" ? (
                            <ScheduleShow
                                data={viewList.data as ScheduleDTO}
                                handleDelete={handleDelete}
                                handleEdit={() => handleScheduleEdit(viewList.data as ScheduleDTO)}
                                handleClose={handleClose}
                            />
                        ) : (
                            <TodoListShow
                                data={viewList.data as TaskDTO}
                                handleDelete={handleDelete}
                                handleEdit={() => handleTodoListEdit(viewList.data as TaskDTO)}
                                handleClose={handleClose}
                            />
                        )
                    ) : (
                        <>
                            <Appbar.Header style={{ width: "100%" }}>
                                <Appbar.BackAction onPress={hideModal} />
                                <Appbar.Content title={date.format("YYYY-MM-DD")} />
                            </Appbar.Header>
                            <View style={{ width: "100%" }}>
                                <List.AccordionGroup>
                                    <Text variant="titleLarge" style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
                                        {ENCHINTL["side-bar"]["schedule"]["tab"][intl]}
                                    </Text>
                                    <List.Accordion
                                        title={ENCHINTL["side-bar"]["schedule"]["personal-schedule-p"][intl]}
                                        titleStyle={{ fontSize: 20 }}
                                        id="1"
                                    >
                                        {privateScheduleList?.map((item: ScheduleDTO, index: number) => (
                                            <List.Item
                                                key={index}
                                                title={cutString(item.title, 60)}
                                                onPress={() => {
                                                    handlePrivateSchedule(item.id);
                                                }}
                                            ></List.Item>
                                        ))}
                                    </List.Accordion>
                                    <List.Accordion
                                        title={ENCHINTL["side-bar"]["schedule"]["workspace-schedule-p"][intl]}
                                        titleStyle={{ fontSize: 20 }}
                                        id="2"
                                    >
                                        <List.Item title="Item 1" />
                                        <List.Item title="Item 2" />
                                        <List.Item title="Item 2" />
                                    </List.Accordion>
                                    <Text variant="titleLarge" style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
                                        {ENCHINTL["side-bar"]["todolist"]["tab"][intl]}
                                    </Text>
                                    <List.Accordion
                                        title={ENCHINTL["side-bar"]["todolist"]["personal-todolist-p"][intl]}
                                        titleStyle={{ fontSize: 20 }}
                                        id="3"
                                    >
                                        {privateTodoList?.map((item: TaskDTO, index: number) => (
                                            <List.Item
                                                key={index}
                                                title={cutString(item.title, 60)}
                                                onPress={() => {
                                                    handlePrivateTodoList(item.id);
                                                }}
                                            ></List.Item>
                                        ))}
                                    </List.Accordion>
                                    <List.Accordion
                                        title={ENCHINTL["side-bar"]["todolist"]["workspace-todolist-p"][intl]}
                                        titleStyle={{ fontSize: 20 }}
                                        id="4"
                                    >
                                        <List.Item title="Item 1" />
                                        <List.Item title="Item 2" />
                                        <List.Item title="Item 2" />
                                    </List.Accordion>
                                </List.AccordionGroup>
                            </View>
                        </>
                    )}
                    <AlertPro
                        ref={alertRef}
                        title={""}
                        onConfirm={handleDeleteOk}
                        onCancel={() => alertRef.current.close()}
                        message={ENCHINTL["toast"]["schedule"]["confirm"][intl]}
                        textCancel={ENCHINTL["toast"]["schedule"]["no"][intl]}
                        textConfirm={ENCHINTL["toast"]["schedule"]["yes"][intl]}
                        customStyles={{
                            mask: {},
                            container: {
                                borderWidth: 1,
                                borderColor: "#9900cc",
                                shadowColor: "#000000",
                                shadowOpacity: 0.1,
                                shadowRadius: 20,
                            },
                            buttonCancel: {
                                backgroundColor: "gray",
                                borderRadius: 30,
                            },
                            buttonConfirm: {
                                backgroundColor: MD3Colors.primary40,
                                borderRadius: 30,
                            },
                        }}
                    />
                </Surface>
            </Modal>
        </Portal>
    );
};

export default ListShow;

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
        justifyContent: "flex-start",
        alignItems: "center",
    },
    safeContainerStyle: {
        flex: 1,
        padding: 20,
        justifyContent: "flex-start",
        position: "relative",
        width: "100%",
    },
});
