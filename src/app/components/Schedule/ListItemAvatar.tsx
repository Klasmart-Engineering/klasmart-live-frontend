import StyledIcon from "../../../components/styled/icon";
import {
    Avatar,
    createStyles,
    makeStyles,
} from "@material-ui/core";
import React,
{
    JSXElementConstructor,
    ReactElement,
} from "react";

const useStyles = makeStyles((theme) => createStyles({
    listItemAvatar: {
        backgroundColor: theme.palette.common.white,
    },
}));

interface Props {
    src: ReactElement<any, string | JSXElementConstructor<any>>;
    color: string | undefined;
}

export default function ScheduleListItemAvatar (props: Props) {
    const { src: src, color } = props;
    const classes = useStyles();

    return (
        <Avatar
            data-testid="schedule-list-item-avatar"
            className={classes.listItemAvatar}>
            <StyledIcon
                icon={src}
                size="large"
                color={color}
            />
        </Avatar>
    );
}
