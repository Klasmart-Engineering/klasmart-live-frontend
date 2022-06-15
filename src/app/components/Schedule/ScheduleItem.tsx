import { SECONDS_BEFORE_CLASS_CAN_START } from "./Live/Dialog/Details";
import ScheduleJoinButtonNew from "./ScheduleJoinButtonNew";
import { useSelectedOrganizationValue } from "@/app/data/user/atom";
import { formatStartEndTimeMillis } from "@/app/utils/dateTimeUtils";
import ScheduleButtonArrowMobile from "@/assets/img/schedule-icon/schedule-button-arrow-mobile.svg";
import ScheduleButtonArrowTablet from "@/assets/img/schedule-icon/schedule-button-arrow-tablet.svg";
import SeeDetail from "@/assets/img/schedule-icon/see-details-icon.svg";
import ThumbnailIcon from "@/assets/img/schedule-icon/thumbnail-icon.svg";
import {
    BODY_TEXT,
    SCHEDULE_CARD_BACKGROUND_THUMBNAIL,
    SCHEDULE_CARD_SEE_DETAILS,
    SCHEDULE_CARD_TITLE,
    THEME_COLOR_BACKGROUND_PAPER,
} from "@/config";
import { ClassType } from "@/store/actions";
import { fromSecondsToMilliseconds } from "@/utils/utils";
import { useGetScheduleById } from "@kl-engineering/cms-api-client";
import { UserAvatar } from "@kl-engineering/kidsloop-px";
import {
    Box,
    Button,
    createStyles,
    makeStyles,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import clsx from "clsx";
import React,
{
    useEffect,
    useState,
} from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    container: {
        width: 296,
        height: 216,
        borderRadius: theme.spacing(2.5),
        backgroundColor: THEME_COLOR_BACKGROUND_PAPER,
        padding: theme.spacing(2, 1.375, 2, 2),
        justifyContent: `space-between`,
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(`md`)]: {
            width: 426,
            height: 340,
            padding: theme.spacing(4.5, 3, 3, 3),
            marginRight: theme.spacing(2.8),
        },
    },
    avatar: {
        width: 22,
        height: 22,
        [theme.breakpoints.up(`md`)]: {
            width: 32,
            height: 32,
        },
    },
    contentWrapper: {
        display: `flex`,
    },
    rightContent: {
        marginLeft: theme.spacing(1.5),
        paddingTop: theme.spacing(1),
        maxWidth: `50%`,
        [theme.breakpoints.up(`md`)]: {
            paddingTop: theme.spacing(1.5),
        },
    },
    bottom: {
        display: `flex`,
        justifyContent: `space-between`,
        alignItems: `flex-end`,
    },
    thumbnail: {
        minWidth: 122,
        minHeight: 96,
        backgroundColor: SCHEDULE_CARD_BACKGROUND_THUMBNAIL,
        justifyContent: `center`,
        borderRadius: theme.spacing(1.5),
        [theme.breakpoints.up(`md`)]: {
            minWidth: 176,
            minHeight: 139,
        },
    },
    seeDetailText: {
        fontSize: `0.7rem`,
        color: SCHEDULE_CARD_SEE_DETAILS,
        paddingLeft: theme.spacing(0.5),
        [theme.breakpoints.up(`md`)]: {
            fontSize: `1rem`,
        },
    },
    teacherWrapper: {
        paddingTop: theme.spacing(1),
        [theme.breakpoints.up(`md`)]: {
            paddingTop: theme.spacing(2.2),
        },
    },
    teacherItem: {
        marginBottom: theme.spacing(0.5),
    },
    teacherName: {
        marginLeft: theme.spacing(0.5),
        fontSize: `0.675rem`,
        color: SCHEDULE_CARD_TITLE,
        [theme.breakpoints.up(`md`)]: {
            fontSize: `1.02rem`,
            marginLeft: theme.spacing(0.75),
        },
    },
    moreThan2TeachersText: {
        marginLeft: theme.spacing(0.25),
        fontSize: `0.6875rem`,
        color: SCHEDULE_CARD_TITLE,
        [theme.breakpoints.up(`md`)]: {
            fontSize: `1rem`,
        },
    },
    secondAvatar: {
        marginLeft: theme.spacing(-1.75),
    },
    titleSize: {
        fontSize: `0.75rem`,
        [theme.breakpoints.up(`md`)]: {
            fontSize: `1.12rem`,
        },
    },
    titleWrapper: {
        minHeight: 36,
        [theme.breakpoints.up(`md`)]: {
            minHeight: 54,
        },
    },
    fontWeightBold: {
        fontWeight: theme.typography.fontWeightBold as number,
    },
    fontWeightMedium: {
        fontWeight: theme.typography.fontWeightMedium as number,
    },
    textColorGrey: {
        color: BODY_TEXT,
    },
    ellipsis: {
        textOverflow: `ellipsis`,
        overflow: `hidden`,
        display: `-webkit-box`,
        WebkitBoxOrient: `vertical`,
    },
    flexAlignCenter: {
        display: `flex`,
        alignItems: `center`,
    },
    flexColumn: {
        display: `flex`,
        flexDirection: `column`,
    },
    noWrap: {
        whiteSpace: `nowrap`,
    },
}));

