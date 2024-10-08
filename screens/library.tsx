import React from "react";
import { View, Text } from "react-native";
import ScreenWrapper from "../components/common/screenWrapper";
const Library = () => {
    return (
        <View>
            <Text>Library</Text>
        </View>
    );
};
const LibraryScreen = (props) => {
    return (
        <ScreenWrapper {...props}>
            <Library />
        </ScreenWrapper>
    );
};
export default LibraryScreen;
