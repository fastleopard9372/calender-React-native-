import axios, { AxiosResponse, AxiosError } from "axios";
import config from "../config";
import { NewScheduleDTO, UpdateScheduleDTO } from "../type";

export async function createSchedule(payload: NewScheduleDTO, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.post(config.base_url + "/schedule", payload, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function updateSchedule(
    id: number,
    payload: UpdateScheduleDTO,
    token: string
): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.put(config.base_url + `/schedule/${id}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function findAllSchedule(token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.get(config.base_url + `/schedule`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function removeSchedule(id: number, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.delete(config.base_url + `/schedule/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function findAllScheduleByDay(day: string, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.get(config.base_url + `/schedule/day`, {
            params: { day },
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function findAllScheduleOnWorkspaces(token: string, dueDate: string): Promise<AxiosError | AxiosResponse> {
    try {
        return await axios.get(`${config.base_url}/schedule/workspace`, {
            params: { dueDate },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function findAllScheduleByMonth(token: string, month: number, year: number) {
    try {
        return await axios.get(`${config.base_url}/schedule/month`, {
            params: {
                month,
                year,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}
