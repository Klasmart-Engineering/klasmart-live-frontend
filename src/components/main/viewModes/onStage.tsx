import UserCamera from "@/components/userCamera/userCamera";
import { useSessions } from "@/data/live/state/useSessions";
import { useSessionContext } from "@/providers/session-context";
import {
    Grid,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import React,
{ useMemo } from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: `100%`,
        alignItems: `center`,
        justifyContent: `center`,
    },
}));

function OnStage () {
    const classes = useStyles();
    const sessions = useSessions();
    const { name } = useSessionContext();

    const host = useMemo(() => {
        const teachers = [ ...sessions.values() ].filter(session => session.isTeacher === true).sort((a, b) => a.joinedAt - b.joinedAt);
        const host = teachers.find(session => session.isHost === true);
        return host;
    }, [ sessions ]);

    if(host){
        return(
            <UserCamera
                user={host}
                actions={false}
                variant="large"
            />
        );
    }

    return (
        <Grid
            container
            className={classes.root}>
            <Grid item>
                <Typography variant="h4"><FormattedMessage
                    id={`hello`}
                    values={{
                        name,
                    }} /></Typography>
                <Typography><FormattedMessage id={`waiting_for_class`} /></Typography>
            </Grid>
        </Grid>
    );
}

export default OnStage;
