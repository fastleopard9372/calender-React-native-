import React, { useState } from "react";
import { Button, IconButton, Appbar, PaperProvider, Menu, Avatar } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import moment from "moment";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useAppSelector, useAppDispatch } from "../redux/hook";
import { setDate, setKind, getCalender } from "../redux/calenderSlice";
import { getData, setUserProps } from "../redux/authSlice";

import ENCHINTL from "../lang/EN-CH.json";
const Header = (props) => {
    const intl = useAppSelector(getData).language;
    const user = useAppSelector(getData).user;
    const [visible, setVisible] = useState({
        year: false,
        month: false,
        kind_flag: false,
    });
    const [showCalender, setShowCalender] = useState(false);
    const dispatch = useAppDispatch();
    const date = moment(useAppSelector(getCalender).date);
    const showKind = useAppSelector(getCalender).kind;
    const handleClickMonth = (kind, value) => {
        if (showKind == "week") dispatch(setDate(date.clone().add(value, "weeks").format("20YY-MM-DD")));
        else dispatch(setDate(date.clone().add(value, "months").format("20YY-MM-DD")));
    };
    const handleClickToday = () => {
        dispatch(setDate(moment(new Date()).format("20YY-MM-DD")));
    };
    const handleClickKind = (m_kind) => {
        dispatch(setKind(m_kind));
        closeMenu();
    };
    const handleDateChange = (date) => {
        setShowCalender(false);
        dispatch(setDate(date.format("20YY-MM-DD")));
    };
    const openMenuKind = () => setVisible({ year: false, month: false, kind_flag: true });
    const closeMenu = () => setVisible({ year: false, month: false, kind_flag: false });
    return (
        <PaperProvider>
            <Appbar.Header style={styles.app}>
                <Appbar.Action
                    icon="menu"
                    onPress={() => {
                        props.handleDrawer();
                    }}
                />
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Button mode="elevated" onPress={handleClickToday}>
                        {ENCHINTL["calendar"]["toolbar"]["button"]["today"][intl]}
                    </Button>
                    <Appbar.Action icon="arrow-left" onPress={() => handleClickMonth("months", -1)} />
                    <Button mode="elevated" onPress={() => setShowCalender(true)}>
                        {moment(useAppSelector(getCalender).date).format("YYYY - MM")}
                    </Button>
                    {showCalender && (
                        <RNDateTimePicker
                            value={moment(date).toDate()}
                            display="spinner"
                            mode="date"
                            onChange={(e, date) => handleDateChange(moment(date))}
                        />
                    )}
                    <Appbar.Action icon="arrow-right" onPress={() => handleClickMonth("months", 1)} />
                </View>
                <Avatar.Text
                    size={40}
                    label={user.firstName.toLocaleUpperCase().trim()[0] + user.lastName.toLocaleUpperCase().trim()[0]}
                />
            </Appbar.Header>
        </PaperProvider>
    );
};
const styles = StyleSheet.create({
    app: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: 16,
    },
});
export default Header;
