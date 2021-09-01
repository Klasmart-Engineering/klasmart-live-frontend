import dateFormat from "dateformat";

export function formatDueDate (dueDate: number){
    return dateFormat(new Date(dueDate * 1000), `shortTime`, false, false) + `, ` +
        dateFormat(new Date(dueDate * 1000), `fullDate`, false, false);
}
