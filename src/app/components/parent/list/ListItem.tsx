import { ParentListEmptyItem } from "./emptyCard/parentListEmptyItem";
import { InsignCommentItem } from "./insignCard/insignCommentItem";
import { LearningOutComes } from "@/app/context-provider/parent-context";
import ForwardIcon from "@/assets//img/parent-dashboard/forward_arrow.svg";
import {
    BACKGROUND_PROCESS_GREY,
    BODY_TEXT,
    LEARNING_OUTCOMES_COLOR,
    LIVE_COLOR,
    STUDY_COLOR,
} from "@/config";
import { GetAppInsightMessagesResponse } from "@kl-engineering/cms-api-client";
import {
    Box,
    createStyles,
    Divider,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    makeStyles,
    Typography,
} from "@material-ui/core";
import clsx from "clsx";
import React,
{
    useRef,
    useState,
} from "react";
import { getStatusLearningOutComes } from "../share";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    root: {
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
        borderRadius: 5,
        backgroundColor: BACKGROUND_PROCESS_GREY,
    },
    linearStudy: {
        borderRadius: 5,
        backgroundColor: STUDY_COLOR,
    },
    linearLiveClass: {
        borderRadius: 5,
        backgroundColor: LIVE_COLOR,
    },
    linearLearningOutcomes: {
        borderRadius: 5,
        backgroundColor: LEARNING_OUTCOMES_COLOR,
    },
    statusText: {
        fontWeight: theme.typography.fontWeightMedium as number,
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

export interface Props<T> {
  title: string;
  assessment: string;
  icon: string;
  isLiveClassAt: boolean;
  isStudyAssessments: boolean;
  isLearningOutcomes: boolean;
  isInsightMessage: boolean;
  listData?: Array<T>;
  onChangeDirection?(): void;
}

export enum ButtonType {
    ACHIVED = `achieved`,
    NOT_ACHIVED = `not_achieved`,
    IN_PROGRESS = `in_progress`
}

export interface LearningOutcomeCount {
    achieved: string;
    percent: number;
    total: number;
}

export default function ParentListItem (props: Props<LearningOutComes | GetAppInsightMessagesResponse>) {
    const {
        title,
        assessment,
        icon,
        isLiveClassAt,
        isStudyAssessments,
        isLearningOutcomes,
        isInsightMessage,
        listData,
        onChangeDirection,
    } = props;
    const classes = useStyles();

    const learningRef = useRef<LearningOutcomeCount>({
        achieved: ``,
        percent: 0,
        total: 0
    });

    const isAssessmentRef = useRef<boolean>(true);

    if (isInsightMessage && listData) {
        return (<InsignCommentItem dataInsightMessage={listData[0] as GetAppInsightMessagesResponse} />);
    }

    if (isLearningOutcomes) {
        if (listData && Object.keys(listData[0]).length === 0) {
            return (<ParentListEmptyItem
                title="parentsDashboard.learningOutcome.title"
                messageId="parentsDashboard.learningOutcome.empty"
            />);
        }
        const listCurrent = listData as LearningOutComes[];
        learningRef.current = getStatusLearningOutComes(listCurrent);
        if (learningRef.current.total === 0) isAssessmentRef.current = false;
    }

    return (
        <Box className={classes.root}>
            <List className={clsx(classes.list, {
                [classes.listAssesment] : !isAssessmentRef.current,
            })}
            >
                <ListItemText
                    disableTypography
                    primary={
                        <Typography
                            className={classes.title}
                            variant="body2"
                        >
                            <FormattedMessage
                                id={title}
                            />
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
                            classes={{
                                colorPrimary: classes.linearProcess,
                                barColorPrimary: clsx({
                                    [classes.linearStudy]: isStudyAssessments,
                                    [classes.linearLearningOutcomes]: isLearningOutcomes,
                                    [classes.linearLiveClass] : isLiveClassAt,
                                }),
                            }}
                            variant="determinate"
                            value={learningRef.current.percent}
                        />
                    </div>
                    <Typography
                        className={clsx(classes.statusText, classes.listItemText, {
                            [classes.statusStudyText]: isStudyAssessments,
                            [classes.statusLiveText]: isLiveClassAt,
                            [classes.statusLearningOutcomes] : isLearningOutcomes,
                        })}
                    > {learningRef.current.achieved}
                    </Typography>
                </ListItem>
            </List>
            {isAssessmentRef.current &&
          <List>
              <Divider />
              <ListItem
                  className={classes.list}
                  onClick={onChangeDirection}
              >
                  <ListItemText
                      disableTypography
                      primary={
                          <Typography
                              className={classes.lisItemTextBottom}
                              variant="subtitle1"
                          >
                            <FormattedMessage
                                id={assessment}
                            />
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
