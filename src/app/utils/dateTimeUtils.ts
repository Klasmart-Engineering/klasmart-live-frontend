import { IntlShape } from "react-intl";
import { isSameMonth, isSameYear, endOfWeek, startOfWeek, subDays, endOfDay  } from "date-fns";
import { floor } from "lodash";
import { fromDateToSeconds } from "@/utils/utils";

export enum DateTypeOfWeek{
    START_DATE,
    END_DATE,
}

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

export function formatCalendarDates (startWeekMillis: number, endWeekMillis: number, intl: IntlShape) {
    const isInSameMonth = isSameMonth(startWeekMillis, endWeekMillis);
    const isInSameYear = isSameYear(startWeekMillis, endWeekMillis);
    let start,end, month;

    if(!isInSameYear){
        start = formatDateMonthYearMillis(startWeekMillis, intl);
    } else if (!isInSameMonth){
        start = intl.formatDate(startWeekMillis, {
            day: `numeric`,
        }) 
        month = intl.formatDate(startWeekMillis, {
            month: `short`,
        });
        start += ` ${month}`;
    } else {
        start = intl.formatDate(startWeekMillis, {
            day: `numeric`,
        });
    }
    end = formatDateMonthYearMillis(endWeekMillis, intl);
    return `${start} - ${end}`;
}

export function initStarEndDateOfWeekReturnDate () {
    const startDateOfCurrentWeek = getStartEndDateOfWeekReturnDate(new Date(), DateTypeOfWeek.START_DATE);
    const startOfLastWeek: Date = subDays(startDateOfCurrentWeek, 7);
    const endOfLastWeek: Date = endOfDay(subDays(startDateOfCurrentWeek, 1));

    return {
        initStartDate: startOfLastWeek,
        initEndDate: endOfLastWeek,
    }
}

export function initStarEndDateOfWeekReturnNumber () {
    const { initStartDate, initEndDate } = initStarEndDateOfWeekReturnDate();

    return {
        initStartDate: floor(fromDateToSeconds(initStartDate)),
        initEndDate: floor(fromDateToSeconds(initEndDate)),
    }
}

export function getStartEndDateOfWeekReturnDate (date: Date | number, dateType: DateTypeOfWeek) {
    let dateResult: Date | number;
    switch(dateType){
        case DateTypeOfWeek.START_DATE:
            dateResult = startOfWeek(date, {weekStartsOn: 1});
            break;
        case DateTypeOfWeek.END_DATE:
            dateResult = endOfWeek(date, {weekStartsOn: 1});
            break;
    }
    return dateResult;
}

export function getStartEndDateOfWeekReturnNumber (date: Date | number, dateType: DateTypeOfWeek) {
    const dateResult: Date = getStartEndDateOfWeekReturnDate(date, dateType);
    return floor(fromDateToSeconds(dateResult));
}