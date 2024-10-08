import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Chip, Text, Divider, Menu, Avatar, Drawer, Button } from "react-native-paper";
import { useAppSelector, useAppDispatch } from "../../redux/hook";
import { getLanguage, getCalender, setKind } from "../../redux/calenderSlice";
import LanguageBar from "./languageBar";
import { getData } from "../../redux/authSlice";
import ENCHINTL from "../../lang/EN-CH.json";
const NavigationView = (props) => {
    const intl = useAppSelector(getData).language;
    const user = useAppSelector(getData).user;
    const view_mode = useAppSelector(getCalender).kind;
    const dispatch = useAppDispatch();
    const handleViewKind = (kind: string) => {
        dispatch(setKind(kind));
    };
    const handleSignOut = () => {
        // dispatch(setUserProps(null));
        props.closeNavigationView();
        props.navigation.navigate("SignIn");
    };
    const handleScreen = (screen) => {
        props.closeNavigationView();
        props.navigation.navigate(screen);
    };
    return (
        <View style={[styles.container, styles.navigationContainer]}>
            <View style={styles.navContainer}>
                <View style={styles.topContainer}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <Avatar.Text
                            size={40}
                            label={
                                user?.firstName?.toLocaleUpperCase().trim()[0] +
                                user?.lastName?.toLocaleUpperCase().trim()[0]
                            }
                        />
                        <Text style={{ fontSize: 18, fontWeight: "700" }}>
                            {user?.firstName + " " + user?.lastName}
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <LanguageBar />
                    </View>
                </View>
                <Divider />
                {props.route.name == "Calender" && (
                    <>
                        <View style={{ padding: 8 }}>
                            <Text>{ENCHINTL["calendar"]["toolbar"]["view-mode"]["title"][intl]}</Text>
                            <View style={styles.languageContainer}>
                                <Drawer.CollapsedItem
                                    focusedIcon="calendar-month"
                                    unfocusedIcon="calendar-month"
                                    label={ENCHINTL["calendar"]["toolbar"]["view-mode"]["month1"][intl]}
                                    active={view_mode == "month_1"}
                                    onPress={() => handleViewKind("month_1")}
                                />
                                <Drawer.CollapsedItem
                                    focusedIcon="calendar-month-outline"
                                    unfocusedIcon="calendar-month-outline"
                                    label={ENCHINTL["calendar"]["toolbar"]["view-mode"]["month2"][intl]}
                                    active={view_mode == "month_2"}
                                    onPress={() => handleViewKind("month_2")}
                                />
                                {/* <Drawer.CollapsedItem
                            focusedIcon="calendar-range-outline"
                            unfocusedIcon="calendar-range-outline"
                            label={ENCHINTL["calendar"]["toolbar"]["view-mode"]["week"][intl]}
                            active={view_mode == "week"}
                            onPress={() => handleViewKind("week")}
                        /> */}
                            </View>
                        </View>
                        <Divider />
                    </>
                )}
                <Menu.Item
                    onPress={() => handleScreen("Calender")}
                    title={ENCHINTL["header"]["nav-bar"]["calendar"][intl]}
                />
                <Menu.Item onPress={() => handleScreen("Note")} title={ENCHINTL["header"]["nav-bar"]["note"][intl]} />
                <Menu.Item
                    onPress={() => handleScreen("Library")}
                    title={ENCHINTL["header"]["nav-bar"]["library"][intl]}
                />
                <Menu.Item
                    onPress={() => handleScreen("Workspace")}
                    title={ENCHINTL["header"]["nav-bar"]["workspace"][intl]}
                />
                <Divider />
                <Button mode="contained" style={{ marginTop: 8 }} onPress={handleSignOut}>
                    {ENCHINTL["header"]["menu"]["sign-out"][intl]}
                </Button>
            </View>
        </View>
    );
};

export default NavigationView;

const styles = StyleSheet.create({
    languageContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 8,
        paddingLeft: 8,
        paddingRight: 8,
    },
    topContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 8,
        paddingLeft: 8,
        paddingRight: 8,
    },
    navContainer: {
        flex: 1,
        gap: 8,
    },
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        padding: 8,
        gap: 8,
    },
    navigationContainer: {
        backgroundColor: "#ecf0f1",
    },
    paragraph: {
        padding: 16,
        fontSize: 15,
        textAlign: "center",
    },
});
