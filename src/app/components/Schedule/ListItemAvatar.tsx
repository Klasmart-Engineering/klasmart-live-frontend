import StyledIcon from "../../../components/styled/icon";
import { Avatar } from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
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
        width: 54,
        height: 33,
        marginTop: 3,
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

    if(imgType){
        return(
            <img
                alt="schedule list icon"
                src={src}
                className={classes.image}
            />
        );
    }

    return (
        <Avatar
            data-testid="schedule-list-item-avatar"
            className={classes.listItemAvatar}
        >
            <StyledIcon
                icon={src}
                size="large"
                color={color}
            />
        </Avatar>
    );
}
