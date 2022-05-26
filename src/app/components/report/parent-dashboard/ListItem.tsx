import { ReportType, AchivementStatus, LearningOutcomeStatus } from "@/app/components/report/share";
import ForwardIcon from "@/assets/img/parent-dashboard/forward_arrow.svg";
import {
    BACKGROUND_PROCESS_GREY,
    BODY_TEXT,
    COLOR_CONTENT_TEXT,
} from "@/config";
import {
    GetLearningOutComesResponse,
    ReportAssignment,
    ReportLiveClass,
} from "@kl-engineering/cms-api-client";
import {
    Box,
    createStyles,
    Divider,
    LinearProgress,
    ListItem,
    ListItemText,
    makeStyles,
    Typography,
} from "@material-ui/core";
import React,
{
    useEffect,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";

const useStyles = ({ color }: StyleProps) => makeStyles((theme) => createStyles({
    root: {
        width: `auto`,
        margin: theme.spacing(2),
        padding: theme.spacing(2, 0, 0),
        borderRadius: theme.spacing(1.25),
        backgroundColor: theme.palette.background.paper,
        "&:hover": {
            background: theme.palette.background.paper,
        },
    },
    listItem: {
        padding: theme.spacing(1.25, 2.5),
    },
    title: {
        color: BODY_TEXT,
        padding: theme.spacing(0, 2.5),
        fontWeight: theme.typography.fontWeightRegular as number,
    },
    listItemText: {
        color,
        fontSize: `1rem`,
        fontWeight: theme.typography.fontWeightMedium as number,
    },
    viewText: {
        color: BODY_TEXT,
        fontWeight: theme.typography.fontWeightMedium as number,
    },
    emptyText: {
        color: COLOR_CONTENT_TEXT,
        padding: theme.spacing(0.5, 1.5),
        fontWeight: theme.typography.fontWeightRegular as number,
    },
    linear: {
        flex: `auto`,
        margin: theme.spacing(0, 1.25),
        height: theme.spacing(1.25),
    },
    linearProcess: {
        height: theme.spacing(1.25),
        borderRadius: theme.spacing(1.25),
        backgroundColor: BACKGROUND_PROCESS_GREY,
    },
    linearBarColorPrimary: {
        backgroundColor: color,
    },
}));

export interface Props {
    title: string;
    viewText: string;
    emptyText: string;
    icon: string;
    type: ReportType;
    color: string;
    data: ReportLiveClass[] | ReportAssignment[] | GetLearningOutComesResponse[];
    onRedirect?: () => void;
}

interface StyleProps {
    color: string;
}

export default function ParentDashboardListItem(props: Props) {
    const {
        title,
        viewText,
        emptyText,
        type,
        icon,
        color,
        data,
        onRedirect,
    } = props;
    const styleProps: StyleProps = {
        color,
    };
    const ICON_SIZE = 40;
    const classes = useStyles(styleProps)();
    const initAchivementStatus = {
        achieved: 0,
        total: 0,
    }
    const [achivementStatus, setAchivementStatus] = useState<AchivementStatus>(initAchivementStatus);

    useEffect(() => {
        if (!data || !data.length) {
            setAchivementStatus(initAchivementStatus);
            return;
        };
        let currentData: GetLearningOutComesResponse[] | ReportAssignment[] | ReportLiveClass[] = [];
        switch (type) {
            case ReportType.LIVE_CLASS:
                break;
            case ReportType.STUDY_ASSESSMENTS:
                break;
            case ReportType.LEARNING_OUTCOMES:
                currentData = data as GetLearningOutComesResponse[];
                setAchivementStatus({
                    total: currentData.length,
                    achieved: currentData.filter(learningOutcome => learningOutcome.status === LearningOutcomeStatus.ACHIEVED).length,
                });
                break;
        }
    }, [ data ]);

    return (
        <Box className={classes.root}>
            <Typography
                className={classes.title}
                variant="body2"
            >
                <FormattedMessage
                    id={title}
                />
            </Typography>
            {data && data.length ? (
                <ListItem disableGutters className={classes.listItem}>
                    <img
                        alt="dashboard icon"
                        src={icon}
                        width={ICON_SIZE}
                        height={ICON_SIZE}
                    />
                    <div className={classes.linear}>
                        <LinearProgress
                            classes={{
                                colorPrimary: classes.linearProcess,
                                barColorPrimary: classes.linearBarColorPrimary,
                            }}
                            variant="determinate"
                            value={achivementStatus.achieved / achivementStatus.total * 100}
                        />
                    </div>
                    <Typography
                        className={classes.listItemText}
                    > {achivementStatus.achieved} / {achivementStatus.total}
                    </Typography>
                </ListItem>
            ) : (
                <ListItemText
                    disableTypography
                    className={classes.listItem}
                    primary={
                        <Typography
                            className={classes.emptyText}
                            variant="body2"
                        >
                            <FormattedMessage
                                id={emptyText}
                            />
                        </Typography>
                    } />
            )}
            <Divider />
            <ListItem
                disableGutters
                className={classes.listItem}
                onClick={onRedirect}
            >
                <ListItemText
                    disableTypography
                    primary={
                        <Typography
                            className={classes.viewText}
                            variant="subtitle1"
                        >
                            <FormattedMessage
                                id={viewText}
                            />
                        </Typography>}
                />
                <img
                    alt="forward icon"
                    src={ForwardIcon}
                />
            </ListItem>
        </Box>
    );
}
