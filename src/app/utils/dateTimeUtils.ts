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
    return `${date}\n${formatStartEndTimeMillis(startTimeMillis, endTimeMillis, intl)}`;
}

export function formatDateTimeMillis (millis: number, intl: IntlShape) {
    const date = intl.formatDate(millis, {
        day: `numeric`,
        month: `long`,
        weekday: `long`,
    });
    const time = intl.formatTime(millis);
    return millis !== 0 ? `${date}\n${time}` : ``;
}

export function formatStartEndTimeMillis (startTimeMillis: number, endTimeMillis: number, intl: IntlShape) {
    const startTime = intl.formatTime(startTimeMillis);
    const endTime = intl.formatTime(endTimeMillis);
    if (startTime.slice(-2) === endTime.slice(-2)) {
        return `${startTime.substring(0, startTime.length - 2)} - ${endTime}`;
    }
    return `${startTime} - ${endTime}`;
}

export function formatDateMonthYearMillis (millis: number, intl: IntlShape) {
    const day = intl.formatDate(millis, {
        day: `numeric`,
    });
    const monthWithYear = intl.formatDate(millis, {
        month: `short`,
        year: `numeric`,
    });
    return `${day} ${monthWithYear}`;
}

export function formatCalendarDates (startOfWeek: number, endOfWeek: number, intl: IntlShape) {
    const date = intl.formatDate(startOfWeek, {
        month: `short`,
        year: `numeric`,
    });
    const today = intl.formatDate(startOfWeek, {
        day: `numeric`,
    });

    const lastday = intl.formatDate(endOfWeek, {
        day: `numeric`,
    });
    return `${today} -  ${lastday} ${date}`;
}

export function formatMonthDateYear (dueDateMillis: number, intl: IntlShape) {
    const day = intl.formatDate(dueDateMillis, {
        day: `numeric`,
    });

    const month = intl.formatDate(dueDateMillis, {
        month: `long`,
    });
    const year = intl.formatDate(dueDateMillis, {
        year: `numeric`,
    });
    return `${month} ${day}, ${year}`;
}
