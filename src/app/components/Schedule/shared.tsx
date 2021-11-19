import { AssessmentStatusType } from "@/app/services/cms/IAssessmentService";
import { SchedulesTimeViewListItem } from "@kidsloop/cms-api-client/dist/api/schedule";
import {
    Grid,
    Typography,
} from "@material-ui/core";
import React from "react";
import {
    FormattedMessage,
    IntlShape,
} from "react-intl";

export interface ScheduleListSection {
    title?: string;
    schedules: SchedulesTimeViewListItem[];
}

export function filterTodaySchedules (schedule: SchedulesTimeViewListItem) {
    const now = new Date();
    const startOfTodayTimeSeconds = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;
    const endOfToday = new Date(startOfTodayTimeSeconds * 1000);
    endOfToday.setHours(23, 59, 59);
    const endOfTodayTimeSeconds = endOfToday.getTime() / 1000;

    return (schedule.start_at >= startOfTodayTimeSeconds && schedule.start_at <= endOfTodayTimeSeconds) || (schedule.end_at >= startOfTodayTimeSeconds && schedule.end_at <= endOfTodayTimeSeconds) || (schedule.start_at <= startOfTodayTimeSeconds && schedule.end_at >= endOfTodayTimeSeconds);
}

export function filterTomorrowSchedules (schedule: SchedulesTimeViewListItem) {
    const now = new Date();
    const startOfTodayTimeSeconds = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;
    const startOfTomorrow = new Date(startOfTodayTimeSeconds * 1000);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
    const startOfTomorrowTimeSeconds = startOfTomorrow.getTime() / 1000;
    const endOfTomorrow = new Date(startOfTomorrowTimeSeconds * 1000);
    endOfTomorrow.setHours(23, 59, 59);
    const endOfTomorrowTimeSeconds = endOfTomorrow.getTime() / 1000;

    return (schedule.start_at >= startOfTomorrowTimeSeconds && schedule.start_at <= endOfTomorrowTimeSeconds)
        || (schedule.end_at >= startOfTomorrowTimeSeconds && schedule.end_at <= endOfTomorrowTimeSeconds)
        || (schedule.start_at <= startOfTomorrowTimeSeconds && schedule.end_at >= endOfTomorrowTimeSeconds);
}

export function filterUpcomingSchedules (schedule: SchedulesTimeViewListItem) {
    const now = new Date();
    const startOfTodayTimeSeconds = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;
    const startOfTomorrow = new Date(startOfTodayTimeSeconds * 1000);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
    const startOfTomorrowTimeSeconds = startOfTomorrow.getTime() / 1000;
    const endOfTomorrow = new Date(startOfTomorrowTimeSeconds * 1000);
    endOfTomorrow.setHours(23, 59, 59);
    const endOfTomorrowTimeSeconds = endOfTomorrow.getTime() / 1000;

    return schedule.start_at > endOfTomorrowTimeSeconds;
}

export const getStudyType = (studyClass: SchedulesTimeViewListItem, intl: IntlShape) => {
    if (studyClass.is_home_fun) return intl.formatMessage({
        id: `schedule_studyHomeFunStudy`,
    });
    return intl.formatMessage({
        id: `schedule_studyTab`,
    });
};

export const StudyAssessmentStatus = (schedule: SchedulesTimeViewListItem) => {
    if (!schedule.is_home_fun) return; // currently status is only accurate for home fun studies
    switch (schedule.assessment_status) {
    case AssessmentStatusType.COMPLETE: return (
        <Grid
            container
            direction="column"
        >
            <Grid item>
                <Typography
                    variant="subtitle2"
                    color="textSecondary"
                >
                    <FormattedMessage id="schedule_studyAssessmentComplete1" />
                </Typography>
            </Grid>
            <Grid item>
                <Typography
                    variant="subtitle2"
                    color="textSecondary"
                >
                    <FormattedMessage id="schedule_studyAssessmentComplete2" />
                </Typography>
            </Grid>
        </Grid>
    );
    case AssessmentStatusType.IN_PROGRESS: return (
        <Typography
            variant="subtitle2"
            style={{
                color: `#5DBD3B`,
            }}
        >
            <FormattedMessage id="schedule_studySubmittedFeedback" />
        </Typography>
    );
    }
};
