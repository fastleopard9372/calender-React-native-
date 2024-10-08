import { StatusBar } from "expo-status-bar";
import React from "react";
import { Provider } from "react-redux";
import { StyleSheet, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import ToastManager from "toastify-react-native";
import { store } from "./redux/store";
import Header from "./layout/Header";
import Calender from "./screens/calender";
import Workspace from "./screens/workspace";
import Library from "./screens/library";
import Note from "./screens/note";
import NavigationView from "./components/common/navigationView";
import SignIn from "./screens/signIn";
import SignUp from "./screens/signUp";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="SignIn" component={SignIn} />
                    <Stack.Screen name="SignUp" component={SignUp} />
                    <Stack.Screen name="Calender" component={Calender} />
                    <Stack.Screen name="Library" component={Library} />
                    <Stack.Screen name="Workspace" component={Workspace} />
                    <Stack.Screen name="Note" component={Note} />
                </Stack.Navigator>
            </NavigationContainer>
            <ToastManager width={400} />
        </Provider>
    );
}

{
    /* <StatusBar style="auto" /> */
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "space-between",
    },
});
