import React from "react";
import { View, Text } from "react-native";
import ScreenWrapper from "../components/common/screenWrapper";
const Note = () => {
    return (
        <View>
            <Text>Note</Text>
        </View>
    );
};
const NoteScreen = (props) => {
    return (
        <ScreenWrapper {...props}>
            <Note />
        </ScreenWrapper>
    );
};
export default NoteScreen;
