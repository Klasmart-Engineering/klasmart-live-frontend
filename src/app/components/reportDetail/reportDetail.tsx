
import LiveIconDialog from "@/assets/img/schedule-icon/live_type_schedule_dialog.svg";
import StudyIconDialog from "@/assets/img/schedule-icon/study_type_schedule_dialog.svg";
import HomeFunIconDialog from "@/assets/img/schedule-icon/home_fun_type_schedule_dialog.svg";
import { useSelectedOrganizationValue, useSelectedUserValue } from "@/app/data/user/atom";
import { GetLearningOutComesResponse, useGetAssessmentById, useGetLearningOutcomes, useGetScheduleById } from "@kl-engineering/cms-api-client";
import { Box, Chip, createStyles, Divider, Grid, List, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { COLOR_CONTENT_TEXT, LEARNING_COLOR_TEXT, THEME_COLOR_BACKGROUND_LIST, THEME_COLOR_BACKGROUND_PAPER, THEME_COLOR_BLUE_CLASS_TYPE_SCHEDULE_DIALOG, THEME_COLOR_PINK_BUTTON_SCHEDULE_DIALOG, THEME_COLOR_YELLOW_BUTTON_SCHEDULE_DIALOG } from "@/config";
import TeacherComment from "@/assets/img/teacher_comment.svg";
import Loading from "@/components/loading";
import clsx from "clsx";
import LearningOutcomeListItem from "../report/learning-outcomes/ListItem";
import ScheduleListSectionHeader from "../Schedule/ListSectionHeader";
import { formatDueDateMillis, formatStartEndDateTimeMillis } from "@/app/utils/dateTimeUtils";
import { fromSecondsToMilliseconds } from "@/utils/utils";
import { useRecoilValue } from "recoil";
import { reportDetailState } from "@/app/model/appModel";
import { DialogHeader } from "../Schedule/BaseDialog";

export enum AssessmentType {
    LIVE = `OnlineClass`,
    STUDY = `OnlineStudy`,
    HOME_FUN = `OfflineStudy`,
}

const useStyles = makeStyles((theme) => createStyles({
    root: {
        height: `100%`,
        padding: theme.spacing(3, 2, 1),
        background: THEME_COLOR_BACKGROUND_LIST,
        overflow: `auto`,
    },
    infoBox: {
        padding: theme.spacing(1, 3, 2.5),
        background: THEME_COLOR_BACKGROUND_PAPER,
        borderRadius: theme.spacing(2.5),
        color: LEARNING_COLOR_TEXT,
    },
    reportType: {
        height: theme.spacing(2.5),
        paddingLeft: theme.spacing(0.75),
        color: theme.palette.background.paper,
        backgroundColor: THEME_COLOR_BLUE_CLASS_TYPE_SCHEDULE_DIALOG,
        marginTop: theme.spacing(1),
    },
    chipReportType: {
        filter: `brightness(0) invert(1)`,
    },
    title: {
        textOverflow: `ellipsis`,
        overflow: `hidden`,
        marginRight: theme.spacing(1),
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(3),
        display: `-webkit-box`,
        WebkitBoxOrient: `vertical`,
        WebkitLineClamp: 2,
    },
    teacherListContainer: {
      paddingBottom: theme.spacing(1.5),
    },
    dateTime: {
        paddingTop: theme.spacing(1),
        fontSize: `0.875rem`,
    },
    classText: {
        fontSize: `0.875rem`,
    },
    subjectText: {
      fontSize: `0.875rem`,
    },
    teacherFeedbackBox: {
        display: `flex`,
        padding: theme.spacing(1.5, 3, 1.5),
        background: THEME_COLOR_BACKGROUND_PAPER,
        borderRadius: theme.spacing(1.5),
    },
    sectionHeaderContainer: {
        paddingTop: theme.spacing(2.5),
        paddingBottom: theme.spacing(1),
    },
    sectionHeaderContainerNoPaddingBottom: {
        paddingBottom: 0,
    },
    teacherFeedbackIcon: {
        height: theme.spacing(2),
        paddingLeft: theme.spacing(0.75),
        [theme.breakpoints.up(`sm`)]: {
          height: theme.spacing(2.5),
        }
    },
    teacherFeedbackText: {
      fontSize: `1rem`,
      color: LEARNING_COLOR_TEXT,
    },
    contentTextColor: {
        color: COLOR_CONTENT_TEXT,
    },
    textBreakSpace: {
        whiteSpace: `break-spaces`,
    },
}));

export interface ReportDetailData {
  assessment_id: string;
  teacher_feedback: string;
  schedule_id: string;
  start_at: number;
}

function TeacherFeedbackSection(): JSX.Element {
    const classes = useStyles();
    const intl = useIntl();
    const reportDetail = useRecoilValue(reportDetailState);

    return (
        <>
            <Grid 
                container
                className={classes.sectionHeaderContainer}
                alignItems="flex-end"
            >
                <Grid 
                    item
                >
                    <ScheduleListSectionHeader 
                      title={intl.formatMessage({
                        id: `report.report.teacherFeedback`,
                        defaultMessage: `Teacher's Comments`,
                      })} 
                      disablePadding
                    />
                </Grid>
                <Grid 
                    item
                >
                    <img
                        className={classes.teacherFeedbackIcon}
                        src={TeacherComment}
                    />
                </Grid>
            </Grid>
            <Box 
              className={classes.teacherFeedbackBox}
            >
                {reportDetail.teacher_feedback !== `` ? <Typography 
                    className={classes.teacherFeedbackText}
                    variant="subtitle1"
                >
                    {reportDetail.teacher_feedback}
                </Typography> : <Grid container justifyContent="center" alignItems="center">
                    <Typography 
                        className={clsx(classes.teacherFeedbackText, classes.contentTextColor)}
                        variant="subtitle1" 
                    >
                        <FormattedMessage id="report.report.teacherFeedback.empty" />
                    </Typography>
                  </Grid>}
            </Box>
        </>
    );
}

interface LearningOutcomesSectionProps {
    learningOutcomes: GetLearningOutComesResponse[];
}

function LearningOutcomesSection(props: LearningOutcomesSectionProps): JSX.Element {
    const classes = useStyles();
    const intl = useIntl();
    const { learningOutcomes } = props;

    return (
        <>
          <div 
            className={clsx(classes.sectionHeaderContainer, {
              [classes.sectionHeaderContainerNoPaddingBottom]: learningOutcomes.length,
            })}
          >
            <ScheduleListSectionHeader 
              title={intl.formatMessage({
                id: `report.report.learningOutcomes`,
                defaultMessage: `Learning Outcomes`,
              })}
              disablePadding
            />
          </div>
            
            {
              learningOutcomes.length ? <List disablePadding>
                  {learningOutcomes.map((learningOutcome) => {
                      return (
                          <LearningOutcomeListItem 
                              key={learningOutcome.id} 
                              title={learningOutcome.name} 
                              status={learningOutcome.status} 
                          />
                      );
                  })}
              </List> : (
                <Box
                  className={classes.teacherFeedbackBox}
                  justifyContent="center" 
                  alignItems="center"
                >
                  <Typography 
                    className={clsx(classes.teacherFeedbackText, classes.contentTextColor)}
                    variant="subtitle1" 
                  >
                    <FormattedMessage id="report.report.learningOutcomes.empty" />
                  </Typography>
                </Box>
              )
            }
        </>
    );
}

interface FormattedData {
    title: string;
    icon: string;
    backgroundClassType: string;
}

export function ReportDetail () {
    const intl = useIntl();
    const organization = useSelectedOrganizationValue();
    const classes = useStyles();
    const selectedUser = useSelectedUserValue();
    const reportDetail = useRecoilValue(reportDetailState);
    const organizationId = organization?.organization_id ?? ``;
    const scheduleId = reportDetail.schedule_id;
    const { data: assessmentData, isFetching } = useGetAssessmentById({
        assessment_id: reportDetail.assessment_id,
        org_id: organizationId,
    });
    const { data: learningOutcomes } = useGetLearningOutcomes({
        assessment_id: reportDetail.assessment_id,
        student_id: selectedUser?.user_id ?? ``,
        org_id: organizationId
    });
    const { data: scheduleData } = useGetScheduleById({
        schedule_id: scheduleId,
        org_id: organizationId,
    }, {
        queryOptions: {
            enabled: !!scheduleId && !!organizationId,
        },
    });

    const formatData: Record<string, FormattedData> = {
        [AssessmentType.LIVE]: {
            title: intl.formatMessage({
                id: `schedule_liveTab`,
                defaultMessage: `Live`,
            }),
            icon: LiveIconDialog,
            backgroundClassType: THEME_COLOR_BLUE_CLASS_TYPE_SCHEDULE_DIALOG,
        },
        [AssessmentType.STUDY]: {
            title: intl.formatMessage({
                id: `schedule_studyTab`,
                defaultMessage: `Study`,
            }),
            icon: StudyIconDialog,
            backgroundClassType: THEME_COLOR_PINK_BUTTON_SCHEDULE_DIALOG,
        },
        [AssessmentType.HOME_FUN]: {
            title: intl.formatMessage({
                id: `schedule.homeFun`,
                defaultMessage: `Home Fun`,
            }),
            icon: HomeFunIconDialog,
            backgroundClassType: THEME_COLOR_YELLOW_BUTTON_SCHEDULE_DIALOG,
        },
    }

    const studyDueAt = formatDueDateMillis(assessmentData?.schedule_due_at ?? 0, intl);

    const liveClassDateTime = formatStartEndDateTimeMillis(fromSecondsToMilliseconds(reportDetail.start_at), fromSecondsToMilliseconds(assessmentData?.class_end_at ?? 0), intl, false);

    if (isFetching) {
        return (
            <Loading messageId="loading" />
        );
    }

    return (
        <Box
            className={classes.root} 
        >
            <Box className={classes.infoBox}>
              <Grid container direction="column">
                  <Grid item>
                    <Chip
                        className={classes.reportType}
                        style={{
                            backgroundColor: formatData[assessmentData?.assessment_type ?? AssessmentType.LIVE].backgroundClassType,
                        }}
                        label={formatData[assessmentData?.assessment_type ?? AssessmentType.LIVE].title}
                        icon={<img
                                className={classes.chipReportType}
                                alt={formatData[assessmentData?.assessment_type ?? AssessmentType.LIVE].title}
                                src={formatData[assessmentData?.assessment_type ?? AssessmentType.LIVE].icon}
                            />
                        }
                    />
                  </Grid>
                  <Grid item>
                      <Typography 
                            className={classes.title} 
                            variant={`h4`}
                        >
                          {assessmentData?.assessment_type === AssessmentType.LIVE ? assessmentData?.schedule_title : assessmentData?.title}
                      </Typography>
                  </Grid>
                  <DialogHeader className={classes.teacherListContainer} teachers={scheduleData?.teachers ?? []}/>
                  <Divider />
                  {
                    assessmentData?.assessment_type !== AssessmentType.LIVE && (
                      <Grid 
                        className={classes.dateTime} 
                        item
                      >
                        <Typography variant="subtitle1">
                              {
                                studyDueAt
                              }
                          </Typography>
                      </Grid>
                    )
                  }
                  {
                    assessmentData?.assessment_type === AssessmentType.LIVE && (
                      <Grid 
                        className={clsx(classes.dateTime, classes.textBreakSpace)} 
                        item
                      >
                        <Typography variant="subtitle1">
                              {
                                liveClassDateTime
                              }
                        </Typography>
                      </Grid>
                    )
                  }
                  <Grid item className={classes.classText}>
                        <Typography variant="subtitle1">
                            {`${intl.formatMessage({id: "report.report.class", defaultMessage: "Class"})}: ${assessmentData?.class.name}`}
                        </Typography>
                  </Grid>
                  {assessmentData?.subjects && <Grid item className={classes.subjectText}>
                        <Typography variant="subtitle1">
                            {`${intl.formatMessage({id: "report.report.subject", defaultMessage: "Subject"})}: ${assessmentData.subjects.map((item) => item.name).join(`, `)}`}
                        </Typography>
                  </Grid>}
              </Grid>
            </Box>

            <TeacherFeedbackSection />

            {learningOutcomes && <LearningOutcomesSection learningOutcomes={learningOutcomes} />}
        </Box>
    );
}
