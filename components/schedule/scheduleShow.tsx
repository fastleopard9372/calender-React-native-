import React from "react";
import { View } from "react-native";
import { Text, IconButton, MD3Colors, Divider, Appbar, Icon } from "react-native-paper";
import moment from "moment";
import { ScheduleDTO } from "../../type";
const ScheduleShow = ({
    data,
    handleEdit,
    handleDelete,
    handleClose,
}: {
    data: ScheduleDTO;
    handleEdit: (ScheduleDTO) => void;
    handleDelete: () => void;
    handleClose: () => void;
}) => {
    return (
        <View
            style={{
                flex: 1,
                width: "100%",
            }}
        >
            <Appbar.Header style={{ width: "100%" }}>
                <Appbar.BackAction onPress={handleClose} />
                <Appbar.Content title={data.title} />
            </Appbar.Header>
            <View
                style={{
                    width: "100%",
                    height: data.width,
                    backgroundColor: data.color,
                }}
            ></View>
            <View style={{ margin: 10 }}>
                <Text variant="bodyLarge">{data.description}</Text>
            </View>
            <Divider />
            <View>
                <Text variant="labelLarge" style={{ margin: 10, color: "#555", textAlign: "right" }}>
                    <Icon source={"calendar-month"} size={20} />{" "}
                    {moment(data.endDate).isSame(moment(data.startDate))
                        ? `${moment(data.startDate).format("YYYY-MM-DD")}`
                        : `${moment(data.startDate).format("YYYY-MM-DD")} ~ ${moment(data.endDate).format(
                              "YYYY-MM-DD"
                          )} (${moment(data.endDate).diff(moment(data.startDate), "days") + 1} days)`}
                </Text>
            </View>
            <View style={{ position: "absolute", bottom: -30, right: 0 }}>
                {data && (
                    <>
                        <IconButton
                            icon={"pencil-circle"}
                            iconColor={MD3Colors.primary40}
                            style={{ margin: 0 }}
                            size={40}
                            onPress={(e) => handleEdit(data)}
                        />
                        <IconButton
                            icon={"delete-circle"}
                            size={40}
                            iconColor={MD3Colors.primary40}
                            style={{ margin: 0, marginBottom: 40 }}
                            onPress={handleDelete}
                        />
                    </>
                )}
            </View>
        </View>
    );
};

export default ScheduleShow;
