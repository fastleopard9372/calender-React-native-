import React from "react";
import { View } from "react-native";
import { Text, IconButton, MD3Colors, Divider, Appbar } from "react-native-paper";
import moment from "moment";
import { TaskDTO } from "../../type";
const TodoListShow = ({
    data,
    handleEdit,
    handleDelete,
    handleClose,
}: {
    data: TaskDTO;
    handleEdit: (TaskDTO) => void;
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
            <View style={{ margin: 10 }}>
                <Text variant="bodyLarge">{data.description}</Text>
            </View>
            <Divider />
            <View>
                <Text variant="labelLarge" style={{ margin: 10, color: "#555", textAlign: "right" }}>
                    {moment(data.dueDate).format("YYYY-MM-DD")} : {moment(data.startTime).format("hh:mm A")} ~ $
                    {moment(data.endTime).format("hh:mm A")}
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

export default TodoListShow;
