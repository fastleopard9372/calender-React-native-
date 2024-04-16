import axios from "axios";
import moment from "moment";
import config from "../config";
import { TPlan } from "../type";

export const addScheduleAPI = (data: TPlan) => {

    return axios.post(config.base_url + '/schedule', {
        title: data.title,
        demo: data.demo,
        startDate: data.startDate,
        endDate: data.endDate,
        width: data.width,
        color: data.color,
        kind: data.kind,
        user: data.user.username
    })
}
export const getSchedulesAPI = ({ startDate, endDate }: { startDate: moment.Moment, endDate: moment.Moment }) => {
    const cfg = {
        // headers: {
        //     "Authorization": "Bearer " + access_token
        // }
    }
    return axios.post(config.base_url + '/schedule/read',
        {
            startDate: startDate.format("YYYY-MM-DD"),
            endDate: endDate.format("YYYY-MM-DD"),
        })
};
export const updateScheduleAPI = (plan: TPlan) => {
    const cfg = {
        // headers: {
        //     "Authorization": "Bearer " + access_token
        // }
    }
    return axios.put(config.base_url + '/schedule/' + plan._id, plan)
};
export const deleteScheduleAPI = (id: string) => {
    const cfg = {
        // headers: {
        //     "Authorization": "Bearer " + access_token
        // }
    }
    return axios.delete(config.base_url + '/schedule/' + id)
};

export const getScheduleKindAPI = () => {
    return axios.get(config.base_url + '/schedule_kind',)
};