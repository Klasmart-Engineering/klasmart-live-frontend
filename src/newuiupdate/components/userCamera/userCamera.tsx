import Camera from "./camera";
import NoCamera from "./noCamera";
import UserCameraActions from "./userCameraActions";
import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import React, {useState} from "react";
import UserCameraDetails from "./userCameraDetails";

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
    },
}));

interface UserCameraType {
    user: any;
}

function UserCamera (props: UserCameraType) {
    const { user } = props;
    const classes = useStyles();
    const [ isHover, setIsHover ] = useState(false);

    return (
        <Grid
            container
            className={classes.root}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}>
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
