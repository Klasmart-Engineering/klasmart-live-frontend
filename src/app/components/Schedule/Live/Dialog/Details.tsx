import DialogParentalLock from "@/app/components/ParentalLock";
import AttachmentDownloadButton from "@/app/components/Schedule/Attachment/DownloadButton";
import AttachmentNameLink from "@/app/components/Schedule/Attachment/NameLink";
import BaseScheduleDialog from "@/app/components/Schedule/BaseDialog";
import { useSelectedOrganizationValue } from "@/app/data/user/atom";
import {
    LayoutMode,
    layoutModeState,
} from "@/app/model/appModel";
import { ScheduleLiveTokenType } from "@/app/services/cms/ISchedulerService";
import { formatDateTimeMillis } from "@/app/utils/dateTimeUtils";
import { generateDescriptionHasHyperLink } from "@/app/utils/link";
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
import { useSetRecoilState } from "recoil";

const useStyles = makeStyles((theme) => createStyles({
    rowContentText: {
        color: `#193756`,
        fontWeight: theme.typography.fontWeightBold as number,
        overflowWrap: `break-word`,
        wordWrap: `break-word`,
    },
}));

const SECONDS_BEFORE_CLASS_CAN_START = 15 * 60; // 15 minutes

interface Props {
    scheduleId?: string;
    open: boolean;
    onClose: () => void;
}

export default function LiveDetailsDialog (props: Props) {
    const {
        scheduleId = ``,
        open,
        onClose,
    } = props;
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const intl = useIntl();
    const setLayoutMode = useSetRecoilState(layoutModeState);
    const [ timeBeforeClassSeconds, setTimeBeforeClassSeconds ] = useState(Number.MAX_SAFE_INTEGER);
    const [ getTokenLoading, setGetTokenLoading ] = useState(false);
    const [ parentalLock, setParentalLock ] = useState(false);
    const [ hyperlink, setHyperlink ] = useState<string>();
    const { setToken } = useSessionContext();
    const organization = useSelectedOrganizationValue();

    const organizationId = organization?.organization_id ?? ``;

    const { actions } = useCmsApiClient();

    const { data: scheduleData, isFetching: isFetchingSchedule } = useGetScheduleById({
        schedule_id: scheduleId,
        org_id: organizationId,
    }, {
        queryOptions: {
            enabled: !!scheduleId && !!organizationId,
        },
    });

    useEffect(() => {
        if (!scheduleData) return;
        const timer = setInterval(() => {
            const nowInSeconds = new Date().getTime() / 1000;
            const timeBeforeClassSeconds = scheduleData.start_at - nowInSeconds;
            setTimeBeforeClassSeconds(timeBeforeClassSeconds);
        }, 1000);
        return () => {
            clearInterval(timer);
            setTimeBeforeClassSeconds(Number.MAX_SAFE_INTEGER);
        };
    }, [ scheduleData ]);

    const handleJoinLiveClass = async () => {
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
            /* TODO: Can we get rid of the token query parameter and just use
            ** react component state for keeping and parsing the token instead? */
            location.href = `#/join?token=${token}`;
        } catch (err) {
            enqueueSnackbar(intl.formatMessage({
                id: `error_unknown_error`,
            }), {
                variant: `error`,
            });
        }
        setGetTokenLoading(false);
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

    if (parentalLock && hyperlink) {
        return (
            <DialogParentalLock
                hyperlink={hyperlink}
                open={parentalLock}
                onClose={() => setParentalLock(false)}
            />
        );
    }

    return (
        <BaseScheduleDialog
            open={open}
            title={scheduleData?.title ?? intl.formatMessage({
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
                {
                    header: intl.formatMessage({
                        id: `scheduleDetails.startTime`,
                    }),
                    content: (
                        <Typography
                            variant="body1"
                            className={classes.rowContentText}
                        >
                            {formatDateTimeMillis(fromSecondsToMilliseconds(scheduleData?.start_at ?? 0), intl) || intl.formatMessage({
                                id: `scheduleDetails.notApplicable`,
                            })}
                        </Typography>
                    ),
                },
                {
                    header: intl.formatMessage({
                        id: `scheduleDetails.endTime`,
                    }),
                    content: (
                        <Typography
                            variant="body1"
                            className={classes.rowContentText}
                        >
                            {formatDateTimeMillis(fromSecondsToMilliseconds(scheduleData?.end_at ?? 0), intl) || intl.formatMessage({
                                id: `scheduleDetails.notApplicable`,
                            })}
                        </Typography>
                    ),
                },
                {
                    header: intl.formatMessage({
                        id: `scheduleDetails.className`,
                    }),
                    content: (
                        <Typography
                            variant="body1"
                            className={classes.rowContentText}
                        >
                            {scheduleData?.class?.name || intl.formatMessage({
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
                            {scheduleData?.teachers?.map((item) => (
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
                        id: `button_cancel`,
                    }),
                    align: `end`,
                    onClick: onClose,
                },
                {
                    label: intl.formatMessage({
                        id: `button_go_live`,
                    }),
                    align: `end`,
                    color: `primary`,
                    disabled: timeBeforeClassSeconds > SECONDS_BEFORE_CLASS_CAN_START || getTokenLoading || isFetchingSchedule || !scheduleId || !organizationId,
                    onClick: () => handleJoinLiveClass(),
                },
            ]}
            onClose={onClose}
        />
    );
}
