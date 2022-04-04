import ForwardIcon from "@/assets//img/parent-dashboard/forward_arrow.svg";
import {
    BACKGROUND_PROCESS_GREY,
    BODY_TEXT,
    LEARNING_OUTCOMES_COLOR,
    LIVE_COLOR,
    STUDY_COLOR,
} from "@/config";
import {
    Avatar,
    Box,
    createStyles,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    Typography,
} from "@material-ui/core";
import LinearProgress,
{ linearProgressClasses } from "@mui/material/LinearProgress";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    boxRoot: {
        width: `auto`,
        margin: theme.spacing(2),
        marginBottom: theme.spacing(3),
        borderRadius: 10,
        backgroundColor: theme.palette.background.paper,
        "&:last-child":{
            marginBottom: theme.spacing(1),
        },
        "&:hover": {
            background: theme.palette.background.paper,
        },
    },
    list: {
        padding: `10px 20px 0 20px`,
    },
    listAssesment: {
        paddingBottom: `10px`,
    },
    listItem: {
        padding: `5px 0 5px`,
    },
    title: {
        fontWeight: theme.typography.fontWeightRegular as number,
        color: BODY_TEXT,
    },
    linear: {
        marginLeft: theme.spacing(1),
        flex: `auto`,
        height: 10,
    },
    listItemText: {
        marginLeft: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium as number,
        fontSize: `1rem`,
    },
    lisItemTextBottom: {
        fontWeight: theme.typography.fontWeightMedium as number,
        color: BODY_TEXT,
    },
    linearProcess: {
        [`&.${linearProgressClasses.colorPrimary}`]: {
            borderRadius: 5,
            backgroundColor: BACKGROUND_PROCESS_GREY,
        },
    },
    linearStudy: {
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: STUDY_COLOR,
        },
    },
    linearLiveClass: {
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: LIVE_COLOR,
        },
    },
    linearLearningOutcomes: {
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: LEARNING_OUTCOMES_COLOR,
        },
    },
    statusText: {
        fontWeight: theme.typography.fontWeightMedium as number,
        minInlineSize: `min-content`,
    },
    statusStudyText: {
        color: STUDY_COLOR,
    },
    statusLiveText: {
        color: LIVE_COLOR,
    },
    statusLearningOutcomes: {
        color: LEARNING_OUTCOMES_COLOR,
    },
}));

export interface Props {
  title: string;
  status: string;
  assessment: string;
  icon: string;
  isLiveClassAt: boolean;
  isStudyAssessments: boolean;
  isLearningOutcomes: boolean;
}

export default function ParentListItem (props: Props) {
    const {
        title,
        status,
        assessment,
        icon,
        isLiveClassAt,
        isStudyAssessments,
        isLearningOutcomes,
    } = props;
    const classes = useStyles();
    const isAssessment = true;
    return (
        <Box className={classes.boxRoot}>
            <List className = {clsx(classes.list, {
                [classes.listAssesment] : !isAssessment,
            })}
            >

                <ListItemText
                    disableTypography
                    primary={
                        <Typography
                            className={classes.title}
                            variant="body2"
                        > {title}
                        </Typography>}
                />
                <ListItem className={classes.listItem}>
                    <img
                        alt="study icon"
                        src={icon}
                        style={{
                            width: 38,
                            height: 38,
                        }}
                    />
                    <div className={classes.linear}>
                        <LinearProgress
                            style={{
                                height: `10px`,
                                borderRadius: 10,
                            }}
                            className={clsx(classes.linearProcess, {
                                [classes.linearLiveClass]: isLiveClassAt,
                                [classes.linearStudy]: isStudyAssessments,
                                [classes.linearLearningOutcomes] : isLearningOutcomes,
                            })}
                            variant="determinate"
                            value={60}
                        />
                    </div>
                    <Typography
                        className={clsx(classes.statusText, classes.listItemText, {
                            [classes.statusStudyText]: isStudyAssessments,
                            [classes.statusLiveText]: isLiveClassAt,
                            [classes.statusLearningOutcomes] : isLearningOutcomes,
                        })}
                    > {status}
                    </Typography>
                </ListItem>
            </List>
            {isAssessment &&
          <List>
              <Divider />
              <ListItem className={classes.list}>
                  <ListItemText
                      disableTypography
                      primary={
                          <Typography
                              className={classes.lisItemTextBottom}
                              variant="subtitle1"
                          > {assessment}
                          </Typography>}
                  />
                  <img
                      alt="forward icon"
                      src={ForwardIcon}
                  />
              </ListItem>
          </List>}
        </Box>
    );
}
