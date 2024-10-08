import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Text, Button, Icon, Chip } from "react-native-paper";
import { Link } from "@react-navigation/native";
import { AxiosError, AxiosResponse } from "axios";
import { Toast } from "toastify-react-native";
import LanguageBar from "../components/common/languageBar";
import { useAppSelector, useAppDispatch } from "../redux/hook";
import { getData, setUserProps, setAccessTokenProps } from "../redux/authSlice";
import ENCHINTL from "../lang/EN-CH.json";
import { signIn } from "../api";
import { SignInDTO } from "../type";
const SignIn = (props) => {
    const dispatch = useAppDispatch();
    const intl = useAppSelector(getData).language;
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [eyeShow, setEyeShow] = useState<boolean>(true);
    async function handlerSignInClick() {
        if (!email) {
            Toast.error(ENCHINTL["error"]["sign-up"]["empty-email"][intl]);
            return;
        }
        if (!password) {
            Toast.error(ENCHINTL["error"]["sign-up"]["empty-password"][intl]);
            return;
        }
        if (password.length < 6) {
            Toast.error(ENCHINTL["error"]["sign-up"]["invalid-short-password"][intl]);
            return;
        }
        if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
            Toast.error(ENCHINTL["error"]["sign-up"]["invalid-email"][intl]);
            return;
        }
        let payload: SignInDTO = {
            email,
            password,
        };
        const res = await signIn(payload);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            // localStorage.setItem("token", result.data.token);
            // localStorage.setItem("user", JSON.stringify(result.data.user));
            dispatch(setAccessTokenProps(result.data.token));
            dispatch(setUserProps(result.data.user));
            props.navigation.navigate("Calender");
        } else {
            const err = res as AxiosError;
            switch (err.response.status) {
                case 401:
                    Toast.error(ENCHINTL["toast"]["sign-in"]["incorrect-credential"][intl]);
                    return;
                default:
                    return;
            }
        }
        setEmail("");
        setPassword("");
    }
    return (
        <View style={styles.container}>
            <View style={{ position: "absolute", zIndex: 100, top: 16, right: 16 }}>
                <LanguageBar />
            </View>
            <View>
                <View style={{ alignItems: "center" }}>
                    <Icon size={200} color="#6950A8" source="account-circle-outline" />
                    <Text
                        variant="displayLarge"
                        style={{ textAlign: "center", marginBottom: 48 }}
                        onPress={handlerSignInClick}
                    >
                        {ENCHINTL["sign-in"]["title-p"][intl]}
                    </Text>
                </View>
                <View style={{ gap: 16 }}>
                    <TextInput
                        dense
                        label={ENCHINTL["sign-in"]["email-label"][intl]}
                        mode="outlined"
                        inputMode="email"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />
                    <TextInput
                        dense
                        secureTextEntry={eyeShow}
                        label={ENCHINTL["sign-in"]["password-label"][intl]}
                        mode="outlined"
                        value={password}
                        right={
                            <TextInput.Icon
                                icon={`${eyeShow ? "eye" : "eye-off"}`}
                                onPress={() => setEyeShow(!eyeShow)}
                            />
                        }
                        onChangeText={(text) => setPassword(text)}
                    />
                </View>
            </View>
            <View style={{ gap: 16, alignItems: "center" }}>
                <Button mode="contained" style={{ width: "100%" }} onPress={handlerSignInClick}>
                    {ENCHINTL["sign-in"]["button"]["sign-in"][intl]}
                </Button>
                <View>
                    <Text variant="bodyLarge">
                        {ENCHINTL["sign-in"]["text1-p"][intl]}{" "}
                        <Link to={"/SignUp"}>
                            <Text style={{ textDecorationLine: "underline", color: "#3358D4" }}>
                                {ENCHINTL["sign-in"]["link"]["sign-up"][intl]}
                            </Text>
                        </Link>
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default SignIn;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "space-between",
        padding: 32,
        gap: 16,
    },
});
