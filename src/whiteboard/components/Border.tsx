import { useSynchronizedState } from "@/whiteboard/context-providers/SynchronizedStateProvider";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    border: {
        position: `fixed`,
        borderStyle: `solid`,
        borderWidth: theme.spacing(0.5),
        borderRadius: theme.spacing(0.5),
        pointerEvents: `none`,
    },
    borderFullScreen: {
        position: `fixed`,
        borderStyle: `solid`,
        borderWidth: theme.spacing(0.5),
        borderRadius: theme.spacing(0.5),
        pointerEvents: `none`,
        borderColor: theme.palette.action.disabled,
    },
    activeWhiteboard: {
        borderColor: theme.palette.primary.dark,
    },
    disabledWhiteboard: {
        borderColor: theme.palette.action.disabled,
    },
    inside: {
        boxSizing: `border-box`,
    },
}));

interface Props {
    height: number;
    width: number;
    inside?: boolean;
    isFullScreen?: boolean;
}

export default function WhiteboardBorder (props: Props) {
    const {
        width,
        height,
        inside = false,
        isFullScreen,
    } = props;
    const classes = useStyles();
    const {
        state: {
            display,
            localDisplay,
            permissions,
        },
    } = useSynchronizedState();

    if (!(display || localDisplay) || !(width && height)) {
        if (isFullScreen) {
            return (
                <div
                    className={classes.borderFullScreen}
                    style={{
                        height,
                        width,
                    }}
                />
            );
        }
        return <></>;
    }

    return (
        <div
            className={clsx(classes.border, {
                [classes.disabledWhiteboard]: !permissions.allowCreateShapes,
                [classes.activeWhiteboard]: permissions.allowCreateShapes,
                [classes.inside]: inside,
            })}
            style={{
                height,
                width,
            }}
        />
    );
}
