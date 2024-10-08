import axios, { AxiosResponse, AxiosError } from "axios";
import config from "../config";
import { NewNoteDTO, UpdateNoteDTO } from "../type";

export async function createNote(payload: NewNoteDTO, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.post(`${config.base_url}/note`, payload, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function updateNote(
    id: number,
    payload: UpdateNoteDTO,
    token: string
): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.put(`${config.base_url}/note/${id}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function removeNote(id: number, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.delete(`${config.base_url}/note/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function findAllNote(token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.get(`${config.base_url}/note`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function findAllNoteByDay(day: string, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.get(`${config.base_url}/note/day`, {
            params: { day },
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function findAllNoteOnWorkspaces(token: string): Promise<AxiosError | AxiosResponse> {
    try {
        return await axios.get(`${config.base_url}/note/workspace`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}
