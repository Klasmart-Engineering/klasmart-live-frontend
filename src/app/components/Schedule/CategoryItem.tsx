import HomeFunJoinArrow from "@/assets/img/schedule-icon/home_fun_join_arrow.svg";
import LiveJoinArrow from "@/assets/img/schedule-icon/live_join_arrow.svg";
import StudyJoinArrow from "@/assets/img/schedule-icon/study_join_arrow.svg";
import LiveImg from "@/assets/img/home/live.svg";
import StudyImg from "@/assets/img/home/study.svg";
import HomeFunImg from "@/assets/img/home/home-fun.svg";
import {
    THEME_COLOR_BACKGROUND_PAPER,
    THEME_COLOR_BLUE_CLASS_TYPE_SCHEDULE_DIALOG,
    THEME_COLOR_GREEN_BUTTON_SCHEDULE_DIALOG,
    THEME_COLOR_HOME_FUN_SCHEDULE_CARD,
    THEME_COLOR_PINK_BUTTON_SCHEDULE_DIALOG,
    THEME_COLOR_STUDY_SCHEDULE_CARD,
} from "@/config";
import {
    Box,
    createStyles,
    Grid,
    makeStyles,
    Typography,
} from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";
import ScheduleJoinButton from "./ScheduleJoinButton";
import { ClassType } from "@/store/actions";

const useStyles = makeStyles((theme) => createStyles({
    container: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.spacing(5,1.5,5,5),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(1.5),
        position: `relative`,
    },
    contentContainer: {
        paddingLeft: theme.spacing(1.5),
        paddingRight: theme.spacing(1.5),
        paddingBottom: theme.spacing(1.5),
        [theme.breakpoints.up(`sm`)]: {
            paddingLeft: theme.spacing(2),
        },
    },
    thumbnail: {
        height: `auto`,
        width: `auto`,
        maxWidth: 137,
        minHeight: 135,
        display: `block`,
        [theme.breakpoints.up(`sm`)]: {
            maxWidth: 310,
        },
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
        color: THEME_COLOR_BACKGROUND_PAPER,
        fontWeight: 900,
    },
    actionButtonContainer: {
        marginTop: theme.spacing(1.5),
    },
    actionEndIcon: {
        position: `absolute`,
        right: theme.spacing(0.5),
        top: `50%`,
        transform: `translateY(-50%)`,
    },
}));

export interface Props {
    classType: string;
    onDetailClick?: () => void;
}

export default function CategoryItem(props: Props) {
    const {
        classType,
        onDetailClick,
    } = props;
    const classes = useStyles();
    const intl = useIntl();

    const getClassTypeProperty = () => {
        switch (classType) {
        case ClassType.LIVE:
            return {
                title: intl.formatMessage({
                    id: `schedule.category.live`,
                    defaultMessage: `Live Classes`,
                }),
                icon: LiveImg,
                backgroundCard: THEME_COLOR_BLUE_CLASS_TYPE_SCHEDULE_DIALOG,
                actionButtonBackground: THEME_COLOR_PINK_BUTTON_SCHEDULE_DIALOG,
                actionButtonEndIcon: LiveJoinArrow,
                actionTitle: intl.formatMessage({
                    id: `schedule.status.joinNow`,
                    defaultMessage: `Join Now`,
                }),
            };
        case ClassType.STUDY:
            return {
                title: intl.formatMessage({
                    id: `schedule.category.study`,
                    defaultMessage: `My Study`,
                }),
                icon: StudyImg,
                backgroundCard: THEME_COLOR_STUDY_SCHEDULE_CARD,
                actionButtonBackground: THEME_COLOR_BLUE_CLASS_TYPE_SCHEDULE_DIALOG,
                actionButtonEndIcon: StudyJoinArrow,
                actionTitle: intl.formatMessage({
                    id: `study.enter.startStudying`,
                    defaultMessage: `Start Studying`,
                }),
            };
        
        default:
            return {
                title: intl.formatMessage({
                    id: `schedule_studyHomeFunStudy`,
                    defaultMessage: `Home Fun Study`,
                }),
                icon: HomeFunImg,
                backgroundCard: THEME_COLOR_HOME_FUN_SCHEDULE_CARD,
                actionButtonBackground: THEME_COLOR_GREEN_BUTTON_SCHEDULE_DIALOG,
                actionButtonEndIcon: HomeFunJoinArrow,
                actionTitle: intl.formatMessage({
                    id: `study.enter.startStudying`,
                    defaultMessage: `Start Studying`,
                }),
            };
        }
    };

    return (
        <Box 
            className={classes.container}
            style={{
                backgroundColor: getClassTypeProperty().backgroundCard,
            }}
            onClick={onDetailClick}
        >
             <Box className={classes.contentContainer}>
                <Typography
                    variant={`h4`}
                    className={classes.title}
                >
                    {getClassTypeProperty().title}
                </Typography> 
                <Grid
                    container
                    justifyContent="space-between"
                    wrap="nowrap"
                >
                    <Grid item className={classes.actionButtonContainer}>
                        <ScheduleJoinButton
                            title={getClassTypeProperty().actionTitle}
                            backgroundColor={getClassTypeProperty().actionButtonBackground}
                            endIcon={
                                <img
                                    alt={getClassTypeProperty().actionButtonEndIcon}
                                    src={getClassTypeProperty().actionButtonEndIcon}
                                    height={32}
                                    className={classes.actionEndIcon}
                                />
                            }
                            minHeight={38}
                            spacing={2.5}
                            onClick={onDetailClick}
                        />
                    </Grid>
                    <Grid item>
                        <img
                            alt={getClassTypeProperty().title + ` icon`}
                            src={getClassTypeProperty().icon}
                            className={classes.thumbnail}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
