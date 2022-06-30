import CategoryItem from "./CategoryItem";
import HomeFunImg from "@/assets/img/home/home-fun.svg";
import LiveImg from "@/assets/img/home/live.svg";
import StudyImg from "@/assets/img/home/study.svg";
import {
    SCHEDULE_HOME_FUN_BACKGROUND_COLOR,
    SCHEDULE_LIVE_BACKGROUND_COLOR,
    SCHEDULE_STUDY_BACKGROUND_COLOR,
} from "@/config";
import { ClassType } from "@/store/actions";
import {
    createStyles,
    Grid,
    makeStyles,
} from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => createStyles({
    fullHeight: {
        height: `100%`,
    },
    root: {
        padding: theme.spacing(4, 5, 5),
        height: `100%`,
        [theme.breakpoints.up(`md`)]: {
            padding: theme.spacing(15, 6.25, 23),
        },
    },
}));

export default function CategoryList () {
    const classes = useStyles();
    const history = useHistory();
    const intl = useIntl();
    const handleDetailOpen = (classType?: ClassType) => {
        switch (classType) {
        case ClassType.LIVE:
            history.push(`/schedule/category-live`);
            break;
        default:
            history.push(`/schedule/category-study/${classType}`);
            break;
        }
    };

    const classTypes = [
        {
            title: intl.formatMessage({
                id: `parentDashboard.live`,
                defaultMessage: `Live`,
            }),
            description: intl.formatMessage({
                id: `schedule.status.joinNow`,
                defaultMessage: `Online Study`,
            }),
            image: LiveImg,
            classType: ClassType.LIVE,
            backgroundColor: SCHEDULE_LIVE_BACKGROUND_COLOR,
        },
        {
            title: intl.formatMessage({
                id: `parentDashboard.study`,
                defaultMessage: `Study`,
            }),
            description: intl.formatMessage({
                id: `schedule.study.description`,
                defaultMessage: `Interactive Content`,
            }),
            image: StudyImg,
            classType: ClassType.STUDY,
            backgroundColor: SCHEDULE_STUDY_BACKGROUND_COLOR,
        },
        {
            title: intl.formatMessage({
                id: `schedule.home_activity`,
                defaultMessage: `Home Activity`,
            }),
            description: intl.formatMessage({
                id: `schedule.homefun.description`,
                defaultMessage: `Submit Assignments`,
            }),
            image: HomeFunImg,
            classType: ClassType.HOME_FUN_STUDY,
            backgroundColor: SCHEDULE_HOME_FUN_BACKGROUND_COLOR,
        },
    ];

    return (
        <Grid
            container
            alignItems="center"
            spacing={4}
            className={classes.root}
        >
            {classTypes.map((item) => (
                <Grid
                    key={item.classType}
                    item
                    xs={4}
                    className={classes.fullHeight}
                >
                    <CategoryItem
                        title={item.title}
                        description={item.description}
                        backgroundColor={item.backgroundColor}
                        image={item.image}
                        onClick={() => handleDetailOpen(item.classType)}
                    />
                </Grid>
            ))}
        </Grid>
    );
}
