import HomeFunStudyAttachmentsSection from "@/app/components/HomeFunStudy/Attachments/Section";
import BottomSelector from "@/app/components/HomeFunStudy/BottomSelector";
import HomeFunStudyCommentSection from "@/app/components/HomeFunStudy/Comment/Section";
import HomeFunStudyTeacherFeedback from "@/app/components/HomeFunStudy/TeacherFeedback/Section";
import AppBar from "@/app/components/layout/AppBar";
import BackButton from "@/app/components/layout/BackButton";
import ScheduleLoading from "@/app/components/Schedule/Loading";
import { usePopupContext } from "@/app/context-provider/popup-context";
import { useServices } from "@/app/context-provider/services-provider";
import {
    useSelectedOrganizationValue,
    useSelectedUserValue,
} from "@/app/data/user/atom";
import { ScheduleErrorLabel } from "@/app/services/cms/ISchedulerService";
import { formatDueDateMillis } from "@/app/utils/dateTimeUtils";
import {
    createDirectory,
    detectFileName,
    getFileExtensionFromType,
    isDirectoryInStorage,
    isFileInStorage,
    readFileFromStorage,
    removeDirectory,
    removeFileFromStorage,
    validateFileSize,
    validateFileType,
    writeFileToStorage,
} from "@/app/utils/fileUtils";
import {
    HFSVisibilityState,
    HomeFunStudyFeedbackId,
    useHomeFunStudies,
} from "@/app/utils/homeFunStudy";
import { HOME_FUN_STUDY_SUBMITTING_BUTTON_BACKGROUND_COLOR } from "@/config";
import { generateRandomString } from "@/utils/StringUtils";
import { fromSecondsToMilliseconds } from "@/utils/utils";
import {
    GetScheduleNewestFeedbackByIdResponse,
    useGetScheduleById,
    useGetScheduleNewestFeedbackById,
    usePostScheduleFeedback,
} from "@kl-engineering/cms-api-client";
import {
    Box,
    Button,
    CircularProgress,
    createStyles,
    makeStyles,
    Typography,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import clsx from "clsx";
import { useSnackbar } from "@kl-engineering/kidsloop-px";
import React,
{
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";
import {
    useHistory,
    useParams,
} from "react-router-dom";

const useStyles = makeStyles((theme) => createStyles({
    roundedButton: {
        borderRadius: `12px`,
        paddingTop: `10px`,
        paddingBottom: `10px`,
    },
    buttonWrapper: {
        width: `100%`,
        padding: theme.spacing(2, 3),
        position: `relative`,
    },
    buttonSubmitting: {
        backgroundColor: HOME_FUN_STUDY_SUBMITTING_BUTTON_BACKGROUND_COLOR,
    },
    buttonProgress: {
        color: blue[500],
        position: `absolute`,
        top: `50%`,
        left: `50%`,
        marginTop: -12,
        marginLeft: -12,
    },
}));

type Assignment = GetScheduleNewestFeedbackByIdResponse["assignments"][number];

export interface SubmittedAttachment extends Assignment {
    status: `submitted`;
}

export interface DraftAttachment extends Assignment {
    status: `draft`;
    localPath: string;
}

export interface SavingAttachment extends Assignment {
    status: `saving`;
    localPath: string;
}

export interface SubmittingAttachment extends Assignment {
    status: `submitting`;
    localPath: string;
}

export type Attachment = SubmittedAttachment | DraftAttachment | SavingAttachment | SubmittingAttachment;

export interface SubmittedHomeFunStudyFeedback {
    status: `submitted`;
    userId: string;
    scheduleId: string;
    comment: string;
    attachments: SubmittedAttachment[];
}

export interface DraftHomeFunStudyFeedback {
    status: `draft`;
    userId: string;
    scheduleId: string;
    comment: string;
    attachments: Attachment[];
}

export interface SubmittingHomeFunStudyFeedback {
    status: `submitting`;
    userId: string;
    scheduleId: string;
    comment: string;
    attachments: Attachment[];
}

export interface HomeFunStudyFeedbackLoading {
    status: `loading`;
    userId: string;
    scheduleId: string;
    comment: ``;
    attachments: [];
}

export type HomeFunStudyFeedback = HomeFunStudyFeedbackLoading | SubmittedHomeFunStudyFeedback | DraftHomeFunStudyFeedback | SubmittingHomeFunStudyFeedback;

interface Params {
    scheduleId: string;
}

export default function () {
    const { scheduleId } = useParams<Params>();
    const classes = useStyles();
    const intl = useIntl();
    const history = useHistory();
    const organization = useSelectedOrganizationValue();
    const organizationId = organization?.organization_id ?? ``;
    const { enqueueSnackbar } = useSnackbar();
    const { showPopup } = usePopupContext();
    const { contentService } = useServices();
    const [ openBottomSelector, setOpenBottomSelector ] = useState(false);
    const user = useSelectedUserValue();
    const userId = user?.user_id ?? ``;
    const {
        getHomeFunStudyById,
        setHomeFunStudyCommentById,
        createHomeFunStudy,
        updateHomeFunStudyById,
        removeHomeFunStudyById,
        clearSubmittedHomeFunStudies,
    } = useHomeFunStudies();
    const [ homeFunStudyFeedback, setHomeFunStudyFeedback ] = useState<HomeFunStudyFeedback>({
        status: `loading`,
        attachments: [],
        comment: ``,
        scheduleId,
        userId,
    });

    const { data: scheduleData, isFetching: isFetchingSchedule } = useGetScheduleById({
        org_id: organizationId,
        schedule_id: scheduleId,
    }, {
        queryOptions: {
            enabled: !!scheduleId && !!organizationId,
        },
    });

    const { data: scheduleNewestFeedbackData, isFetching: isFetchingScheduleNewestFeedback } = useGetScheduleNewestFeedbackById({
        org_id: organizationId,
        schedule_id: scheduleId,
    });

    const { mutateAsync: postScheduleFeedback, isLoading: isLoadingPostScheduleFeedback } = usePostScheduleFeedback();

    const canSubmit = useMemo(() => {
        return !(isFetchingSchedule || isFetchingScheduleNewestFeedback || isLoadingPostScheduleFeedback);
    }, [
        isFetchingSchedule,
        isFetchingScheduleNewestFeedback,
        isLoadingPostScheduleFeedback,
    ]);

    const showAssessmentAlreadyCompletePopup = () => {
        showPopup({
            variant: `info`,
            title: intl.formatMessage({
                id: `label_info`,
            }),
            description: [
                intl.formatMessage({
                    id: `homeFunStudy.submission.error.rejected`,
                }),
            ],
            closeLabel: intl.formatMessage({
                id: `button_close`,
            }),
        });
    };

    const visibilityState = useMemo((): HFSVisibilityState => {
        if(scheduleData?.complete_assessment) return `hidden`;
        if(homeFunStudyFeedback.status === `submitting`) return `disabled`;
        return `visible`;
    }, [ homeFunStudyFeedback, scheduleData ]);

    useEffect(() => {
        if (isFetchingScheduleNewestFeedback) return;
        const localHomeFunStudy = getHomeFunStudyById({
            scheduleId,
            userId,
        });
        if (!localHomeFunStudy) {
            const submittedHomeFunStudy: SubmittedHomeFunStudyFeedback = {
                status: `submitted`,
                scheduleId,
                userId,
                attachments: scheduleNewestFeedbackData?.assignments?.map((attachment) => ({
                    status: `submitted`,
                    ...attachment,
                })) ?? [],
                comment: scheduleNewestFeedbackData?.comment ?? ``,
            };
            setHomeFunStudyFeedback(submittedHomeFunStudy);
            createHomeFunStudy(submittedHomeFunStudy);
            return;
        }
        setHomeFunStudyFeedback(localHomeFunStudy);
    }, [
        userId,
        scheduleId,
        scheduleNewestFeedbackData,
        isFetchingScheduleNewestFeedback,
    ]);

    useEffect(() => {
        return () => {
            clearSubmittedHomeFunStudies();
        };
    }, []);

    const handleBackClick = () => {
        history.goBack();
    };

    const showSubmitFailedError = () => {
        showPopup({
            variant: `error`,
            title: intl.formatMessage({
                id: `submission_failed`,
            }),
            description: [
                intl.formatMessage({
                    id: `submission_failed_message`,
                }),
            ],
            closeLabel: intl.formatMessage({
                id: `button_ok`,
            }),
        });
    };

    const handleOnCommentChange = (comment: string) => {
        console.log(`handleOnCommentChange`, comment);
        const draftHomeFunStudyFeedback: DraftHomeFunStudyFeedback = {
            ...homeFunStudyFeedback,
            status: `draft`,
            comment: comment,
        };
        setHomeFunStudyFeedback(draftHomeFunStudyFeedback);
        setHomeFunStudyCommentById({
            scheduleId,
            userId,
        }, comment);
    };

    const writeAttachmentToStorage = async (attachmentId: string, file: File) => {
        const submittingAttachment: SavingAttachment = {
            status: `saving`,
            localPath: file.localURL,
            attachment_id: attachmentId,
            attachment_name: detectFileName(file),
            number: 0,
        };
        const draftHomeFunStudyFeedback: DraftHomeFunStudyFeedback = {
            ...homeFunStudyFeedback,
            status: `draft`,
            attachments: [ ...homeFunStudyFeedback.attachments, submittingAttachment ],
        };
        setHomeFunStudyFeedback(draftHomeFunStudyFeedback);
        const userDirectory = await createDirectory(userId);
        const scheduleDirectory = await createDirectory(scheduleId, userDirectory);
        const attachmentDirectory = await createDirectory(attachmentId, scheduleDirectory);
        const fileFromStorage = await writeFileToStorage(file, attachmentDirectory);
        return fileFromStorage;
    };

    const updateAttachmentById = (attachmentId: string, newAttachment: Attachment) => {
        setHomeFunStudyFeedback((homeFunStudyFeedback) => {
            const draftHomeFunStudyFeedback: DraftHomeFunStudyFeedback = {
                ...homeFunStudyFeedback,
                status: `draft`,
                attachments: homeFunStudyFeedback.attachments.map(attachment => attachment.attachment_id === attachmentId ? newAttachment : attachment),
            };
            updateHomeFunStudyById({
                userId,
                scheduleId,
            }, draftHomeFunStudyFeedback);
            return draftHomeFunStudyFeedback;
        });
    };

    const showNotSupportedFilePopup = () => {
        showPopup({
            variant: `detailError`,
            title: intl.formatMessage({
                id: `submission_failed`,
                defaultMessage: `Submission Failed`,
            }),
            description: [
                intl.formatMessage({
                    id: `upload_please_check_your_file`,
                    defaultMessage: `Please Check Your File!`,
                }),
                intl.formatMessage({
                    id: `upload_file_not_supported`,
                    defaultMessage: `This file format is not supported. Please try another file.`,
                }),
            ],
            closeLabel: intl.formatMessage({
                id: `button_ok`,
                defaultMessage: `Ok`,
            }),
        });
    };

    const showFileSizeBiggerThan100MBPopup = () => {
        showPopup({
            variant: `detailError`,
            title: intl.formatMessage({
                id: `submission_failed`,
                defaultMessage: `Submission Failed`,
            }),
            description: [
                intl.formatMessage({
                    id: `upload_please_check_your_file`,
                    defaultMessage: `Please Check Your File!`,
                }),
                intl.formatMessage({
                    id: `upload_file_too_big`,
                    defaultMessage: `Uploaded file should not be bigger than 100MB. Please try another file.`,
                }),
            ],
            closeLabel: intl.formatMessage({
                id: `button_ok`,
                defaultMessage: `Ok`,
            }),
        });
    };

    const onSelectedFile = async (file: File) => {
        setOpenBottomSelector(false);
        if(!validateFileType(file)) {
            showNotSupportedFilePopup();
            return;
        }
        if(!validateFileSize(file)) {
            showFileSizeBiggerThan100MBPopup();
            return;
        }
        const temporaryAttachmentId = generateRandomString();
        const mFile = await writeAttachmentToStorage(temporaryAttachmentId, file);
        const draftAttachment: DraftAttachment = {
            status: `draft`,
            localPath: mFile.localURL,
            attachment_id: temporaryAttachmentId,
            attachment_name: mFile.name,
            number: 0,
        };
        updateAttachmentById(temporaryAttachmentId, draftAttachment);
    };

    const onRemoveAttachment = async (attachmentWantToRemove: Attachment) => {
        const draftHomeFunStudyFeedback: DraftHomeFunStudyFeedback = {
            ...homeFunStudyFeedback,
            status: `draft`,
            attachments: homeFunStudyFeedback.attachments.filter(attachment => attachment.attachment_id !== attachmentWantToRemove.attachment_id),
        };
        if(attachmentWantToRemove.status === `draft`) {
            const isFileExits = await isFileInStorage(attachmentWantToRemove.localPath);
            if(isFileExits)
                removeFileFromStorage(attachmentWantToRemove.localPath);
        }
        setHomeFunStudyFeedback(draftHomeFunStudyFeedback);
        updateHomeFunStudyById({
            userId,
            scheduleId,
        }, draftHomeFunStudyFeedback);
    };

    const removeAllDraftFilesById = async ({ userId, scheduleId }: HomeFunStudyFeedbackId) => {
        const homeFunStudyDirectory = `${cordova.file.dataDirectory}${userId}/${scheduleId}`;
        const isDirectoryExits = await isDirectoryInStorage(homeFunStudyDirectory);
        if(isDirectoryExits)
            await removeDirectory(`${cordova.file.dataDirectory}${userId}/${scheduleId}`);
    };

    const setHomeFunStudyFeedbackToSubmitting = () => {
        const submittingHoneFunStudyFeedback: SubmittingHomeFunStudyFeedback = {
            ...homeFunStudyFeedback,
            status: `submitting`,
            attachments: homeFunStudyFeedback.attachments.map(attachment => attachment.status === `draft` ? {
                ...attachment,
                status: `submitting`,
            } : attachment),
        };
        setHomeFunStudyFeedback(submittingHoneFunStudyFeedback);
    };

    const submitAttachments = async (attachments: Attachment[]): Promise<Attachment[]> => {
        const submittedAttachments = await Promise.all(attachments.map(async (attachment, index) => {
            if (attachment.status === `submitted`) return attachment;

            const fileToUpload = await readFileFromStorage(attachment.localPath);
            const contentResourceUploadPathResponse = await contentService?.getContentResourceUploadPath(organizationId, getFileExtensionFromType(fileToUpload.type));
            if (!contentResourceUploadPathResponse) return attachment;
            const uploadResult = await contentService?.uploadAttachment(contentResourceUploadPathResponse.path, fileToUpload);
            if (!uploadResult) return attachment;
            const submittedAttachment: SubmittedAttachment =  {
                status: `submitted`,
                attachment_id: contentResourceUploadPathResponse.resource_id,
                attachment_name: attachment.attachment_name,
                number: (scheduleNewestFeedbackData?.assignments?.length ?? 0) + index,
            };
            return submittedAttachment;
        }));
        return submittedAttachments;
    };

    const checkAllAttachmentsIsSubmitted = (attachments: Attachment[]): attachments is SubmittedAttachment[] => {
        return attachments.filter(attachment => attachment.status !== `submitted`).length === 0;
    };

    const submitFeedback = async () => {
        if (!scheduleNewestFeedbackData?.is_allow_submit) {
            showAssessmentAlreadyCompletePopup();
            return;
        }

        try {
            setHomeFunStudyFeedbackToSubmitting();
            const submittedAttachments = await submitAttachments(homeFunStudyFeedback.attachments);

            if(!checkAllAttachmentsIsSubmitted(submittedAttachments)) {
                const draftHomeFunStudy: DraftHomeFunStudyFeedback = {
                    ...homeFunStudyFeedback,
                    status: `draft`,
                    attachments: submittedAttachments,
                };
                setHomeFunStudyFeedback(draftHomeFunStudy);
                updateHomeFunStudyById({
                    scheduleId,
                    userId,
                }, draftHomeFunStudy);
                enqueueSnackbar(intl.formatMessage({
                    id: `upload_failed`,
                    defaultMessage: `Upload file failed`,
                }), {
                    variant: `error`,
                    anchorOrigin: {
                        vertical: `top`,
                        horizontal: `center`,
                    },
                });
            } else {
                const submittedHomeFunStudy: SubmittedHomeFunStudyFeedback = {
                    ...homeFunStudyFeedback,
                    status: `submitted`,
                    attachments: submittedAttachments,
                };

                setHomeFunStudyFeedback(submittedHomeFunStudy);
                updateHomeFunStudyById({
                    scheduleId,
                    userId,
                }, submittedHomeFunStudy);
                const result = await postScheduleFeedback({
                    assignments: submittedAttachments,
                    comment: homeFunStudyFeedback.comment,
                    org_id: organizationId,
                    schedule_id: scheduleId,
                });
                if (result.label === ScheduleErrorLabel.CAN_NOT_SUBMIT) {
                    showPopup({
                        variant: `error`,
                        title: intl.formatMessage({
                            id: `submission_failed`,
                        }),
                        description: [
                            intl.formatMessage({
                                id: `homeFunStudy.submission.error.rejected`,
                            }),
                        ],
                        closeLabel: intl.formatMessage({
                            id: `button_ok`,
                            defaultMessage: `Ok`,
                        }),
                    });
                    return;
                }
                removeAllDraftFilesById({
                    userId,
                    scheduleId,
                });
                removeHomeFunStudyById({
                    userId,
                    scheduleId,
                });
                enqueueSnackbar(intl.formatMessage({
                    id: `submission_successful`,
                }), {
                    variant: `success`,
                    anchorOrigin: {
                        vertical: `top`,
                        horizontal: `center`,
                    },
                });
                history.goBack();
            }
        } catch(err) {
            console.error(err);
            showSubmitFailedError();
        }
    };

    return (
        <>
            <AppBar
                leading={(
                    <BackButton
                        onClick={handleBackClick}
                    />
                )}
                title={scheduleData?.title}
            />
            <Box
                component="div"
                height="100%"
                overflow="auto">
                {isFetchingSchedule
                    ? <ScheduleLoading />
                    : (
                        <Box
                            px={3}
                            py={2}
                        >
                            <Box mb={2}>
                                <Typography variant="subtitle1">
                                    <FormattedMessage id="home_fun_study_your_task" />
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                >
                                    {scheduleData?.description
                                        ? scheduleData.description
                                        : <FormattedMessage id="label_not_defined" />
                                    }
                                </Typography>
                            </Box>
                            <Box mb={3}>
                                <Typography variant="subtitle1">
                                    <FormattedMessage id="scheduleDetails.dueDate" />
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                >
                                    {(scheduleData?.due_at && scheduleData.due_at !== 0)
                                        ? formatDueDateMillis(fromSecondsToMilliseconds(scheduleData.due_at), intl)
                                        : <FormattedMessage id="label_not_defined"/>
                                    }
                                </Typography>
                            </Box>
                            <Box mb={2}>
                                <HomeFunStudyAttachmentsSection
                                    visibilityState={visibilityState}
                                    attachments={homeFunStudyFeedback.attachments}
                                    onClickChooseFile={() => setOpenBottomSelector(true)}
                                    onRemoveAttachment={onRemoveAttachment}
                                />
                            </Box>
                            <HomeFunStudyCommentSection
                                visibilityState={visibilityState}
                                comment={homeFunStudyFeedback.comment}
                                onChange={handleOnCommentChange}
                            />
                        </Box>
                    )}
                {!(scheduleNewestFeedbackData?.is_allow_submit) && <HomeFunStudyTeacherFeedback
                    organizationId={organizationId}
                    scheduleId={scheduleId}/>}
            </Box>
            {(scheduleNewestFeedbackData?.is_allow_submit) && <div className={classes.buttonWrapper}>
                <Button
                    fullWidth
                    variant="contained"
                    className={clsx({
                        [classes.buttonSubmitting]: isLoadingPostScheduleFeedback,
                    }, classes.roundedButton)}
                    color="primary"
                    disabled={!canSubmit || homeFunStudyFeedback.status !== `draft` || homeFunStudyFeedback.attachments.length === 0}
                    onClick={() => submitFeedback()}
                >
                    <FormattedMessage id="button_submit"/>
                </Button>
                {isLoadingPostScheduleFeedback && (
                    <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                    />
                )}
            </div>}
            <BottomSelector
                open={openBottomSelector}
                onClose={() => {
                    setOpenBottomSelector(false);
                }}
                onOpen={() => {
                    setOpenBottomSelector(true);
                }}
                onSelectedFile={onSelectedFile}
            />
        </>
    );
}
