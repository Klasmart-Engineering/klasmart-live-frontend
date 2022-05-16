import { endOfWeek, startOfWeek } from "date-fns";
import { round } from "lodash";

export function getRandomInt (min: number, max: number) {
    const minInt = Math.ceil(min);
    const maxInt = Math.floor(max);
    return Math.floor(Math.random() * (maxInt - minInt) + minInt); // the maximum is exclusive and the minimum is inclusive
}

export function startOfWeekCal (date: Date | number) {
    return round(startOfWeek(date, {weekStartsOn: 1}).getTime() / 1000);
}

export function endOfWeekCal (date: Date | number) {
    return round(endOfWeek(date, {weekStartsOn: 1}).getTime() / 1000) - 24 * 60 * 60;
}

export function startOfDateCal (date: Date | number) {
    return startOfWeek(date, {weekStartsOn: 1});
}

export function endOfDateCal (date: Date | number) {
    return endOfWeek(date, {weekStartsOn: 1});
}
