import DialogParentalLock from "@/app/components/ParentalLock";
import BaseScheduleDialog from "@/app/components/Schedule/BaseDialog";
import { useSelectedOrganizationValue } from "@/app/data/user/atom";
import { dialogsState } from "@/app/model/appModel";
import { ScheduleLiveTokenType } from "@/app/services/cms/ISchedulerService";
import { formatStartEndDateTimeMillis } from "@/app/utils/dateTimeUtils";
import {
    generateDescriptionHasHyperLink,
    openHyperLink,
} from "@/app/utils/link";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import { fromSecondsToMilliseconds } from "@/utils/utils";
import {
    useCmsApiClient,
    useGetScheduleById,
} from "@kl-engineering/cms-api-client";
import { useSnackbar } from "@kl-engineering/kidsloop-px";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";
import { useRecoilState } from "recoil";

const useStyles = makeStyles(() => createStyles({
    rowContentText: {
        overflowWrap: `break-word`,
        wordWrap: `break-word`,
    },
}));

export const SECONDS_BEFORE_CLASS_CAN_START = 15 * 60; // 15 minutes

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
    const [ timeBeforeClassSeconds, setTimeBeforeClassSeconds ] = useState(Number.MAX_SAFE_INTEGER);
    const [ getTokenLoading, setGetTokenLoading ] = useState(false);
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const [ hyperlink, setHyperlink ] = useState<string>();
    const {
        setToken,
        setTitle,
        setTeachers,
        setStartTime,
    } = useSessionContext();
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

        const nowInSeconds = new Date().getTime() / 1000;
        const timeBeforeClassSeconds = scheduleData.start_at - nowInSeconds;
        const timeRemainingBeforeCanEnterClass = timeBeforeClassSeconds - SECONDS_BEFORE_CLASS_CAN_START;

        setTimeBeforeClassSeconds(timeBeforeClassSeconds);

        const timeOut = setTimeout(() => {
            setTimeBeforeClassSeconds(0);
        }, fromSecondsToMilliseconds(timeRemainingBeforeCanEnterClass));

        return () => {
            setTimeBeforeClassSeconds(Number.MAX_SAFE_INTEGER);
            clearTimeout(timeOut);
        };
    }, [ scheduleData ]);

    const setParentalLock = (open: boolean) => {
        setDialogs({
            ...dialogs,
            isParentalLockOpen: open,
        });
    };

    const handleJoinLiveClass = async () => {
        if (!scheduleId) return;
        setGetTokenLoading(true);
        try {
            const { token } = await actions.getLiveTokenByScheduleId({
                org_id: organizationId,
                schedule_id: scheduleId,
                live_token_type: ScheduleLiveTokenType.LIVE,
            });
            setToken(token);
            setTitle(scheduleData?.title);
            setTeachers(scheduleData?.teachers);
            setStartTime(scheduleData?.start_at);
            onClose();
            /* TODO: Can we get rid of the token query parameter and just use
            ** react component state for keeping and parsing the token instead? */
            location.href = `#/room?token=${token}`;
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
        if (!dialogs.isParentalLockOpen) {
            setHyperlink(undefined);
        }
    }, [ dialogs.isParentalLockOpen ]);

    if (dialogs.isParentalLockOpen && hyperlink) {
        return (
            <DialogParentalLock
                onCompleted={() => {
                    openHyperLink(hyperlink ?? ``);
                    setParentalLock(false);
                }}
            />
        );
    }

    return (
        <BaseScheduleDialog
            open={open}
            title={scheduleData?.title ?? ``}
            isLoading={isFetchingSchedule}
            classType={ClassType.LIVE}
            teachers={scheduleData?.teachers ?? []}
            attachment={scheduleData?.attachment}
            description={scheduleData?.description ? generateDescriptionHasHyperLink(scheduleData.description, (url) => setHyperlink(url)) : undefined}
            dateTime={formatStartEndDateTimeMillis(fromSecondsToMilliseconds(scheduleData?.start_at ?? 0), fromSecondsToMilliseconds(scheduleData?.end_at ?? 0), intl)}
            actionButtonTitle={intl.formatMessage({
                id: `schedule.status.joinNow`,
                defaultMessage: `Join Now`,
            })}
            disabled={timeBeforeClassSeconds > SECONDS_BEFORE_CLASS_CAN_START || getTokenLoading || isFetchingSchedule || !scheduleId || !organizationId}
            onClick={handleJoinLiveClass}
            onClose={onClose}
        />
    );

}
