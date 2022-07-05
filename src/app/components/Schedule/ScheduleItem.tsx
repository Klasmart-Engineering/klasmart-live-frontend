/* eslint-disable react/no-multi-comp */
import { SECONDS_BEFORE_CLASS_CAN_START } from "./Live/Dialog/Details";
import ScheduleJoiningButton from "./ScheduleJoiningButton";
import { useSelectedOrganizationValue } from "@/app/data/user/atom";
import { formatStartEndTimeMillis } from "@/app/utils/dateTimeUtils";
import ScheduleButtonArrow from "@/assets/img/schedule-icon/schedule-button-arrow-mobile.svg";
import SeeDetails from "@/assets/img/schedule-icon/see-details-icon.svg";
import ThumbnailIcon from "@/assets/img/schedule-icon/thumbnail-icon.svg";
import {
    BODY_TEXT,
    SCHEDULE_CARD_BACKGROUND_THUMBNAIL,
    SCHEDULE_CARD_SEE_DETAILS,
    THEME_COLOR_BACKGROUND_PAPER,
    THEME_COLOR_GREY_TITLE,
} from "@/config";
import { ClassType } from "@/store/actions";
import { isMoreThanTwoWords } from "@/utils/StringUtils";
import {
    fromMillisecondsToSeconds,
    fromSecondsToMilliseconds,
} from "@/utils/utils";
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

const SCHEDULE_BUTTON_ICON_WIDTH_MEDIUM = 8;
const SCHEDULE_BUTTON_ICON_HEIGHT_MEDIUM = 15;
const SCHEDULE_CONTAINER_WIDTH_SMALL = 296;
const SCHEDULE_CONTAINER_HEIGHT_SMALL = 216;
const SCHEDULE_CONTAINER_WIDTH_MEDIUM = 426;
const SCHEDULE_CONTAINER_HEIGHT_MEDIUM = 340;
const SCHEDULE_AVATAR_SMALL = 22;
const SCHEDULE_AVATAR_MEDIUM = 32;
const SCHEDULE_THUMBNAIL_WIDTH_SMALL = 122;
const SCHEDULE_THUMBNAIL_HEIGHT_SMALL = 96;
const SCHEDULE_THUMBNAIL_WIDTH_MEDIUM = 176;
const SCHEDULE_THUMBNAIL_HEIGHT_MEDIUM = 139;
const MAXIMUM_TEACHERS = 2;
const MAX_LENGTH_OF_TEACHER_NAME = 15;
const MAX_LENGTH_OF_TITLE = 75;

