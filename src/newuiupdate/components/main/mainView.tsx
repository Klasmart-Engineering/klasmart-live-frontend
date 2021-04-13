import {
    isActiveGlobalScreenshareState,
    pinnedUserState,
    usersState,
    viewModeState,
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
import React from "react";
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
    const [ viewMode, setViewMode ] = useRecoilState(viewModeState);
    const [ isActiveGlobalScreenshare, setIsActiveGlobalScreenshare ] = useRecoilState(isActiveGlobalScreenshareState);
    const [ pinnedUser, setPinnedUser ] = useRecoilState(pinnedUserState);
    const [ users, setUsers ] = useRecoilState(usersState);

    if(isActiveGlobalScreenshare){
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

    if(pinnedUser){
        return(
            <Grid
                container
                className={classes.root}>
                <Grid
                    item
                    xs>
                    <div style={{
                        display: `flex`,
                        height: `100%`,
                        alignItems: `center`,
                        textAlign: `center`,
                        justifyContent: `center`,
                    }}>
						SHOW CAMERA OF {pinnedUser}
                        <br/>
                        {users.filter(user => user.id === pinnedUser).map(user => user.name)}
                    </div>
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid
            container
            className={classes.root}>
            <Grid
                item
                xs>
                {viewMode === `onstage` && <OnStage />}
                {viewMode === `observe` && <Observe />}
                {viewMode === `present` && <Present />}
            </Grid>
        </Grid>
    );
}

export default MainView;
