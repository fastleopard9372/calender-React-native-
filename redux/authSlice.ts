import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { UserDTO } from "../type";
const initialState: {
    user: UserDTO;
    accessToken: string;
    language: number;
} = {
    user: null,
    accessToken: "",
    language: 1,
};
export const AuthSlice = createSlice({
    name: "Auth",
    initialState,
    reducers: {
        setLanguage(state, action) {
            state.language = action.payload;
        },
        setUserProps(state, action) {
            state.user = action.payload;
        },
        setAccessTokenProps(state, action) {
            state.accessToken = action.payload;
        },
    },
});

export const { setLanguage, setUserProps, setAccessTokenProps } = AuthSlice.actions;
export const getData = (state: RootState) => state.Auth;

export default AuthSlice.reducer;
