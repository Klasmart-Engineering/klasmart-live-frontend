import { getIdStudyType } from "../../shared";
import DialogParentalLock from "@/app/components/ParentalLock";
import AttachmentDownloadButton from "@/app/components/Schedule/Attachment/DownloadButton";
import AttachmentNameLink from "@/app/components/Schedule/Attachment/NameLink";
import BaseScheduleDialog from "@/app/components/Schedule/BaseDialog";
import { useSelectedOrganizationValue } from "@/app/data/user/atom";
import { dialogsState } from "@/app/model/appModel";
import { ScheduleLiveTokenType } from "@/app/services/cms/ISchedulerService";
import { formatDateTimeMillis } from "@/app/utils/dateTimeUtils";
import {
    generateDescriptionHasHyperLink,
    openHyperLink,
} from "@/app/utils/link";
import { BG_COLOR_GO_STUDY_PRIMARY } from "@/config";
import { useSessionContext } from "@/providers/session-context";
import { fromSecondsToMilliseconds } from "@/utils/utils";
import {
    useCmsApiClient,
    useGetScheduleById,
} from "@kl-engineering/cms-api-client";
import { useSnackbar } from "@kl-engineering/kidsloop-px";
import {
    createStyles,
    Grid,
    makeStyles,
    Typography,
} from "@material-ui/core";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";
import { useHistory } from "react-router";
import { useRecoilState } from "recoil";

const useStyles = makeStyles(() => createStyles({
    rowContentText: {
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
    const [ getTokenLoading, setGetTokenLoading ] = useState(false);
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
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

    const setParentalLock = (open: boolean) => {
        setDialogs({
            ...dialogs,
            isParentalLockOpen: open,
        });
    };

    const handleJoinClass = (isHomeFun?: boolean) => {
        if(isHomeFun){
            handleJoinHomeFunStudyClass();
        } else {
            handleJoinStudyClass();
        }
        setDialogs({
            ...dialogs,
            isStudyDetailOpen: false,
        });
    };

    const handleJoinStudyClass = async () => {
        if (!scheduleId) return;
        setGetTokenLoading(true);
        try {
            const { token } = await actions.getLiveTokenByScheduleId({
                org_id: organizationId,
                schedule_id: scheduleId,
                live_token_type: ScheduleLiveTokenType.LIVE,
            });
            setToken(token);
            onClose();
            push(`/room?token=${token}`);
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
        if (!scheduleData?.id) return;
        push(`/schedule/home-fun-study/${scheduleData.id}`);
    };

    useEffect(() => {
        if (hyperlink) {
            setParentalLock(true);
        }
    }, [ hyperlink ]);

    useEffect(() => {
        if (!dialogs.isParentalLockOpen) {
            setHyperlink(undefined);
        }
    }, [ dialogs.isParentalLockOpen ]);

    return (
        <>
            <BaseScheduleDialog
                key={`BaseScheduleDialog`}
                color={BG_COLOR_GO_STUDY_PRIMARY}
                open={open}
                title={scheduleData?.title ?? ``}
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
                    ...scheduleData?.is_review ? [] : [
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
                    ],
                    ...scheduleData?.is_review ? [] :[
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
                    ],
                ]}
                actions={[
                    {
                        label: intl.formatMessage({
                            id: getIdStudyType(scheduleData),
                        }),
                        align: `end`,
                        color: `primary`,
                        disabled: getTokenLoading || isFetchingSchedule,
                        onClick: () => handleJoinClass(scheduleData?.is_home_fun),
                    },
                ]}
                isLoading = {isFetchingSchedule}
                onClose={onClose}
            />
            {hyperlink && <DialogParentalLock
                key={`DialogParentalLock`}
                onCompleted={() => {
                    openHyperLink(hyperlink ?? ``);
                    setParentalLock(false);
                }}
                          />}
        </>
    );
}
