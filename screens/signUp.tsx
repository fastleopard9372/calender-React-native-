import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Text, Button, Icon, Chip } from "react-native-paper";
import { Link } from "@react-navigation/native";
import { Toast } from "toastify-react-native";
import { useAppSelector, useAppDispatch } from "../redux/hook";
import { getData, setLanguage } from "../redux/authSlice";
import LanguageBar from "../components/common/languageBar";
import ENCHINTL from "../lang/EN-CH.json";
import { signUp } from "../api";
import { SignUpDTO } from "../type";
import { AxiosError } from "axios";

const SignUp = (props) => {
    const intl = useAppSelector(getData).language;
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [eyeShow, setEyeShow] = useState<boolean>(true);
    async function handlerSignUpClick() {
        if (!firstName) {
            Toast.error(ENCHINTL["error"]["sign-up"]["empty-firstname"][intl]);
            return;
        }
        if (!lastName) {
            Toast.error(ENCHINTL["error"]["sign-up"]["empty-lastname"][intl]);
            return;
        }
        if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
            Toast.error(ENCHINTL["error"]["sign-up"]["invalid-email"][intl]);
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
        if (!email) {
            Toast.error(ENCHINTL["error"]["sign-up"]["empty-email"][intl]);
            return;
        }
        let payload: SignUpDTO = {
            firstName,
            lastName,
            email,
            password,
        };
        const res = await signUp(payload);
        if (res.status && res.status < 400) {
            Toast.success(ENCHINTL["toast"]["sign-up"]["sign-up-success"][intl]);
            props.navigation.navigate("SignIn");
        } else {
            const err = res as AxiosError;
            switch (err.response.status) {
                case 400:
                    Toast.error(ENCHINTL["toast"]["sign-up"]["duplicate-email"][intl]);
                    break;
                default:
                    break;
            }
        }
    }
    return (
        <View style={styles.container}>
            <View style={{ position: "absolute", zIndex: 100, top: 16, right: 16 }}>
                <LanguageBar />
            </View>
            <View>
                <View style={{ alignItems: "center" }}>
                    <Icon size={200} color="#6950A8" source="account-circle-outline" />
                    <Text variant="displayLarge" style={{ textAlign: "center", marginBottom: 48 }}>
                        {ENCHINTL["sign-up"]["title-p"][intl]}
                    </Text>
                </View>
                <View style={{ gap: 16 }}>
                    <TextInput
                        dense
                        label={ENCHINTL["sign-up"]["first-name-label"][intl]}
                        mode="outlined"
                        value={firstName}
                        onChangeText={(text) => setFirstName(text)}
                    />
                    <TextInput
                        dense
                        label={ENCHINTL["sign-up"]["last-name-label"][intl]}
                        mode="outlined"
                        value={lastName}
                        onChangeText={(text) => setLastName(text)}
                    />
                    <TextInput
                        dense
                        label={ENCHINTL["sign-up"]["email-label"][intl]}
                        mode="outlined"
                        inputMode="email"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />
                    <TextInput
                        dense
                        secureTextEntry={eyeShow}
                        label={ENCHINTL["sign-up"]["password-label"][intl]}
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
                <Button mode="contained" style={{ width: "100%" }} onPress={handlerSignUpClick}>
                    {ENCHINTL["sign-up"]["button"]["sign-up"][intl]}
                </Button>
                <View>
                    <Text variant="bodyLarge">
                        {ENCHINTL["sign-up"]["text1-p"][intl]}{" "}
                        <Link to={"/SignIn"}>
                            <Text style={{ textDecorationLine: "underline", color: "#3358D4" }}>
                                {ENCHINTL["sign-up"]["link"]["sign-in"][intl]}
                            </Text>
                        </Link>
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default SignUp;

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
