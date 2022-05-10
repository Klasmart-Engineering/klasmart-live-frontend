import { getIdStudyType } from "../../shared";
import BaseScheduleDialog from "@/app/components/Schedule/BaseDialog";
import { useSelectedOrganizationValue } from "@/app/data/user/atom";
import { dialogsState } from "@/app/model/appModel";
import { ScheduleLiveTokenType } from "@/app/services/cms/ISchedulerService";
import { formatDateTimeMillis } from "@/app/utils/dateTimeUtils";
import { generateDescriptionHasHyperLink } from "@/app/utils/link";
import { useSessionContext } from "@/providers/session-context";
import { fromSecondsToMilliseconds } from "@/utils/utils";
import {
    SchedulesTimeViewListItem,
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
import { useHistory } from "react-router";
import { useRecoilState } from "recoil";
import { ClassType } from "@/store/actions";

const useStyles = makeStyles(() => createStyles({
    rowContentText: {
        overflowWrap: `break-word`,
        wordWrap: `break-word`,
    },
}));

interface Props {
    studySchedule?: SchedulesTimeViewListItem;
    open: boolean;
    onClose: () => void;
}

export default function StudyDetailsDialog (props: Props) {
    const {
        open,
        studySchedule,
        onClose,
    } = props;
    const { enqueueSnackbar } = useSnackbar();
    const intl = useIntl();
    const classes = useStyles();
    const [ getTokenLoading, setGetTokenLoading ] = useState(false);
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const [ hyperlink, setHyperlink ] = useState<string>();
    const {
        setToken,
        setTitle,
        setDueDate,
        setTeachers,
    } = useSessionContext();
    const { push } = useHistory();
    const organization = useSelectedOrganizationValue();

    const { actions } = useCmsApiClient();

    const organizationId = organization?.organization_id ?? ``;

    const { data: scheduleData, isFetching: isFetchingSchedule } = useGetScheduleById({
        org_id: organizationId,
        schedule_id: studySchedule?.id ?? ``,
    }, {
        queryOptions: {
            enabled: !!studySchedule?.id && !!organizationId,
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
        if (!studySchedule) return;
        setGetTokenLoading(true);
        try {
            const { token } = await actions.getLiveTokenByScheduleId({
                org_id: organizationId,
                schedule_id: studySchedule.id,
                live_token_type: ScheduleLiveTokenType.LIVE,
            });
            setTitle(scheduleData?.title);
            setDueDate(scheduleData?.due_at);
            setTeachers(scheduleData?.teachers);
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
        <BaseScheduleDialog
            open={open}
            title={scheduleData?.title ?? ``}
            isLoading={isFetchingSchedule}
            classType={scheduleData?.is_home_fun ? ClassType.HOME_FUN_STUDY : scheduleData?.is_review ? ClassType.REVIEW : ClassType.STUDY}
            teachers={scheduleData?.teachers ?? []}
            attachment={scheduleData?.attachment}
            description={scheduleData?.description ? generateDescriptionHasHyperLink(scheduleData.description, (url) => setHyperlink(url)) : undefined}
            dateTime={formatDateTimeMillis(fromSecondsToMilliseconds(scheduleData?.due_at ?? 0), intl)}
            actionButtonTitle={intl.formatMessage({
                id: getIdStudyType(studySchedule),
            })}
            disabled={getTokenLoading || isFetchingSchedule}
            onClose={onClose}
            onClick={() => handleJoinClass(scheduleData?.is_home_fun)}
        />
    );
}
