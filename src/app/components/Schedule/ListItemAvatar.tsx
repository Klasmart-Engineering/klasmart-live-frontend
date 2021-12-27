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
    image: {
        marginRight: theme.spacing(2),
    },
}));

interface Props {
    src: ReactElement<any, string | JSXElementConstructor<any>> | any;
    color?: string | undefined;
    imgType?: boolean;
}

export default function ScheduleListItemAvatar (props: Props) {
    const {
        src: src,
        color,
        imgType = true,
    } = props;
    const classes = useStyles();

    return (
        imgType ?
            <img
                alt="schedule list icon"
                src={src}
                className={classes.image}
            /> :
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
