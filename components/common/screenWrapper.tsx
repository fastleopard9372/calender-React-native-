import React, { useRef } from "react";
import NavigationView from "./navigationView";
import { View, DrawerLayoutAndroid } from "react-native";
import { PaperProvider } from "react-native-paper";
import Header from "../../layout/Header";
const ScreenWrapper = (props) => {
    const drawer = useRef(null);
    const navigationView = (props) => (
        <NavigationView closeNavigationView={() => drawer.current?.closeDrawer()} {...props} />
    );
    return (
        <DrawerLayoutAndroid
            ref={drawer}
            drawerWidth={300}
            drawerPosition="left"
            renderNavigationView={() => navigationView(props)}
        >
            <PaperProvider>
                <View style={{ flex: 1, gap: 0 }}>
                    <Header handleDrawer={() => drawer.current?.openDrawer()} {...props} />
                    {props.children}
                </View>
            </PaperProvider>
        </DrawerLayoutAndroid>
    );
};
export default ScreenWrapper;
