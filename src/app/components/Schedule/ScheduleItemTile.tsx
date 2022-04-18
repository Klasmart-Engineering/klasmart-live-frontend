import GroupUserAvatar from "./GroupUserAvatar";
import JoinRoomTabletImg from "@/assets/img/join_room_study_tablet.png";
import HomeFunJoinArrow from "@/assets/img/schedule-icon/home_fun_join_arrow.svg";
import HomeFunIconDialog from "@/assets/img/schedule-icon/home_fun_type_schedule_dialog.svg";
import LiveJoinArrow from "@/assets/img/schedule-icon/live_join_arrow.svg";
import LiveIconDialog from "@/assets/img/schedule-icon/live_type_schedule_dialog.svg";
import StudyJoinArrow from "@/assets/img/schedule-icon/study_join_arrow.svg";
import StudyIconDialog from "@/assets/img/schedule-icon/study_type_schedule_dialog.svg";
import {
    THEME_COLOR_BACKGROUND_PAPER,
    THEME_COLOR_BLUE_CLASS_TYPE_SCHEDULE_DIALOG,
    THEME_COLOR_GREEN_BUTTON_SCHEDULE_DIALOG,
    THEME_COLOR_HOME_FUN_SCHEDULE_CARD,
    THEME_COLOR_HOME_FUN_SCHEDULE_ICON_BACKGROUND,
    THEME_COLOR_LIVE_SCHEDULE_CARD,
    THEME_COLOR_LIVE_SCHEDULE_ICON_BACKGROUND,
    THEME_COLOR_PINK_BUTTON_SCHEDULE_DIALOG,
    THEME_COLOR_STUDY_SCHEDULE_CARD,
    THEME_COLOR_STUDY_SCHEDULE_ICON_BACKGROUND,
} from "@/config";
import {
    Box,
    Chip,
    createStyles,
    Grid,
    makeStyles,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { MoreHoriz } from "styled-icons/material";
import { SECONDS_BEFORE_CLASS_CAN_START } from "./Live/Dialog/Details";
import { fromSecondsToMilliseconds } from "@/utils/utils";
import { useIntl } from "react-intl";
import { formatStartEndTimeMillis } from "@/app/utils/dateTimeUtils";
import { useSelectedOrganizationValue } from "@/app/data/user/atom";
import { useGetScheduleById } from "@kl-engineering/cms-api-client";
import ScheduleJoinButton from "./ScheduleJoinButton";
import { ClassType } from "@/store/actions";

const useStyles = makeStyles((theme) => createStyles({
    container: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.spacing(2.5),
        marginBottom: theme.spacing(1.5),
        padding: theme.spacing(1.5),
        position: `relative`,
    },
    contentContainer: {
        paddingLeft: theme.spacing(1.5),
        [theme.breakpoints.up(`sm`)]: {
            paddingLeft: theme.spacing(2),
        },
    },
    thumbnailContainer: {
        marginTop: theme.spacing(1.5),
        [theme.breakpoints.up(`sm`)]: {
            paddingLeft: theme.spacing(2),
            paddingBottom: theme.spacing(1),
        },
    },
    thumbnail: {
        height: `auto`,
        width: `100%`,
        maxWidth: 100,
        display: `block`,
        borderRadius: theme.spacing(1.5),
        [theme.breakpoints.up(`sm`)]: {
            maxWidth: 170,
        },
    },
    classTypeChip: {
        paddingLeft: theme.spacing(0.75),
        color: theme.palette.background.paper,
        backgroundColor: THEME_COLOR_BLUE_CLASS_TYPE_SCHEDULE_DIALOG,
        fontWeight: theme.typography.fontWeightBold as number,
    },
    imageChip: {
        filter: `brightness(0) invert(1)`,
        height: 12,
        width: 12,
    },
    dateTime: {
        paddingLeft: theme.spacing(1),
        textOverflow: `ellipsis`,
        overflow: `hidden`,
        overflowWrap: `anywhere`,
        display: `-webkit-box`,
        WebkitBoxOrient: `vertical`,
        WebkitLineClamp: 1,
    },
    title: {
        textOverflow: `ellipsis`,
        overflow: `hidden`,
        overflowWrap: `anywhere`,
        marginRight: theme.spacing(1),
        paddingTop: theme.spacing(0.5),
        display: `-webkit-box`,
        WebkitBoxOrient: `vertical`,
        WebkitLineClamp: 2,
        fontWeight: theme.typography.fontWeightBold as number,
    },
    actionButtonContainer: {
        [theme.breakpoints.up(`sm`)]: {
            bottom: theme.spacing(1),
            justifyContent: `space-between`,
        },
    },
    actionEndIcon: {
        position: `absolute`,
        right: theme.spacing(0.5),
        top: `50%`,
        transform: `translateY(-50%)`,
    },
    fullHeight: {
        height: `100%`,
    },
}));

