import { TopBarNavigationButton } from "../icons/topBarNavigationButton";
import { useSelectedUserValue } from "@/app/data/user/atom";
import {
    HomeFunAppBarItem,
    useHomeFunTopBar,
} from "@/app/model/HomeFunModel";
import {
    StudyTopBarItem,
    useStudyTopBar,
} from "@/app/model/StudyModel";
import HomeFunIcon from "@/assets/img/schedule-icon/home-fun-icon-mobile.svg";
import LiveIcon from "@/assets/img/schedule-icon/live-icon-mobile.svg";
import ParentsDashboard from "@/assets/img/schedule-icon/parents-dashboard-mobile.svg";
import ScheduleBackButton from "@/assets/img/schedule-icon/schedule-back-button-mobile.svg";
import StudyIcon from "@/assets/img/schedule-icon/study-icon-mobile.svg";
import {
    SCHEDULE_BLACK_TEXT,
    SCHEDULE_CARD_BACKGROUND_CONTAINER,
    THEME_COLOR_BACKGROUND_PAPER,
    THEME_COLOR_LIGHT_BLACK_TEXT,
} from "@/config";
import { ClassType } from "@/store/actions";
import { UserAvatar } from "@kl-engineering/kidsloop-px";
import {
    AppBar,
    Box,
    createStyles,
    makeStyles,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";

const BACK_BUTTON_WIDTH_MEDIUM = 11.6;
const BACK_BUTTON_HEIGHT_MEDIUM = 23;
const CENTER_ICON_WIDTH_MEDIUM = 32;
const PARENTS_DASHBOARD_WIDTH_MEDIUM = 42;

const useStyles = makeStyles((theme) => createStyles({
    root: {
        display: `flex`,
        backgroundColor: SCHEDULE_CARD_BACKGROUND_CONTAINER,
        justifyContent: `space-between`,
        alignItems: `center`,
        padding: theme.spacing(2, 3, 0, 3),
        [theme.breakpoints.up(`md`)]: {
            padding: theme.spacing(2.5, 3.75, 0, 3.75),
        },
    },
    centerWrapper: {
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,

    },
    trailing: {
        display: `flex`,
        justifyContent: `space-between`,
    },
    flexEnd: {
        justifyContent: `flex-end`,
    },
    heading: {
        display: `flex`,
        justifyContent: `flex-start`,
        alignItems: `center`,
    },
    fixedWidth: {
        width: `30%`,
    },
    currentUser: {
        display: `flex`,
        padding: theme.spacing(0.5, 2, 0.5, 0.5),
        marginLeft: theme.spacing(2),
        alignItems: `center`,
        backgroundColor: THEME_COLOR_BACKGROUND_PAPER,
        borderRadius: theme.spacing(2),
        [theme.breakpoints.up(`md`)]: {
            borderRadius: theme.spacing(3),
        },
    },
    selectedUserName: {
        paddingLeft: theme.spacing(0.5),
        fontSize: `0.9rem`,
        fontWeight: theme.typography.fontWeightBold as number,
        color: THEME_COLOR_LIGHT_BLACK_TEXT,
        [theme.breakpoints.up(`md`)]: {
            fontSize: `1.2rem`,
            paddingLeft: theme.spacing(0.8),
        },
    },
    title: {
        fontSize: `1.3rem`,
        fontWeight: theme.typography.fontWeightBold as number,
        color: SCHEDULE_BLACK_TEXT,
        marginLeft: theme.spacing(0.8),
        [theme.breakpoints.up(`md`)]: {
            fontSize: `1.75rem`,
        },
    },
    tabBarWrapper: {
        display: `flex`,
        justifyContent: `space-around`,
        backgroundColor: SCHEDULE_CARD_BACKGROUND_CONTAINER,
        [theme.breakpoints.up(`md`)]: {
            fontSize: `1.2rem`,
            marginLeft: theme.spacing(-2),
        },
    },
    backButton: {
        [theme.breakpoints.up(`md`)]: {
            width: BACK_BUTTON_WIDTH_MEDIUM,
            height: BACK_BUTTON_HEIGHT_MEDIUM,
        },
    },
    centerIcon: {
        [theme.breakpoints.up(`md`)]: {
            width: CENTER_ICON_WIDTH_MEDIUM,
            height: CENTER_ICON_WIDTH_MEDIUM,
        },
    },
    parentsDashboardIcon: {
        [theme.breakpoints.up(`md`)]: {
            width: PARENTS_DASHBOARD_WIDTH_MEDIUM,
            height: PARENTS_DASHBOARD_WIDTH_MEDIUM,
        },
    },
}));

interface Props {
  classType: string;
}

export default function ScheduleTopBar (props: Props) {
    const { classType } = props;
    const classes = useStyles();
    const intl = useIntl();
    const history = useHistory();
    const selectedUser = useSelectedUserValue();
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up(`md`));

    const [ studySelectedItem, setStudySelectedItem ] = useStudyTopBar();
    const [ hfsSelectedItem, setHfsSelectedItem ] = useHomeFunTopBar();

    const tabBarNavigation = () => {
        if(classType === ClassType.STUDY)
        {
            return (
                <Box className={classes.tabBarWrapper}>
                    <TopBarNavigationButton
                        isMarginRight
                        title={`schedule.study.title`}
                        active={studySelectedItem === StudyTopBarItem.STUDY}
                        type={ClassType.STUDY}
                        onClick={() => setStudySelectedItem(StudyTopBarItem.STUDY)}
                    />
                    <TopBarNavigationButton
                        title={`schedule.tab.anytime`}
                        active={studySelectedItem === StudyTopBarItem.ANYTIME}
                        type={ClassType.STUDY}
                        onClick={()=> setStudySelectedItem(StudyTopBarItem.ANYTIME)}
                    />
                </Box>
            );
        }
        else if(classType === ClassType.HOME_FUN_STUDY)
        {
            return (
                <Box className={classes.tabBarWrapper}>
                    <TopBarNavigationButton
                        isButtonHFS
                        title={`Home activity`}
                        active={hfsSelectedItem === HomeFunAppBarItem.HOME_ACTIVITY}
                        type={ClassType.HOME_FUN_STUDY}
                        onClick={() => setHfsSelectedItem(HomeFunAppBarItem.HOME_ACTIVITY)}
                    />
                    <TopBarNavigationButton
                        isButtonHFS
                        title={`schedule.tab.anytime`}
                        active={hfsSelectedItem === HomeFunAppBarItem.ANYTIME}
                        type={ClassType.HOME_FUN_STUDY}
                        onClick={() => setHfsSelectedItem(HomeFunAppBarItem.ANYTIME)}
                    />
                </Box>
            );
        }
    };

    const getClassTypeProperty = () => {
        switch (classType) {
        case ClassType.LIVE:
            return {
                centerIcon: LiveIcon,
                title: intl.formatMessage({
                    id: `schedule_liveTab`,
                    defaultMessage: `Live`,
                }),
            };
        case ClassType.STUDY:
            return {
                centerIcon: StudyIcon,
                title: intl.formatMessage({
                    id: `schedule_studyTab`,
                    defaultMessage: `Study`,
                }),
            };
        case ClassType.HOME_FUN_STUDY:
            return {
                centerIcon: HomeFunIcon,
                title: intl.formatMessage({
                    id: `schedule_studyTabc`,
                    defaultMessage: `Home Activity`,
                }),
            };
        default:
            return {
                centerIcon: LiveIcon,
                title: intl.formatMessage({
                    id: `schedule_liveTab`,
                    defaultMessage: `Live`,
                }),
            };
        }
    };

    const handleBackClick = () => {
        history.goBack();
    };

    return (
        <AppBar
            position="sticky"
            elevation={0}
        >
            <Box className={classes.root}>
                <Box className={clsx(classes.fixedWidth, classes.heading)}>
                    <img
                        alt="back button"
                        src={ScheduleBackButton}
                        className={classes.backButton}
                        onClick={handleBackClick}
                    />
                    <Box className={classes.currentUser}>
                        <UserAvatar
                            maxInitialsLength={2}
                            name={`${selectedUser?.given_name} ${selectedUser?.family_name}`}
                            size={isMdUp ? `medium` : `small`}
                        />
                        <Typography className={classes.selectedUserName}>{selectedUser?.given_name}</Typography>
                    </Box>
                </Box>
                <Box className={classes.centerWrapper}>
                    <img
                        alt="center"
                        src={getClassTypeProperty().centerIcon}
                        className={classes.centerIcon}
                    />
                    <Typography className={classes.title}>{getClassTypeProperty().title}</Typography>
                </Box>

                <Box className={clsx(classes.trailing, classes.fixedWidth, {
                    [classes.flexEnd]: classType === ClassType.LIVE,
                })}
                >
                    {tabBarNavigation()}
                    <img
                        alt="parents dashboard"
                        src={ParentsDashboard}
                        className={classes.parentsDashboardIcon}
                    />
                </Box>
            </Box>
        </AppBar>
    );
}
