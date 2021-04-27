import { LocalSessionContext } from "../../providers/providers";
import Camera from "./camera";
import NoCamera from "./noCamera";
import UserCameraActions from "./userCameraActions";
import UserCameraDetails from "./userCameraDetails";
import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import clsx from "clsx";
import React, { useContext, useState } from "react";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: `#31313c`,
        borderRadius: 12,
        width: `100%`,
        minHeight: 90,
        alignItems: `center`,
        textAlign: `center`,
        position: `relative`,
        overflow: `hidden`,
        order: 99,
    },
    self:{
        order: 1,
    },
    speaking:{
        order: 2,
        border: `4px solid #5ce1ff`,
        boxShadow: `2px 2px 2px rgba(93, 225, 255, 0.4)`,
    },
}));

interface UserCameraType {
    user: any;
}

function UserCamera (props: UserCameraType) {
    const { user } = props;
    const classes = useStyles();
    const [ isHover, setIsHover ] = useState(false);

    const { sessionId } = useContext(LocalSessionContext);
    const isSelf = user.id === sessionId ? true : false;
    const isSpeaking = false;

    return (
        <Grid
            container
            className={clsx(classes.root, {
                [classes.self]: isSelf,
                [classes.speaking]: isSpeaking,
            })}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <Grid
                item
                xs>
                <UserCameraDetails user={user} />
                {isHover && <UserCameraActions user={user} />}
                {user.hasVideo ? <Camera user={user} /> : <NoCamera name={user.name} />}
            </Grid>
        </Grid>
    );
}

export default UserCamera;