const useStyles = makeStyles((theme) => createStyles({
    container: {
        width: SCHEDULE_CONTAINER_WIDTH_SMALL,
        height: SCHEDULE_CONTAINER_HEIGHT_SMALL,
        borderRadius: theme.spacing(2.5),
        backgroundColor: THEME_COLOR_BACKGROUND_PAPER,
        padding: theme.spacing(2, 1.375, 2, 2),
        justifyContent: `space-between`,
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(`md`)]: {
            width: SCHEDULE_CONTAINER_WIDTH_MEDIUM,
            height: SCHEDULE_CONTAINER_HEIGHT_MEDIUM,
            padding: theme.spacing(4.5, 3, 3, 3),
            marginRight: theme.spacing(2.8),
        },
    },
    avatar: {
        width: SCHEDULE_AVATAR_SMALL,
        height: SCHEDULE_AVATAR_SMALL,
        [theme.breakpoints.up(`md`)]: {
            width: SCHEDULE_AVATAR_MEDIUM,
            height: SCHEDULE_AVATAR_MEDIUM,
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
        minWidth: SCHEDULE_THUMBNAIL_WIDTH_SMALL,
        minHeight: SCHEDULE_THUMBNAIL_HEIGHT_SMALL,
        backgroundColor: SCHEDULE_CARD_BACKGROUND_THUMBNAIL,
        justifyContent: `center`,
        borderRadius: theme.spacing(1.5),
        [theme.breakpoints.up(`md`)]: {
            minWidth: SCHEDULE_THUMBNAIL_WIDTH_MEDIUM,
            minHeight: SCHEDULE_THUMBNAIL_HEIGHT_MEDIUM,
        },
    },
    seeDetailsText: {
        fontSize: `0.7rem`,
        color: SCHEDULE_CARD_SEE_DETAILS,
        paddingLeft: theme.spacing(0.5),
        [theme.breakpoints.up(`md`)]: {
            fontSize: `1rem`,
        },
    },
    seeDetailsButton: {
        padding: 0,
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
        color: THEME_COLOR_GREY_TITLE,
        [theme.breakpoints.up(`md`)]: {
            fontSize: `1.02rem`,
            marginLeft: theme.spacing(0.75),
        },
    },
    moreThanTwoTeachersText: {
        marginLeft: theme.spacing(0.25),
        fontSize: `0.6875rem`,
        color: THEME_COLOR_GREY_TITLE,
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
    avatarWithMoreThan2Words: {
        fontSize: `0.5rem`,
        [theme.breakpoints.up(`md`)]: {
            fontSize: `0.75rem`,
        },
    },
    scheduleButtonIcon: {
        [theme.breakpoints.up(`md`)]: {
            width: SCHEDULE_BUTTON_ICON_WIDTH_MEDIUM,
            height: SCHEDULE_BUTTON_ICON_HEIGHT_MEDIUM,
        },
    },
}));

export interface Props {
  scheduleId: string;
  classType: ClassType;
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
    const intl = useIntl();
    const [ timeBeforeClassSeconds, setTimeBeforeClassSeconds ] = useState(Number.MAX_SAFE_INTEGER);
    const [ isDisabled, setIsDisabled ] = useState(false);
    const [ names, setNames ] = useState<string[]>([]);
    const organization = useSelectedOrganizationValue();
    const organizationId = organization?.organization_id ?? ``;
    const remainingTeachers = names.length - 1;
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
        const teacherNames: string[] = [];
        scheduleData.teachers.forEach((teacher) => teacherNames.push(teacher.name));
        setNames(teacherNames);
    }, [ scheduleData ]);

    useEffect(() => {
        setIsDisabled(timeBeforeClassSeconds > SECONDS_BEFORE_CLASS_CAN_START && classType === ClassType.LIVE && !isReport);
    }, [ timeBeforeClassSeconds ]);

    useEffect(() => {
        if (!start_at) return;
        const nowInSeconds = fromMillisecondsToSeconds(new Date()
            .getTime());
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
        return name.length > MAX_LENGTH_OF_TEACHER_NAME ? `${name.slice(0, MAX_LENGTH_OF_TEACHER_NAME)}...` : name;
    };

    const UserAvatarComponent = (name: string, isSecondAvatar = false): JSX.Element => {
        return (
            <UserAvatar
                maxInitialsLength={2}
                name={name}
                size="small"
                className={clsx(classes.avatar, {
                    [classes.avatarWithMoreThan2Words]: isMoreThanTwoWords(name),
                    [classes.secondAvatar]: isSecondAvatar,
                })}
            />
        );
    };

    const teachersContainer = () => {
        return (
            <Box className={classes.teacherWrapper}>
                {names.length > MAXIMUM_TEACHERS ?
                    <>
                        <Box
                            className={clsx(classes.teacherItem, classes.flexAlignCenter)}
                        >

                            {UserAvatarComponent(names[0])}
                            <Typography className={clsx(classes.teacherName, classes.fontWeightBold, classes.ellipsis)}>
                                {teacherNameEllipsis(names[0])}
                            </Typography>
                        </Box>
                        <Box className={classes.flexAlignCenter}>
                            {UserAvatarComponent(names[1])}
                            {UserAvatarComponent(names[2], true)}
                            <Typography className={clsx(classes.moreThanTwoTeachersText, classes.noWrap, classes.fontWeightBold)}>
                                <FormattedMessage
                                    id="schedule.moreTeacher"
                                    values={{
                                        value: remainingTeachers,
                                    }}
                                />
                            </Typography>
                        </Box>
                    </> : names.slice(0, MAXIMUM_TEACHERS)
                        .map(name => (
                            <Box
                                key={name}
                                className={clsx(classes.teacherItem, classes.flexAlignCenter)}
                            >
                                {UserAvatarComponent(name)}
                                <Typography className={clsx(classes.teacherName, classes.fontWeightBold)}>
                                    {teacherNameEllipsis(name)}
                                </Typography>
                            </Box>
                        ))}
            </Box>
        );
    };

    return (
        <Box className={clsx(classes.container, classes.flexColumn)}>
            <Box className={classes.titleWrapper}>
                <Typography className={clsx(classes.textColorGrey, classes.fontWeightBold, classes.titleSize)}>
                    {title.length > MAX_LENGTH_OF_TITLE ? `${title.slice(0, MAX_LENGTH_OF_TITLE)}...` : title}
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
                    {teachersContainer()}
                </Box>
            </Box>
            <Box className={classes.bottom}>
                <Button
                    disableElevation
                    className={classes.seeDetailsButton}
                    onClick={onDetailClick}
                >
                    <img
                        alt="detail"
                        src={SeeDetails}
                    />
                    <Typography className={clsx(classes.seeDetailsText, classes.fontWeightMedium)}>
                        <FormattedMessage
                            id="schedule.seeDetails"
                            defaultMessage="See Details"
                        />
                    </Typography>
                </Button>
                <ScheduleJoiningButton
                    variant={classType}
                    disabled={isDisabled}
                    endIcon={
                        <img
                            alt="arrow"
                            src={ScheduleButtonArrow}
                            className={classes.scheduleButtonIcon}
                        />}
                    title={actionTitle}
                    onClick={onClick}
                />
            </Box>
        </Box>
    );
}
