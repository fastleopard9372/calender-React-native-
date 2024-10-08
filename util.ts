import moment from "moment";

export const dateToYYYYMMDDF = (date: Date | string): string => {
    return moment(date).format('YYYY-MM-DD');
}

export const getDateTime = (date: Date | string): string => {
    return moment(date).format('YYYY-MM-DD HH:MM:SS')
}

export const compareDate = (start: string | Date, end: string | Date): number => {
    if (dateToYYYYMMDDF(start) == dateToYYYYMMDDF(end))
        return 0;
    if (moment(end).isBefore(start))
        return -1;
    else
        return 1;
}

export const getMonth = (date: string | Date): number => {
    return parseInt(moment(date).format('MM'));
}

export const getYear = (date: string | Date): number => {
    return parseInt(moment(date).format('YYYY'));
}