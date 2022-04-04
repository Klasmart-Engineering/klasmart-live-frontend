import ForwardIcon from "@/assets//img/parent-dashboard/forward_arrow.svg";
import {
    TEXT_COLOR_LIVE_PRIMARY,
    TEXT_COLOR_STUDY_PRIMARY,
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
        padding: `10px 10px 0 10px`,
    },
    listAssesment: {
        paddingBottom: `10px`,
    },
    listItem: {
        padding: `5px 0 5px`,
    },
    linear: {
        marginLeft: theme.spacing(2),
        width: `100%`,
        height: 10,
    },
    listItemText: {
        width: 80,
        marginLeft: theme.spacing(2),
        fontWeight: theme.typography.fontWeightMedium as number,
        fontSize: `1.5rem`,
    },
    lisItemTextBottom: {
        fontWeight: theme.typography.fontWeightBold as number,
    },
    linearProcess: {
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: `#C4CBD0`,
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: `#FFBC00`,
        },
    },
}));

export interface Props {
  title: string;
  status: string;
  assessment: string;
  icon: string;
  isAssessment: boolean;
}

export default function ParentListItem (props: Props) {
    const {
        title,
        status,
        assessment,
        icon,
        isAssessment,
    } = props;
    const classes = useStyles();

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
                            variant="body1"
                        > {title}
                        </Typography>}
                />
                <ListItem className={classes.listItem}>
                    <img
                        alt="study icon"
                        src={icon}
                    />
                    <div className={classes.linear}>
                        <LinearProgress
                            style={{
                                height: `10px`,
                                borderRadius: 10,
                            }}
                            className={classes.linearProcess}
                            variant="determinate"
                            value={50}
                        />
                    </div>
                    <ListItemText
                        disableTypography
                        className={classes.listItemText}
                        primary={
                            <Typography
                                variant="subtitle1"
                            > {status}
                            </Typography>}
                    />
                </ListItem>
            </List>
            {isAssessment &&
          <List>
              <Divider />
              <ListItem >
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