export interface Props {
  scheduleId: string;
  classType: string;
  title: string;
  actionTitle?: string;
  start_at?: number;
  end_at?: number;
  isReport?: boolean;
  isShowFeedback?: boolean;
  onDetailClick?: () => void;
  onClick?: () => void;
}

export default function ScheduleItem (props: Props) {
    const {
        scheduleId,
        classType,
        title,
        actionTitle,
        start_at,
        end_at,
        isReport = false,
        isShowFeedback = false,
        onDetailClick,
        onClick,
    } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up(`md`));
    const intl = useIntl();
    const [ timeBeforeClassSeconds, setTimeBeforeClassSeconds ] = useState(Number.MAX_SAFE_INTEGER);
    const [ isDisable, setActive ] = useState(false);
    const [ names, setNames ] = useState<string[]>([]);
    const organization = useSelectedOrganizationValue();
    const organizationId = organization?.organization_id ?? ``;
    const { data: scheduleData, isFetching: isFetchingSchedule } = useGetScheduleById({
        schedule_id: scheduleId,
        org_id: organizationId,
    }, {
        queryOptions: {
            enabled: !!scheduleId && !!organizationId,
        },
    });
    const maximumTeachers = 2;
    const maxLengthOfTeacherName = 15;
    const maxLengthOfTitle = 75;

    useEffect(() => {
        if (!scheduleData) return;
        const teacherNames: string[] = [];
        scheduleData.teachers.forEach((item) => teacherNames.push(item.name));
        setNames(teacherNames);
    }, [ scheduleData ]);

    useEffect(() => {
        setActive(timeBeforeClassSeconds > SECONDS_BEFORE_CLASS_CAN_START && classType === ClassType.LIVE && !isReport);
    }, [ timeBeforeClassSeconds ]);

    useEffect(() => {
        if (!start_at) return;
        const nowInSeconds = new Date()
            .getTime() / 1000;
        const timeBeforeClassSeconds = start_at - nowInSeconds;
        const timeRemainingBeforeCanEnterClass = timeBeforeClassSeconds - SECONDS_BEFORE_CLASS_CAN_START;

        setTimeBeforeClassSeconds(timeBeforeClassSeconds);

        const timeOut = setTimeout(() => {
            setTimeBeforeClassSeconds(0);
        }, fromSecondsToMilliseconds(timeRemainingBeforeCanEnterClass));

        return () => {
            setTimeBeforeClassSeconds(Number.MAX_SAFE_INTEGER);
            clearTimeout(timeOut);
        };
    }, []);

    const teacherNameEllipsis = (name: string) => {
        return name.length > maxLengthOfTeacherName ? `${name.slice(0, maxLengthOfTeacherName)}...` : name;
    };

    const moreThan2Teachers = () => {
        if(names.length > 2)
        {
            const remainingTeachers = names.length - 1;
            return (
                <>
                    <Box
                        className={clsx(classes.teacherItem, classes.flexAlignCenter)}
                    >
                        <UserAvatar
                            name={names[0]}
                            size="small"
                            className={classes.avatar}
                        />
                        <Typography className={clsx(classes.teacherName, classes.fontWeightBold, classes.ellipsis)}>
                            {teacherNameEllipsis(names[0])}
                        </Typography>
                    </Box>
                    <Box className={classes.flexAlignCenter}>
                        <UserAvatar
                            name={names[1]}
                            size="small"
                            className={classes.avatar}
                        />
                        <UserAvatar
                            name={names[2]}
                            size="small"
                            className={clsx(classes.secondAvatar, classes.avatar)}
                        />
                        <Typography className={clsx(classes.moreThan2TeachersText, classes.noWrap, classes.fontWeightBold)}>
                            {`+ ${remainingTeachers} more teachers`}
                        </Typography>
                    </Box>
                </>

            );

        }
    };

    return (
        <Box className={clsx(classes.container, classes.flexColumn)}>
            <Box className={classes.titleWrapper}>
                <Typography className={clsx(classes.textColorGrey, classes.fontWeightBold, classes.titleSize)}>
                    {title.length > maxLengthOfTitle ? `${title.slice(0, maxLengthOfTitle)}...` : title}
                </Typography>
            </Box>
            <Box className={classes.contentWrapper}>
                <Box className={clsx(classes.thumbnail, classes.flexAlignCenter)}>
                    <img
                        alt="thumbnail"
                        src={ThumbnailIcon}
                    />
                </Box>
                <Box className={clsx(classes.rightContent, classes.flexColumn)}>
                    <Box >
                        {
                            start_at && end_at && classType === ClassType.LIVE ?
                                (
                                    <Typography
                                        variant={`subtitle1`}
                                        className={clsx(classes.textColorGrey, classes.fontWeightBold, classes.titleSize)}
                                    >
                                        {formatStartEndTimeMillis(fromSecondsToMilliseconds(start_at), fromSecondsToMilliseconds(end_at), intl)}
                                    </Typography>) : null
                        }
                    </Box>
                    <Box className={classes.teacherWrapper}>
                        {names.length > maximumTeachers ? moreThan2Teachers() : names.slice(0, 2)
                            .map(name => (
                                <Box
                                    key={name}
                                    className={clsx(classes.teacherItem, classes.flexAlignCenter)}
                                >
                                    <UserAvatar
                                        name={name}
                                        size="small"
                                        className={classes.avatar}
                                    />
                                    <Typography className={clsx(classes.teacherName, classes.fontWeightBold)}>
                                        {teacherNameEllipsis(name)}
                                    </Typography>
                                </Box>
                            ))}
                    </Box>
                </Box>
            </Box>
            <Box className={classes.bottom}>
                <Button
                    disableElevation
                    style={{
                        padding: 0,
                    }}
                    onClick={onDetailClick}
                >
                    <img
                        alt="detail"
                        src={SeeDetail}
                    />
                    <Typography className={clsx(classes.seeDetailText, classes.fontWeightMedium)}>
                        <FormattedMessage
                            id="support_file_size"
                            defaultMessage="See Details"
                        />
                    </Typography>
                </Button>
                <ScheduleJoinButtonNew
                    disabled={isDisable}
                    endIcon={
                        <img
                            alt="arrow"
                            src={isMdUp ? ScheduleButtonArrowTablet: ScheduleButtonArrowMobile}
                        />}
                    title={actionTitle}
                    onClick={onClick}
                />
            </Box>
        </Box>
    );
}
