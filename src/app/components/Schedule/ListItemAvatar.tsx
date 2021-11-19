import {
    Avatar,
    createStyles,
    makeStyles,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    listItemAvatar: {
        backgroundColor: `#C5E9FB`,
    },
}));

interface Props {
    src: string;
    alt: HTMLImageElement[`alt`];
}

export default function ScheduleListItemAvatar (props: Props) {
    const { src: src, alt } = props;
    const classes = useStyles();

    return (
        <Avatar className={classes.listItemAvatar}>
            <img
                alt={alt}
                src={src}
                height={24}
            />
        </Avatar>
    );
}
