import { RoomContext } from "../../../providers/roomContext";
import UserCamera from "../../userCamera/userCamera";
import {
    Grid, makeStyles, Theme,
} from "@material-ui/core";
import { UserVoice as OnStageIcon } from "@styled-icons/boxicons-solid/UserVoice";
import React, {
    useContext, useEffect, useState,
} from "react";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: `100%`,
        alignItems: `center`,
        justifyContent: `center`,
    },
}));

function OnStage () {
    const classes = useStyles();
    const { content, sessions } = useContext(RoomContext);

    const [ host, setHost ] = useState<any>();

    useEffect(() => {
        const teachers = [ ...sessions.values() ].filter(session => session.isTeacher === true).sort((a, b) => a.joinedAt - b.joinedAt);
        const host = teachers.find(session => session.isHost === true);
        host ? setHost(host) : setHost(null);
    }, [ sessions ]);

    if(host){
        return(
            <UserCamera
                user={host}
                actions={false}/>
        );
    }

    return (
        <Grid
            container
            className={classes.root}>
            <Grid item>
                waiting_for_class
            </Grid>
        </Grid>
    );
}

export default OnStage;
