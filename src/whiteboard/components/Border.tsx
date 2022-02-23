import { useSynchronizedState } from "@/whiteboard/context-providers/SynchronizedStateProvider";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    border: {
        position: `absolute`,
        borderStyle: `solid`,
        borderWidth: theme.spacing(0.5),
        borderRadius: theme.spacing(0.5),
        pointerEvents: `none`,
    },
    activeWhiteboard: {
        borderColor: theme.palette.primary.dark,
    },
    disabledWhiteboard: {
        borderColor: theme.palette.action.disabled,
    },
}));

interface Props {
    height: number;
    width: number;
}

export default function WhiteboardBorder (props: Props) {
    const { width, height } = props;
    const classes = useStyles();
    const {
        state: {
            display,
            localDisplay,
            permissions,
        },
    } = useSynchronizedState();

    if (!(display || localDisplay) || !(width && height)) {
        return <></>;
    }

    return (
        <div
            className={clsx(classes.border, {
                [classes.disabledWhiteboard]: !permissions.allowCreateShapes,
                [classes.activeWhiteboard]: permissions.allowCreateShapes,
            })}
            style={{
                height,
                width,
            }}
        />
    );
}
