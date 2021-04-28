import {
    interactiveModeState,
    isActiveGlobalScreenshareState,
    pinnedUserState,
    usersState,
} from "../../states/layoutAtoms";
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
import { RoomContext } from "../../providers/roomContext";
import { ContentType } from "../../../pages/room/room";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        background: theme.palette.grey[200],
        borderRadius: 12,
        height: `100%`,
    },
}));

function MainView () {
    const classes = useStyles();
    const { content } = useContext(RoomContext)

    const [ pinnedUser, setPinnedUser ] = useRecoilState(pinnedUserState);

    if(content?.type === ContentType.Screen){
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
