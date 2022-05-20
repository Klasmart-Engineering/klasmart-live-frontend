import ScheduleLoading from "@/app/components/Schedule/Loading";
import { useCordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import { usePopupContext } from "@/app/context-provider/popup-context";
import { AssessmentInfoDialog } from "@/app/dialogs/assessmentInfoDialog";
import { startDownloadPreview } from "@/app/utils/fileUtils";
import { checkNetworkToConfirmDownload } from "@/app/utils/networkUtils";
import AttachmentIcon from "@/assets/img/home-fun-study/attachment.svg";
import Average from "@/assets/img/home-fun-study/average.svg";
import Excellent from "@/assets/img/home-fun-study/excellent.svg";
import Fair from "@/assets/img/home-fun-study/fair.svg";
import Good from "@/assets/img/home-fun-study/good.svg";
import Poor from "@/assets/img/home-fun-study/poor.svg";
import StyledIcon from "@/components/styled/icon";
import {
    DIRECTORY_TARGET_FALLBACK,
    TEACHER_FEEDBACK_BOX_ATTACHMENT_BG_COLOR,
    TEACHER_FEEDBACK_BOX_BG_COLOR,
    TEACHER_FEEDBACK_BOX_HEADER_BG_COLOR,
} from "@/config";
import { useHttpEndpoint } from "@/providers/region-select-context";
import {
    StudentAttachment,
    useGetStudentAssessments,
} from "@kl-engineering/cms-api-client";
import { TeacherComment } from "@kl-engineering/cms-api-client/dist/api/assessment";
import { useSnackbar } from "@kl-engineering/kidsloop-px";
import { Info as InfoIcon } from "@styled-icons/evaicons-solid/Info";
import { Box, Grid, Typography, useTheme, CircularProgress, List, ListItem, ListItemIcon, ListItemText, Button } from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import clsx from "clsx";
import React,
{
    useMemo,
    useState,
} from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";
import { Score } from "./FeedbackScore";

const useStyles = makeStyles((theme) => createStyles({
    feedbackComment: {
        color: theme.palette.grey[700],
    },
    feedbackTitle: {
        padding: theme.spacing(0, 3),
    },
    feedbackNoComment: {
        color: theme.palette.grey[700],
        fontStyle: `italic`,
    },
    jessIcon: {
        position: `absolute`,
        bottom: `-5px`,
        right: `20px`,
        width: `79px`,
        height: `60px`,
    },
    wrapperfeedbackicon: {
        borderRadius: theme.spacing(3, 3, 0, 0),
        textAlign: `center`,
        padding: theme.spacing(1.5),
    },
    feedbackicon: {
        height: theme.spacing(9),
    },
    progress: {
        position: `absolute`,
        top: theme.spacing(0.2),
        left: theme.spacing(0.5),
    },
    wrapperfeedbackcontent: {
        padding: theme.spacing(3),
    },
    feedbackIcon: {
        minWidth: theme.spacing(3),
        padding: theme.spacing(0.8, 0, 0.2, 1.5),
    },
    feedbackAttachment: {
        width: theme.spacing(2),
    },
    feedbackReview: {
        background: TEACHER_FEEDBACK_BOX_ATTACHMENT_BG_COLOR,
        borderRadius: theme.spacing(1),
        marginBottom: theme.spacing(1),
        padding: 0,
        position: `relative`,
    },
    attachmentName: {
        padding: theme.spacing(0, 1),
        wordBreak: `break-word`,
    },
    infoButton: {
        position: `absolute`,
        padding: 0,
        right: -6,
        top: theme.spacing(1),
    },
}));

export interface HomeFunStudyTeacherFeedbackProps {
    organizationId: string;
    scheduleId: string;
}

interface TeacherFeedback {
    comment: string;
    score: number;
}

const icons: Record<number, string> = {
    [Score.POOR]: Poor,
    [Score.FAIR]: Fair,
    [Score.AVERAGE]: Average,
    [Score.GOOD]: Good,
    [Score.EXCELLENT]: Excellent,
};

export default function HomeFunStudyTeacherFeedback({ organizationId, scheduleId }: HomeFunStudyTeacherFeedbackProps) {
    const theme = useTheme();
    const classes = useStyles();
    const intl = useIntl();
    const { showPopup } = usePopupContext();
    const [openAssessmentInfoDialog, setOpenAssessmentInfoDialog] = useState<boolean>(false);
    const { data: studentAssessmentsData, isFetching: isFetchingStudentAssessments } = useGetStudentAssessments({
        type: `home_fun_study`,
        schedule_ids: scheduleId,
        org_id: organizationId,
    });
    const [idsDownloading, setIdsDownloading] = useState<string[]>([]);
    const cms = useHttpEndpoint(`cms`);
    const { enqueueSnackbar } = useSnackbar();
    const { isIOS } = useCordovaSystemContext();

    const cacheDirectory = useMemo(() => {
        const cordova = window.cordova;
        if (!cordova) return DIRECTORY_TARGET_FALLBACK;
        return isIOS ? cordova.file.tempDirectory : cordova.file.externalCacheDirectory;
    }, [isIOS]);

    const teacherFeedback = useMemo((): TeacherFeedback | undefined => {
        const getTeacherComment = (teacherComments?: TeacherComment[]) => {
            if (!teacherComments?.length) return ``;
            return teacherComments[0].comment;
        };

        if (!studentAssessmentsData?.list?.length) return;
        const studentAssessment = studentAssessmentsData.list[0];

        return {
            comment: getTeacherComment(studentAssessment.teacher_comments),
            score: studentAssessment.score,
        };
    }, [studentAssessmentsData]);

    if (isFetchingStudentAssessments) return <ScheduleLoading />;
    if (!teacherFeedback) return null;

    const previewFile = (attachmentId: string, savedFilePath: string) => {
        window.PreviewAnyFile.previewPath(() => {
            setIdsDownloading((ids) => ids.filter(id => id !== attachmentId));
        }, (error: Error) => {
            console.error(error);
            enqueueSnackbar(`Couldn't preview this file`, {
                variant: `error`,
                anchorOrigin: {
                    vertical: `bottom`,
                    horizontal: `center`,
                },
            });
        }, savedFilePath);
    };

    const onSuccess = (attachmentId: string, savedFilePath: string) => {
        previewFile(attachmentId, savedFilePath);
    }
    const onFailed = (attachmentId: string) => {
        setIdsDownloading((ids) => ids.filter(id => id !== attachmentId));
        enqueueSnackbar(`Couldn't preview this file`, {
            variant: `error`,
            anchorOrigin: {
                vertical: `bottom`,
                horizontal: `center`,
            },
        });
    }
    const confirmOpenAttachmentLink = async (attachment: StudentAttachment) => {
        setIdsDownloading((ids) => [...ids, attachment.review_attachment_id]);
        const url = encodeURI(`${cms}/v1/contents_resources/${attachment.review_attachment_id}`);
        checkNetworkToConfirmDownload(() => startDownloadPreview(attachment.review_attachment_id, attachment.name, url, cacheDirectory, onSuccess, onFailed), showPopup, intl)
    };

    return (
        <Grid
            container
            direction="column"
        >
            <Grid item>
                <Typography
                    variant="subtitle1"
                    className={classes.feedbackTitle}
                >
                    <FormattedMessage
                        id="homeFunStudy.feedback.title"
                        defaultMessage={`Teacher's Feedback`}
                    />
                </Typography>
            </Grid>
            <Box
                mx={3}
                my={1}
                position="relative"
                borderRadius={theme.spacing(3)}
                bgcolor={TEACHER_FEEDBACK_BOX_BG_COLOR}
            >
                <Box
                    bgcolor={TEACHER_FEEDBACK_BOX_HEADER_BG_COLOR}
                    className={classes.wrapperfeedbackicon}
                >
                    <Button
                        className={classes.infoButton}
                        color="primary"
                        onClick={() => setOpenAssessmentInfoDialog(true)}
                    >
                        <StyledIcon
                            icon={<InfoIcon />}
                            size="2rem"
                            color={theme.palette.common.white}
                        />
                    </Button>
                    <img
                        src={icons[teacherFeedback.score]}
                        className={classes.feedbackicon}
                    />
                </Box>
                <Grid
                    container
                    className={classes.wrapperfeedbackcontent}
                    direction="column"
                    spacing={2}
                >
                    <Grid item>
                        <Box>
                            <Typography
                                variant="subtitle1"
                                className={clsx(classes.feedbackComment, {
                                    [classes.feedbackNoComment]: !teacherFeedback.comment,
                                })}
                            >
                                {teacherFeedback.comment ? teacherFeedback.comment : <FormattedMessage
                                    id="homeFunStudy.feedback.notAvailable"
                                    defaultMessage={`No teacher comment available`}
                                />}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item>
                        {studentAssessmentsData?.list?.length &&
                            <List>
                                {studentAssessmentsData.list[0].student_attachments.map((attachment) => (
                                    <ListItem
                                        key={attachment.id}
                                        className={classes.feedbackReview}
                                    >
                                        {attachment.review_attachment_id && (
                                            <>
                                                <ListItemIcon
                                                    className={classes.feedbackIcon}
                                                    onClick={() => confirmOpenAttachmentLink(attachment)}
                                                >
                                                    <Grid>
                                                        <img
                                                            src={AttachmentIcon}
                                                            className={classes.feedbackAttachment} />
                                                        {idsDownloading.includes(attachment.review_attachment_id) && (
                                                            <CircularProgress
                                                                size={30}
                                                                className={classes.progress} />
                                                        )}
                                                    </Grid>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={(
                                                        <Typography
                                                            variant="subtitle1"
                                                            className={classes.attachmentName}>
                                                            {attachment.name}
                                                        </Typography>
                                                    )}
                                                    onClick={() => confirmOpenAttachmentLink(attachment)} />
                                            </>
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                        }
                    </Grid>
                </Grid>
            </Box>

            <AssessmentInfoDialog
                visible={openAssessmentInfoDialog}
                onClose={() => setOpenAssessmentInfoDialog(false)}
            />
        </Grid>
    );
}
