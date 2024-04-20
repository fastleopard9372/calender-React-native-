import React, { useEffect, useState, useRef } from 'react'
import moment from 'moment'
import { SelectList } from 'react-native-dropdown-select-list'
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Text, Portal, Modal, Surface, IconButton, Badge, Divider, MD3Colors } from 'react-native-paper'
import AlertPro from "react-native-alert-pro";
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { getCalender, setDate, setIsTaskShowShowDialog, setIsShowDialog, setAction, setNewPlan, deletePlan } from '../redux/calenderSlice';
import { deleteScheduleAPI } from '../api/schedule'
// import Alert from './alert';
import { TPlan, TScheduleKind } from '../type';

function cutString(str: string, len: number): string {
    if (str.length > len) {
        return str.substring(0, len) + " ...";
    }
    return str;
}

const TaskShow = () => {
    const dispatch = useAppDispatch();
    const alertRef = useRef(null);
    const { plan, scheduleKind } = useAppSelector(getCalender);
    const date = moment(useAppSelector(getCalender).date)
    const [data, setData] = useState<TPlan | undefined>(plan == undefined ? undefined : plan[0])
    const { isTaskShowShowDialog } = useAppSelector(getCalender);
    const list = plan?.filter((v: TPlan, i: number) =>
        (date.isBetween(v.startDate, v.endDate, "day", "[]")))
        .map((v, i) => ({ key: i, value: cutString(v.title, 60) }))
    const hideModal = () => {
        dispatch(setIsTaskShowShowDialog(false));
    }
    const handleDataShow = (i: number) => {
        setData(plan == undefined ? undefined : plan[i]);
    }
    const handleEdit = (data: TPlan | undefined) => {
        dispatch(setAction("Edit"));
        dispatch(setNewPlan(data));
        dispatch(setIsTaskShowShowDialog(false));
        dispatch(setIsShowDialog(true));
    }
    const handleCreate = (date: moment.Moment) => {
        dispatch(setNewPlan({
            id: "",
            color: 'indigo',
            width: 2,
            startDate: date.format("YYYY-MM-DD"),
            endDate: date.format("YYYY-MM-DD"),
            demo: "",
            kind: "",
            title: "",
            user: {
                id: "",
                name: "",
                email: "",
            }
        }))
        dispatch(setAction("Create"))
        dispatch(setIsShowDialog(true))
        dispatch(setIsTaskShowShowDialog(false));
    }
    const handleDelete = () => {
        alertRef.current.open();
    }
    const handleDeleteOk = () => {
        const id = data._id;
        console.log(id)
        alertRef.current.open();
        deleteScheduleAPI(id).then((schedule) => {
            dispatch(deletePlan(schedule.data.id))
            // toast.info("Plan is deleted");
        }).catch(() => {

        })
    }
    useEffect(() => {
        if (plan !== undefined) {
            for (let i = 0; plan?.length; i++) {
                if (plan[i] == undefined) {
                    setData(undefined);
                    break;
                }
                if (date.isBetween(plan[i].startDate, plan[i].endDate, "day", "[]")) {
                    setData(plan[i]);
                    break;
                }
            }
        }
    }, [plan])
    const temp = scheduleKind.find((v: TScheduleKind) => data?.kind == v._id);
    const kind = temp == undefined ? "-1" : temp.name
    const containerStyle = {
        flex: 1,
        margin: 0
    };
    return (
        <>
            <Portal>
                <Modal visible={isTaskShowShowDialog} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                    <Surface style={styles.containerStyle}>
                        <SafeAreaView style={styles.safeContainerStyle}>
                            <IconButton icon={'close-circle'} iconColor={MD3Colors.primary40} size={32} onPress={hideModal} style={{ position: 'absolute', right: 10, top: 10, zIndex: 100 }} />
                            <View>
                                <Text variant="headlineLarge" style={styles.header}>{date.format("YYYY-MM-DD")}</Text>
                            </View>
                            <SelectList
                                setSelected={(val: number) => handleDataShow(val)}
                                data={list}
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
                                defaultOption={list?.length > 0 ? list[0] : { key: "", value: "" }}
                            />
                            <View style={{ flex: 1, marginVertical: 10, borderColor: 'gray', borderWidth: 1, borderRadius: 10 }}>
                                <View style={{
                                    margin: 10,
                                    flexWrap: "wrap",
                                    flexDirection: "row",
                                    gap: 10
                                }}>
                                    {data == undefined && <Text variant="titleLarge" style={styles.title}>There is no schedule to display</Text>}
                                    <Text variant="titleLarge">{data?.title}</Text>
                                    {kind !== "-1" && <Badge style={{ paddingHorizontal: 10 }}>{kind}</Badge>}
                                </View>
                                {data &&
                                    <View style={{
                                        width: '96%',
                                        height: data.width,
                                        marginStart: '2%',
                                        backgroundColor: data.color
                                    }}></View>}
                                <View style={{ margin: 10 }}>
                                    <Text variant='labelLarge'>{data?.demo}</Text>
                                </View>
                                {data && <Divider />}
                                <View>
                                    <Text variant='labelSmall' style={{ margin: 10, color: '#555', textAlign: 'center' }}>
                                        {
                                            data != undefined && (moment(data?.endDate).isSame(moment(data.startDate)) ?
                                                `${moment(data?.startDate).format("YYYY-MM-DD")}` :
                                                `${moment(data?.startDate).format("YYYY-MM-DD")} ~ ${moment(data?.endDate).format("YYYY-MM-DD")} (${moment(data?.endDate).diff(moment(data?.startDate), 'days') + 1} days)`)
                                        }
                                    </Text>
                                </View>
                                <View style={{ position: 'absolute', bottom: 0, right: 0 }}>
                                    <IconButton icon={'plus-circle'} size={40} iconColor={MD3Colors.primary40} style={{ margin: 0 }} onPress={e => handleEdit(data)} />
                                    {data &&
                                        <>
                                            <IconButton icon={'pencil-circle'} iconColor={MD3Colors.primary40} style={{ margin: 0 }} size={40} onPress={e => handleCreate(date)} />
                                            <IconButton icon={'delete-circle'} size={40} iconColor={MD3Colors.primary40} style={{ margin: 0, marginBottom: 40 }} onPress={handleDelete} />
                                        </>
                                    }
                                </View>
                            </View>
                            <AlertPro
                                ref={alertRef}
                                onConfirm={handleDeleteOk}
                                onCancel={() => alertRef.current.close()}
                                message="Are you sure to delete this plan?"
                                textCancel="No"
                                textConfirm="Yes"
                                customStyles={{
                                    mask: {
                                        // backgroundColor: "transparent"
                                    },
                                    container: {
                                        borderWidth: 1,
                                        borderColor: "#9900cc",
                                        shadowColor: "#000000",
                                        shadowOpacity: 0.1,
                                        shadowRadius: 20
                                    },
                                    buttonCancel: {
                                        backgroundColor: 'gray',
                                        borderRadius: 30
                                    },
                                    buttonConfirm: {
                                        backgroundColor: MD3Colors.primary40,
                                        borderRadius: 30
                                    }
                                }}
                            />
                        </SafeAreaView>
                    </Surface>
                </Modal>
            </Portal>

        </>
    )
}

export default TaskShow


const styles = StyleSheet.create({
    container: {
        // flex: 1,
    },
    header: {
        textAlign: 'center'
    },
    title: {
        textAlign: 'center',
    },
    pickerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    picker: {
        width: '100%',
        marginBottom: 16,
    },
    containerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    safeContainerStyle: {
        flex: 1,
        padding: 20,
        justifyContent: 'flex-start',
        position: 'relative',
        width: '100%',
    },
});
