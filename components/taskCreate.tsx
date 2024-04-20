import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { SelectList } from 'react-native-dropdown-select-list'
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Text, Portal, Modal, Surface, IconButton, TextInput, MD3Colors } from 'react-native-paper'
import DatePicker from "react-native-date-picker";
import { updateScheduleAPI, addScheduleAPI } from '../api/schedule'
import ColorIcon from './colorIcon';
// import LineThickness from './lineThickness';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { getCalender, setDate, updatePlan, addPlan, setIsShowDialog, setAction, setNewPlan, deletePlan } from '../redux/calenderSlice';
// import Alert from './alert';
import { TPlan, TScheduleKind } from '../type';


const TaskCreate = () => {
    const dispatch = useAppDispatch();
    const { isShowDialog, scheduleKind, colors, thickness, newPlan, action } = useAppSelector(getCalender);

    const [data, setData] = useState<TPlan>(newPlan)
    const [error, setError] = useState({
        message: "",
        open: false
    })
    const handleColorClick = (e: string) => {
        setData({ ...data, color: e })
    }
    const handleLineThicknessClick = (e: number) => {
        setData({ ...data, width: e })
    }
    const handleOpenChange = (open: boolean) => {
        dispatch(setIsShowDialog(open))
    }
    const handleSubmit = () => {
        if (moment(data.endDate).isBefore(data.startDate)) {
            setError({
                message: "End date must be after start date",
                open: true
            })
            return
        }
        if (data.kind == "-1" || data.kind == "") {
            setError({
                message: "Kind must be selected",
                open: true
            })
            return
        }
        if (data.title == "") {
            setError({
                message: "Title must be required",
                open: true
            })
            return
        }
        if (data.demo == "") {
            setError({
                message: "Demo must be required",
                open: true
            })
            return
        }
        if (action == "Edit") {
            updateScheduleAPI(data).then((schedule) => {
                dispatch(updatePlan(schedule.data))
                dispatch(setIsShowDialog(!isShowDialog))
                // toast.info("Plan is updated");
            }).catch(() => {
                setError({
                    message: "Server Error.",
                    open: true
                })
            })
        } else if ("Create") {
            addScheduleAPI(data).then((schedule) => {
                dispatch(addPlan(schedule.data))
                dispatch(setIsShowDialog(!isShowDialog))
                // toast.info("Plan is added newly");
            }).catch(() => {
                setError({
                    message: "Server Error.",
                    open: true
                })
            })
        }
    }
    const handleStartDateChange = (date: moment.Moment) => {
        setData({ ...data, startDate: date.format("YYYY-MM-DD") })
    }
    const handleEndDateChange = (date: moment.Moment) => {
        setData({ ...data, endDate: date.format("YYYY-MM-DD") })
    }
    const handleKind = (value: string) => {
        setData({ ...data, kind: value })
    }
    const handleInputChange = (name: string, value: any) => {
        setData({ ...data, [name]: value })
    }
    const hideModal = () => {
        dispatch(setIsShowDialog(false));
    }
    useEffect(() => {
        console.log("new plan")
        if (data.kind == "-1") {
            setError({
                message: "Kind must be started",
                open: true
            })
        } else {
            setError({ message: "", open: false })
        }
        if (moment(newPlan.endDate).isBefore(moment(newPlan.startDate))) {
            setError({
                message: "End date must be after start date",
                open: true
            })
        } else {
            setError({ message: "", open: false })
        }
        setData(newPlan);
    }, [newPlan])

    const kindSch = scheduleKind.map((v: TScheduleKind, i: number) =>
        ({ key: v._id, value: v.name })
    )
    const current_kindSch = action == "Edit" ? kindSch.find((v: any) => v.key == data.kind) : kindSch[0]
    const containerStyle = {
        flex: 1,
        margin: 0
    };
    return (
        <>
            <Portal>
                <Modal visible={isShowDialog} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                    <Surface style={styles.containerStyle}>
                        <SafeAreaView style={styles.safeContainerStyle}>
                            <IconButton icon={'close-circle'} iconColor={MD3Colors.primary40} size={32} onPress={hideModal} style={{ position: 'absolute', right: 10, top: 10, zIndex: 100 }} />
                            <View>
                                <Text variant="headlineLarge" style={styles.header}>Create Schedule</Text>
                            </View>
                            <View>
                                <TextInput
                                    label="Title"
                                    mode='outlined'
                                    value={data.title}
                                    onChange={(text) => handleInputChange("title", text)}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text>Line Color:</Text>
                                <View>
                                    {colors.map((v: string, i: number) => (
                                        <ColorIcon key={i} value={v} selected={v === data.color} handleClick={handleColorClick} />
                                    ))}
                                </View>
                            </View>
                            <View>
                                <TextInput
                                    label="Demo"
                                    mode='outlined'
                                    multiline={true}
                                    value={data.demo}
                                    onChange={(text) => handleInputChange("demo", text)}
                                    style={{
                                        minHeight: 400
                                    }}
                                />
                            </View>
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
                            {/* <View style={{ flex: 1, marginVertical: 10, borderColor: 'gray', borderWidth: 1, borderRadius: 10 }}>
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
                                {data && <Divider />}
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
                            /> */}
                        </SafeAreaView>
                    </Surface>
                </Modal>
            </Portal >

        </>
    )
}

export default TaskCreate


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
