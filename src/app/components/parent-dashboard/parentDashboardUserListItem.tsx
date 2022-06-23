import { ReadUserDto } from "@/app/data/user/dto/readUserDto";
import HomeFunIcon from "@/assets/img/parent-dashboard/parent_dashboard_hfs_icon.svg";
import LiveIcon from "@/assets/img/parent-dashboard/parent_dashboard_live_icon.svg";
import ReportsIcon from "@/assets/img/parent-dashboard/parent_dashboard_reports_icon.svg";
import StudyIcon from "@/assets/img/parent-dashboard/parent_dashboard_study_icon.svg";
import {
    THEME_COLOR_BACKGROUND_PAPER,
    THEME_COLOR_ICON_DISABLED,
    THEME_COLOR_LIGHT_BLACK_TEXT,
    THEME_COLOR_ORG_MENU_DRAWER,
    THEME_COLOR_PARENT_DASHBOARD_REPORT_TEXT,
} from "@/config";
import { ClassType } from "@/store/actions";
import { UserAvatar } from "@kl-engineering/kidsloop-px";
import {
    Box,
    Grid,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React,
{ useMemo } from "react";
import {
    FormattedMessage,
} from "react-intl";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: THEME_COLOR_BACKGROUND_PAPER,
        borderRadius: theme.spacing(2),
        padding: theme.spacing(2),
        margin: theme.spacing(1, 0),
        lineHeight: 0,
    },
    name: {
        paddingLeft: theme.spacing(1),
        color: THEME_COLOR_LIGHT_BLACK_TEXT,
        fontWeight: theme.typography.fontWeightMedium as number,
    },
    scheduleSection: {
        padding: theme.spacing(2.5, 4),
    },
    iconSchedule: {
        width: `100%`,
        textAlign: `center`,
    },
    textSchedule: {
        color: THEME_COLOR_ICON_DISABLED,
        fontWeight: theme.typography.fontWeightMedium as number,
    },
    reportContainer: {
        border: `1px solid ${THEME_COLOR_ORG_MENU_DRAWER}`,
        borderRadius: theme.spacing(1.5),
        padding: theme.spacing(1.5, 0),
    },
    reportText: {
        color: THEME_COLOR_PARENT_DASHBOARD_REPORT_TEXT,
        paddingLeft: theme.spacing(0.75),
        fontWeight: theme.typography.fontWeightMedium as number,
    },
}));

interface Props {
    user: ReadUserDto;
    onSelectClassType: (user: ReadUserDto, classType: ClassType) => void;
}

export const ParentDashboardUserListItem: React.FC<Props> = ({ user, onSelectClassType }) => {
    const classes = useStyles();

    const displayName = useMemo(() => {
        if (user.given_name && user.family_name) {
            // TODO: Localize full name ordering
            // e.g.
            // - EU: <givenName> <familyName>
            // - KR: <familyName> <givenName>
            return `${user.given_name} ${user.family_name}`;
        }
        return user.username;
    }, [ user ]);

    const classTypes = [
        {
            classType: ClassType.LIVE,
            img: LiveIcon,
            message: `schedule_liveTab`,
        },
        {
            classType: ClassType.STUDY,
            img: StudyIcon,
            message: `schedule_studyTab`,
        },
        {
            classType: ClassType.HOME_FUN_STUDY,
            img: HomeFunIcon,
            message: `schedule.homeFun`,
        },
    ];

    return (
        <Box className={classes.root}>
            <Grid
                container
                alignItems="center"
                wrap="nowrap"
            >
                <Grid item>
                    <UserAvatar name={displayName ?? ``} />
                </Grid>
                <Grid
                    item
                >
                    <Typography
                        variant="h6"
                        className={classes.name}
                    >
                        {displayName}
                    </Typography>
                </Grid>
            </Grid>

            <Grid
                container
                className={classes.scheduleSection}
                justifyContent="space-between"
                alignItems="center"
                wrap="nowrap"
            >
                {classTypes.map((classTypeObject) => (
                    <Grid
                        key={classTypeObject.classType}
                        item
                        onClick={() => onSelectClassType(user, classTypeObject.classType)}
                    >
                        <Box
                            alignItems="center"
                            justifyContent="center"
                        >
                            <div className={classes.iconSchedule}>
                                <img
                                    alt={classTypeObject.img}
                                    src={classTypeObject.img}
                                    height={30}
                                />
                            </div>
                            <Typography
                                variant="h6"
                                className={classes.textSchedule}
                            >
                                <FormattedMessage id={classTypeObject.message} />
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Grid
                container
                className={classes.reportContainer}
                alignItems="center"
                justifyContent="center"
                onClick={() => onSelectClassType(user, ClassType.REPORT)}
            >
                <Grid item>
                    <img
                        alt="report icon"
                        src={ReportsIcon}
                    />
                </Grid>
                <Grid item>
                    <Typography
                        variant="h6"
                        className={classes.reportText}
                    >
                        <FormattedMessage
                            id="parentDashboard.reports"
                            defaultMessage="Reports"
                        />
                    </Typography>
                </Grid>
            </Grid>

        </Box>
    );
};
