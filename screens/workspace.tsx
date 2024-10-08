import React from "react";
import { View, Text } from "react-native";
import ScreenWrapper from "../components/common/screenWrapper";
const Workspace = () => {
    return (
        <View>
            <Text>Workspace</Text>
        </View>
    );
};
const WorkspaceScreen = (props) => {
    return (
        <ScreenWrapper {...props}>
            <Workspace />
        </ScreenWrapper>
    );
};
export default WorkspaceScreen;
