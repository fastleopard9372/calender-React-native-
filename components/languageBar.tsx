import React from "react";
import { View } from "react-native";
import { Chip } from "react-native-paper";
import { useAppSelector, useAppDispatch } from "../redux/hook";
import { getData, setLanguage } from "../redux/authSlice";
const LanguageBar = () => {
    const intl = useAppSelector(getData).language;
    const dispatch = useAppDispatch();
    return (
        <Chip
            mode="flat"
            style={{ borderRadius: 0, padding: 0, width: 80 }}
            selectedColor="#ff0000"
            selected={true}
            onPress={() => {
                dispatch(setLanguage(1 - intl));
            }}
        >
            {intl == 1 ? "中文" : "En"}
        </Chip>
    );
};

export default LanguageBar;