export interface Props {
    scheduleId: string;
    classType: string;
    title: string;
    actionTitle: string;
    start_at?: number;
    end_at?: number;
    onDetailClick?: () => void;
    onClick?: () => void;
}

export default function ScheduleItemTile(props: Props) {
    const {
        scheduleId,
        classType,
        title,
        actionTitle,
        start_at,
        end_at,
        onDetailClick,
        onClick,
    } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isSmUp = useMediaQuery(theme.breakpoints.up(`sm`));
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

    useEffect(() => {
        if (!start_at) return;
        const nowInSeconds = new Date().getTime() / 1000;
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

    useEffect(() => {
      if (!scheduleData) return;
      const teacherNames: string[] = [];
      scheduleData.teachers.forEach((item) => teacherNames.push(item.name));
      setNames(teacherNames);
    }, [scheduleData]);

    const getClassTypeProperty = () => {
        switch (classType) {
        case ClassType.LIVE:
            return {
                title: intl.formatMessage({
                    id: `schedule_liveTab`,
                    defaultMessage: `Live`,
                }),
                icon: LiveIconDialog,
                iconBackground: THEME_COLOR_LIVE_SCHEDULE_ICON_BACKGROUND,
                backgroundCard: THEME_COLOR_BLUE_CLASS_TYPE_SCHEDULE_DIALOG,
                actionButtonBackground: THEME_COLOR_PINK_BUTTON_SCHEDULE_DIALOG,
                actionButtonEndIcon: LiveJoinArrow,
            };
        case ClassType.STUDY:
            return {
                title: intl.formatMessage({
                    id: `schedule_studyTab`,
                    defaultMessage: `Study`,
                }),
                icon: StudyIconDialog,
                iconBackground: THEME_COLOR_STUDY_SCHEDULE_ICON_BACKGROUND,
                backgroundCard: THEME_COLOR_STUDY_SCHEDULE_CARD,
                actionButtonBackground: THEME_COLOR_BLUE_CLASS_TYPE_SCHEDULE_DIALOG,
                actionButtonEndIcon: StudyJoinArrow,
            };
        case ClassType.REVIEW:
            return {
                title: intl.formatMessage({
                    id: `review.title`,
                    defaultMessage: `Review`,
                }),
                icon: StudyIconDialog,
                iconBackground: THEME_COLOR_STUDY_SCHEDULE_ICON_BACKGROUND,
                backgroundCard: THEME_COLOR_STUDY_SCHEDULE_CARD,
                actionButtonBackground: THEME_COLOR_BLUE_CLASS_TYPE_SCHEDULE_DIALOG,
                actionButtonEndIcon: StudyJoinArrow,
            };
        case ClassType.HOME_FUN_STUDY:
            return {
                title: `Home Fun`,
                icon: HomeFunIconDialog,
                iconBackground: THEME_COLOR_HOME_FUN_SCHEDULE_ICON_BACKGROUND,
                backgroundCard: THEME_COLOR_HOME_FUN_SCHEDULE_CARD,
                actionButtonBackground: THEME_COLOR_GREEN_BUTTON_SCHEDULE_DIALOG,
                actionButtonEndIcon: HomeFunJoinArrow,
            };
        default:
            return {
                title: intl.formatMessage({
                    id: `schedule_liveTab`,
                    defaultMessage: `Live`,
                }),
                icon: LiveIconDialog,
                iconBackground: THEME_COLOR_LIVE_SCHEDULE_ICON_BACKGROUND,
                backgroundCard: THEME_COLOR_BLUE_CLASS_TYPE_SCHEDULE_DIALOG,
                actionButtonBackground: THEME_COLOR_PINK_BUTTON_SCHEDULE_DIALOG,
                actionButtonEndIcon: LiveJoinArrow,
            };
        }
    };

    useEffect(() => {
        setActive(timeBeforeClassSeconds > SECONDS_BEFORE_CLASS_CAN_START && classType === ClassType.LIVE);
    }, [timeBeforeClassSeconds]);

    return (
        <Box 
            className={classes.container}
            style={{
                backgroundColor: isDisable ? THEME_COLOR_BACKGROUND_PAPER : getClassTypeProperty().backgroundCard,
            }}
            onClick={isDisable ? undefined : onClick}
        >
            <Grid container>
                {isSmUp && (
                    <Grid item>
                        <img
                            alt={`AvatarJoinRoom`}
                            src={JoinRoomTabletImg}
                            className={classes.thumbnail}
                        />
                    </Grid>
                )}
                <Grid item xs>
                    <Grid 
                        className={classes.fullHeight}
                        container
                        justifyContent="space-between"
                    >
                        <Grid 
                            container 
                        >
                            {!isSmUp && (
                                <Grid item>
                                    <img
                                        alt={`AvatarJoinRoom`}
                                        src={JoinRoomTabletImg}
                                        className={classes.thumbnail}
                                    />
                                </Grid>
                            )}
                            <Grid 
                                item 
                                xs
                                className={classes.contentContainer}
                            >
                                <Grid
                                    container
                                    justifyContent="space-between"
                                    alignItems="flex-start"
                                    wrap="nowrap"
                                >
                                    <Grid 
                                        container 
                                        alignItems="center"
                                    >
                                        <Grid
                                            item
                                        >
                                            <Chip
                                                className={classes.classTypeChip}
                                                size="small"
                                                style={{
                                                    backgroundColor: isDisable ? THEME_COLOR_BLUE_CLASS_TYPE_SCHEDULE_DIALOG : getClassTypeProperty().iconBackground,
                                                }}
                                                label={getClassTypeProperty().title}
                                                icon={<img
                                                    alt={getClassTypeProperty().icon}
                                                    src={getClassTypeProperty().icon}
                                                    className={classes.imageChip} />
                                                }
                                            />
                                        </Grid>
                                        {start_at && end_at && classType === ClassType.LIVE ? (
                                            <Grid
                                                item
                                                xs={7}
                                                className={classes.dateTime}
                                            >
                                                <Typography style={{
                                                    color: isDisable ? THEME_COLOR_LIVE_SCHEDULE_CARD : THEME_COLOR_BACKGROUND_PAPER,
                                                }}
                                                    variant={`subtitle1`}
                                                >
                                                    {formatStartEndTimeMillis(fromSecondsToMilliseconds(start_at), fromSecondsToMilliseconds(end_at), intl)}
                                                </Typography>
                                            </Grid>) : null}
                                    </Grid>
                                    <Grid
                                        item
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            onDetailClick && onDetailClick();
                                        }}
                                    >
                                        <MoreHoriz
                                            height={isSmUp ? 30 : 20}
                                            style={{
                                                color: isDisable ? THEME_COLOR_LIVE_SCHEDULE_CARD : THEME_COLOR_BACKGROUND_PAPER,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs>
                                    <Typography
                                        variant={`h4`}
                                        className={classes.title}
                                        style={{
                                            color: isDisable ? THEME_COLOR_LIVE_SCHEDULE_CARD : THEME_COLOR_BACKGROUND_PAPER,
                                        }}
                                    >
                                        {title}
                                    </Typography> 
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid 
                            container
                            alignItems="center"
                            className={classes.thumbnailContainer}
                        >
                            <Grid 
                                item 
                                xs 
                            >
                                {
                                    scheduleData?.teachers && <GroupUserAvatar
                                        names={names}
                                        maxDisplay={2}
                                    />
                                }
                            </Grid>
                            <Grid item>
                                <ScheduleJoinButton
                                    title={actionTitle}
                                    backgroundColor={getClassTypeProperty().actionButtonBackground}
                                    endIcon={
                                        <img
                                            alt={getClassTypeProperty().actionButtonEndIcon}
                                            src={getClassTypeProperty().actionButtonEndIcon}
                                            height={32}
                                            className={classes.actionEndIcon}
                                        />
                                    }
                                    width={classType === ClassType.LIVE ? 150 : 200}
                                    disabled={isDisable}
                                    onClick={onClick}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}
