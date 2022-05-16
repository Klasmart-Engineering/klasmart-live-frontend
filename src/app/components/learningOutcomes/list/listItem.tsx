import {
    BUTTON_COLOR_ACHIEVED,
    LEARNING_COLOR_TEXT,
    LIVE_COLOR,
    THEME_COLOR_HOME_FUN_SCHEDULE_CARD,
} from "@/config";
import {
    Box,
    Button,
    createStyles,
    List,
    ListItemText,
    makeStyles,
    Typography,
} from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        width: `auto`,
        margin: `7px 12px 12px`,
        borderRadius: 12,
        backgroundColor: theme.palette.background.paper,
        "&:last-child":{
            marginBottom: theme.spacing(1),
        },
        "&:hover": {
            background: theme.palette.background.paper,
        },
    },
    list: {
        padding: `10px 20px`,
        flexDirection: `row`,
        alignItems: `center`,
        justifyContent: `space-between`,
        display: `flex`,
    },
    listItem: {
        backgroundColor: BUTTON_COLOR_ACHIEVED,
        borderRadius: 12,
        width: 91,
        height: 24,
    },
    achievedListItem: {
        backgroundColor: LIVE_COLOR,
    },
    inProcessListItem: {
        backgroundColor: THEME_COLOR_HOME_FUN_SCHEDULE_CARD,
    },
    title: {
        fontWeight: theme.typography.fontWeightRegular as number,
        color: LEARNING_COLOR_TEXT,
    },
    achieved: {
        fontSize: `0.65rem`,
        color: theme.palette.background.paper,
    },
}));

export interface Props {
    title: string;
    status: string;
}

export default function LearningOutcomesItems (props: Props) {

enum ButtonType {
    ACHIVED = `achieved`,
    NOT_ACHIVED = `not_achieved`,
    IN_PROGRESS = `in_progress`
}

const { title, status } = props;
const classes = useStyles();

return (
    <Box className={classes.root}>
        <List className={classes.list}>
            <ListItemText
                disableTypography
                primary={
                    <Typography
                        className={classes.title}
                        variant="body2"
                    > {title}
                    </Typography>}
            />
            <Button className={clsx(classes.listItem, {
                [classes.achievedListItem]: status === ButtonType.ACHIVED,
                [classes.inProcessListItem]:status === ButtonType.IN_PROGRESS,
            })}
            >
                <Typography
                    className={classes.achieved}
                >
                    <FormattedMessage id={status} />
                </Typography>
            </Button>
        </List>
    </Box>
);
}
