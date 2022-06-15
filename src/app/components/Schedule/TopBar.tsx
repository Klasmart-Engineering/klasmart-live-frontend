import { useSelectedUserValue } from "@/app/data/user/atom";
import LiveIconMobile from "@/assets/img/schedule-icon/live-icon-mobile.svg";
import LiveIconTablet from "@/assets/img/schedule-icon/live-icon-tablet.svg";
import ParentsDashboardMobile from "@/assets/img/schedule-icon/parents-dashboard-mobile.svg";
import ParentsDashboardTablet from "@/assets/img/schedule-icon/parents-dashboard-tablet.svg";
import ScheduleBackButtonMobile from "@/assets/img/schedule-icon/schedule-back-button-mobile.svg";
import ScheduleBackButtonTablet from "@/assets/img/schedule-icon/schedule-back-button-tablet.svg";
import StudyIcon from "@/assets/img/schedule-icon/study-icon.svg";
import {
    SCHEDULE_CARD_BACKGROUND_CONTAINER,
    SCHEDULE_TOPBAR_CURRENT_USER,
    SCHEDULE_TOPBAR_TITLE,
    THEME_COLOR_BACKGROUND_PAPER,
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
import React from "react";
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        display: `flex`,
        backgroundColor: SCHEDULE_CARD_BACKGROUND_CONTAINER,
        justifyContent: `space-between`,
        alignItems: `center`,
        padding: theme.spacing(2, 3, 0, 3),
    },
    centerWrapper: {
        display: `flex`,
        alignItems: `center`,
    },
    leading: {
        display: `flex`,
    },
    trailing: {
        marginLeft: theme.spacing(9),
        [theme.breakpoints.up(`md`)]: {
            marginLeft: theme.spacing(13),
        },
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
        color: SCHEDULE_TOPBAR_CURRENT_USER,
        [theme.breakpoints.up(`md`)]: {
            fontSize: `1.2rem`,
            paddingLeft: theme.spacing(0.8),
        },
    },
    title: {
        fontSize: `1.3rem`,
        fontWeight: theme.typography.fontWeightBold as number,
        color: SCHEDULE_TOPBAR_TITLE,
        marginLeft: theme.spacing(0.8),
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

    const getClassTypeProperty = () => {
        switch (classType) {
        case ClassType.LIVE:
            return {
                centerIcon: isMdUp ? LiveIconTablet : LiveIconMobile,
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
        default:
            return {
                centerIcon: LiveIconMobile,
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
                <Box className={classes.leading}>
                    <img
                        alt="back button"
                        src={isMdUp ? ScheduleBackButtonTablet : ScheduleBackButtonMobile}
                        onClick={handleBackClick}
                    />
                    <Box className={classes.currentUser}>
                        <UserAvatar
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
                    />
                    <Typography className={classes.title}>{getClassTypeProperty().title}</Typography>
                </Box>
                <Box className={classes.trailing}>
                    <img
                        alt="parents dashboard"
                        src={isMdUp ? ParentsDashboardTablet : ParentsDashboardMobile}
                    />
                </Box>
            </Box>
        </AppBar>
    );
}
