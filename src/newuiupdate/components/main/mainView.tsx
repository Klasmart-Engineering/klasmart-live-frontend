import { ContentType } from "../../../pages/room/room";
import { RoomContext } from "../../providers/roomContext";
import { ScreenShareContext } from "../../providers/screenShareProvider";
import { pinnedUserState } from "../../states/layoutAtoms";
import Observe from "./viewModes/Observe";
import OnStage from "./viewModes/onStage";
import Present from "./viewModes/Present";
import Screenshare from "./viewModes/Screenshare";
import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import React, { useContext } from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        background: theme.palette.grey[200],
        borderRadius: 12,
        height: `100%`,
    },
}));

function MainView () {
    const classes = useStyles();
    const { content } = useContext(RoomContext);
    const screenShare = useContext(ScreenShareContext);
    const [ pinnedUser, setPinnedUser ] = useRecoilState(pinnedUserState);

    // SCREENSHARE VIEW
    // TEACHER and STUDENTS : Host Screen
    if(content?.type === ContentType.Screen && screenShare.stream){
        return(
            <Grid
                container
                className={classes.root}>
                <Grid
                    item
                    xs>
                    <Screenshare />
                </Grid>
            </Grid>
        );
    }

    // PRESENT VIEW
    // HOST : Present activity
    // STUDENTS : See activity screen from Host
    if(content?.type === ContentType.Stream){
        return(
            <Grid
                container
                className={classes.root}>
                <Grid
                    item
                    xs>
                    <Present />
                </Grid>
            </Grid>
        );
    }

    // TEACHER : Observe student doing activities
    // STUDENTS : Interactive activity
    if(content?.type === ContentType.Activity){
        return(
            <Grid
                container
                className={classes.root}>
                <Grid
                    item
                    xs>
                    <Observe />
                </Grid>
            </Grid>
        );
    }

    // TODO : Pin User feature
    // if(pinnedUser){
    //     return(
    //         <Grid
    //             container
    //             className={classes.root}>
    //             <Grid
    //                 item
    //                 xs>
    //                 <div style={{
    //                     display: `flex`,
    //                     height: `100%`,
    //                     alignItems: `center`,
    //                     textAlign: `center`,
    //                     justifyContent: `center`,
    //                 }}>
    // 					SHOW CAMERA OF {pinnedUser}
    //                     <br/>
    //                     {users.filter(user => user.id === pinnedUser).map(user => user.name)}
    //                 </div>
    //             </Grid>
    //         </Grid>
    //     );
    // }

    // DEFAULT VIEW (OnStage)
    // TEACHER and STUDENTS : Host camera
    return(
        <Grid
            container
            className={classes.root}>
            <Grid
                item
                xs>
                <OnStage />
            </Grid>
        </Grid>
    );
}

export default MainView;
