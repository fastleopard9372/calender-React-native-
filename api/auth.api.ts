import axios, { AxiosError, AxiosResponse } from "axios";
import config from "../config";
import { SignUpDTO, SignInDTO } from "../type";

export async function signUp(payload: SignUpDTO): Promise<AxiosError | AxiosResponse> {
    try {
        return await axios.post(`${config.base_url}/auth/signup`, { ...payload });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function signIn(payload: SignInDTO): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.post(`${config.base_url}/auth/signin`, { ...payload });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function signOut() {
    return true;
}

export async function getUserList(token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.get(`${config.base_url}/`);
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}
