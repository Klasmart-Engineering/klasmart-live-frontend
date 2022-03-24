import { AssessmentStatusType } from "@/app/services/cms/IAssessmentService";
import { formatDueDayMonth } from "@/app/utils/dateTimeUtils";
import HomeFunStudyIcon from "@/assets/img/schedule-icon/home_fun_study.svg";
import ReviewIcon from "@/assets/img/schedule-icon/review_icon.svg";
import StudyIcon from "@/assets/img/schedule-icon/study_icon.svg";
import StyledIcon from "@/components/styled/icon";
import { fromSecondsToMilliseconds } from "@/utils/utils";
import {
    GetScheduleByIdResponse,
    SchedulesTimeViewListItem,
} from "@kidsloop/cms-api-client/dist/api/schedule";
import { Typography } from "@material-ui/core";
import { Envelope as AssessmentCompleteIcon } from "@styled-icons/fa-regular/Envelope";
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
    if (studyClass.is_review) return intl.formatMessage({
        id: `review.title`,
    });

    if (studyClass.is_home_fun) return intl.formatMessage({
        id: `schedule_studyHomeFunStudy`,
    });

    return intl.formatMessage({
        id: `schedule_studyTab`,
    });
};

export const getIconStudyType = (studyClass: SchedulesTimeViewListItem) => {
    if (studyClass.is_review) return ReviewIcon;

    if (studyClass.is_home_fun) return HomeFunStudyIcon;

    return StudyIcon;
};

export const getIdStudyType = (studyClass?: GetScheduleByIdResponse) => {
    if (studyClass?.is_review) return `button_start_review`;

    if (studyClass?.is_home_fun && studyClass?.complete_assessment) return `scheduleDetails.viewFeedback`;

    return `button_go_study`;
};

export const getTitleReview = (studySchedule: SchedulesTimeViewListItem | GetScheduleByIdResponse, className: string, intl: IntlShape) => {
    const value = className + ` `
            + `${formatDueDayMonth(fromSecondsToMilliseconds(studySchedule?.content_start_at ?? 0), intl)}`
            + `~`
            + `${formatDueDayMonth(fromSecondsToMilliseconds(studySchedule?.content_end_at ?? 0), intl)}`;

    return <FormattedMessage
        id="schedule_review_class_name"
        values={{
            value,
        }}/>;
};

export const StudyAssessmentStatus = (schedule: SchedulesTimeViewListItem) => {
    if (!schedule.is_home_fun) return; // currently status is only accurate for home fun studies
    switch (schedule.assessment_status) {
    case AssessmentStatusType.COMPLETE: return (
        <StyledIcon
            icon={<AssessmentCompleteIcon/>}
            size="medium"
            color="#9E9E9E" />
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
