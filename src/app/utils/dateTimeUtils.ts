import { IntlShape } from "react-intl";

export function formatDueDateMillis (dueDateMillis: number, intl: IntlShape) {
    const date = intl.formatDate(dueDateMillis, {
        day: `numeric`,
        month: `long`,
        weekday: `long`,
    });
    return date;
}

export function formatStartEndDateTimeMillis (startTimeMillis: number, endTimeMillis: number, intl: IntlShape) {
    const date = intl.formatDate(startTimeMillis, {
        day: `numeric`,
        month: `long`,
        weekday: `long`,
    });
    const startTime = intl.formatTime(startTimeMillis);
    const endTime = intl.formatTime(endTimeMillis);
    return `${date}, ${startTime} - ${endTime}`;
}

export function formatDateTimeMillis (millis: number, intl: IntlShape) {
    const date = intl.formatDate(millis, {
        day: `numeric`,
        month: `short`,
    });
    const time = intl.formatTime(millis);
    return `${date}, ${time}`;
}

export function formatCalendarDates (dueDateMillis: number, intl: IntlShape, sevenDays: number) {
    const date = intl.formatDate(dueDateMillis, {
        month: `short`,
        year: `numeric`,
    });
    const today = intl.formatDate(dueDateMillis, {
        day: `numeric`,
    });

    const lastday = intl.formatDate(dueDateMillis - sevenDays, {
        day: `numeric`,
    });
    return `${lastday} -  ${today} ${date}`;
}
