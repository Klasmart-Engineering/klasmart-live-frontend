import DialogParentalLock from "@/app/components/ParentalLock";
import AttachmentDownloadButton from "@/app/components/Schedule/Attachment/DownloadButton";
import AttachmentNameLink from "@/app/components/Schedule/Attachment/NameLink";
import BaseScheduleDialog from "@/app/components/Schedule/BaseDialog";
import { useSelectedOrganizationValue } from "@/app/data/user/atom";
import {
    homeFunStudyState,
    LayoutMode,
    layoutModeState,
} from "@/app/model/appModel";
import { ScheduleLiveTokenType } from "@/app/services/cms/ISchedulerService";
import { formatDateTimeMillis } from "@/app/utils/dateTimeUtils";
import { generateDescriptionHasHyperLink } from "@/app/utils/link";
import { BG_COLOR_GO_STUDY_PRIMARY } from "@/config";
import { useSessionContext } from "@/providers/session-context";
import { fromSecondsToMilliseconds } from "@/utils/utils";
import {
    useCmsApiClient,
    useGetScheduleById,
} from "@kidsloop/cms-api-client";
import {
    createStyles,
    Grid,
    makeStyles,
    Typography,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";
import { useHistory } from "react-router";
import {
    useRecoilState,
    useSetRecoilState,
} from "recoil";

const useStyles = makeStyles((theme) => createStyles({
    rowContentText: {
        color: `#193756`,
        fontWeight: theme.typography.fontWeightBold as number,
        overflowWrap: `break-word`,
        wordWrap: `break-word`,
    },
}));

interface Props {
    scheduleId?: string;
    open: boolean;
    onClose: () => void;
}

export default function StudyDetailsDialog (props: Props) {
    const {
        scheduleId = ``,
        open,
        onClose,
    } = props;
    const { enqueueSnackbar } = useSnackbar();
    const intl = useIntl();
    const classes = useStyles();
    const setLayoutMode = useSetRecoilState(layoutModeState);
    const [ getTokenLoading, setGetTokenLoading ] = useState(false);
    const [ parentalLock, setParentalLock ] = useState(false);
    const [ homeFunStudy, setHomeFunStudy ] = useRecoilState(homeFunStudyState);
    const [ hyperlink, setHyperlink ] = useState<string>();
    const { setToken } = useSessionContext();
    const { push } = useHistory();
    const organization = useSelectedOrganizationValue();

    const { actions } = useCmsApiClient();

    const organizationId = organization?.organization_id ?? ``;

    const { data: scheduleData, isFetching: isFetchingSchedule } = useGetScheduleById({
        org_id: organizationId,
        schedule_id: scheduleId,
    }, {
        queryOptions: {
            enabled: !!scheduleId && !!organizationId,
        },
    });

    const handleJoinStudyClass = async () => {
        if (!scheduleId) return;
        setGetTokenLoading(true);
        try {
            const { token } = await actions.getLiveTokenByScheduleId({
                org_id: organizationId,
                schedule_id: scheduleId,
                live_token_type: ScheduleLiveTokenType.LIVE,
            });
            setLayoutMode(LayoutMode.CLASSROOM);
            setToken(token);
            onClose();
            push(`/join?token=${token}`);
        } catch (err) {
            enqueueSnackbar(intl.formatMessage({
                id: `error_unknown_error`,
            }), {
                variant: `error`,
            });
        }
        setGetTokenLoading(false);
    };

    const handleJoinHomeFunStudyClass = () => {
        if (!scheduleData) return;
        setHomeFunStudy({
            ...homeFunStudy,
            open: true,
            submitted: false,
            studyId: scheduleData.id,
        });
    };

    useEffect(() => {
        if (hyperlink) {
            setParentalLock(true);
        }
    }, [ hyperlink ]);

    useEffect(() => {
        if (!parentalLock) {
            setHyperlink(undefined);
        }
    }, [ parentalLock ]);

    return (
        <>
            <BaseScheduleDialog
                key={`BaseScheduleDialog`}
                color={BG_COLOR_GO_STUDY_PRIMARY}
                open={open}
                title={scheduleData?.title || intl.formatMessage({
                    id: `scheduleDetails.notApplicable`,
                })}
                contentItems={[
                    {
                        header: intl.formatMessage({
                            id: `scheduleDetails.description`,
                        }),
                        content: (
                            <Typography
                                variant="body1"
                                className={classes.rowContentText}
                            >
                                {scheduleData?.description
                                    ? generateDescriptionHasHyperLink(scheduleData.description, (url) => setHyperlink(url))
                                    : intl.formatMessage({
                                        id: `scheduleDetails.notApplicable`,
                                    })
                                }
                            </Typography>
                        ),
                    },
                    ...scheduleData?.due_at ? [
                        {
                            header: intl.formatMessage({
                                id: `scheduleDetails.dueDate`,
                            }),
                            content: (
                                <Typography
                                    variant="body1"
                                    className={classes.rowContentText}
                                >
                                    {formatDateTimeMillis(fromSecondsToMilliseconds(scheduleData?.due_at ?? 0), intl)}
                                </Typography>
                            ),
                        },
                    ] : [],
                    {
                        header: intl.formatMessage({
                            id: `scheduleDetails.className`,
                        }),
                        content: (
                            <Typography
                                variant="body1"
                                className={classes.rowContentText}
                            >
                                {scheduleData?.class.name || intl.formatMessage({
                                    id: `scheduleDetails.notApplicable`,
                                })}
                            </Typography>
                        ),
                    },
                    {
                        header: intl.formatMessage({
                            id: `scheduleDetails.teacher`,
                        }),
                        content: (
                            <Grid
                                container
                                direction={`column`}
                            >
                                {scheduleData?.teachers?.map(item => (
                                    <Grid
                                        key={item.id}
                                        item
                                    >
                                        <Typography
                                            variant="body1"
                                            className={classes.rowContentText}
                                        >
                                            {item.name}
                                        </Typography>
                                    </Grid>
                                ))}
                            </Grid>
                        ),
                    },
                    {
                        header: intl.formatMessage({
                            id: `scheduleDetails.lessonPlan`,
                        }),
                        content: (
                            <Typography
                                variant="body1"
                                className={classes.rowContentText}
                            >
                                {scheduleData?.lesson_plan?.name || intl.formatMessage({
                                    id: `scheduleDetails.notApplicable`,
                                })}
                            </Typography>
                        ),
                    },
                    {
                        header: intl.formatMessage({
                            id: `scheduleDetails.attachment`,
                        }),
                        content: scheduleData?.attachment?.name
                            ? (
                                <Grid
                                    container
                                    direction={`row`}
                                    justifyContent={`space-between`}
                                    alignItems={`center`}
                                >
                                    <AttachmentNameLink
                                        attachmentId={scheduleData.attachment.id}
                                        attachmentName={scheduleData.attachment.name}
                                    />
                                    <AttachmentDownloadButton
                                        attachmentId={scheduleData.attachment.id}
                                        attachmentName={scheduleData.attachment.name}
                                    />
                                </Grid>
                            ) : (
                                <Typography
                                    variant="body1"
                                    className={classes.rowContentText}
                                >
                                    {intl.formatMessage({
                                        id: `scheduleDetails.notApplicable`,
                                    })}
                                </Typography>
                            ),
                    },
                ]}
                actions={[
                    {
                        label: intl.formatMessage({
                            id: `button_go_study`,
                        }),
                        align: `end`,
                        color: `primary`,
                        disabled: getTokenLoading || isFetchingSchedule,
                        onClick: () => scheduleData?.is_home_fun ? handleJoinHomeFunStudyClass() : handleJoinStudyClass(),
                    },
                ]}
                isLoading = {isFetchingSchedule}
                onClose={onClose}
            />
            <DialogParentalLock
                key={`DialogParentalLock`}
                hyperlink={hyperlink ?? ``}
                open={parentalLock}
                onClose={() => setParentalLock(false)}
            />
        </>
    );
}
