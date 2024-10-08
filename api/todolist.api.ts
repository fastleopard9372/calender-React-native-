import axios, { AxiosResponse, AxiosError } from "axios";
import config from "../config";
import { NewTaskDTO, UpdateTaskDTO } from "../type";

export async function createTask(payload: NewTaskDTO, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.post(`${config.base_url}/task`, payload, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function updateTask(
    id: number,
    payload: UpdateTaskDTO,
    token: string
): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.put(`${config.base_url}/task/${id}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function removeTask(id: number, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.delete(`${config.base_url}/task/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function findAllTask(token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.get(`${config.base_url}/task`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function findAllTaskByDay(day: string, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.get(`${config.base_url}/task/day`, {
            params: { day },
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function findAllTodoListOnWorkSpaces(token: string, dueDate: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.get(`${config.base_url}/task/workspace`, {
            params: { dueDate },
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}
