import UserCamera from "../../../../components/userCamera/userCamera";
import { LocalSessionContext } from "../../../../providers/providers";
import { RoomContext } from "../../../../providers/roomContext";
import {
    Grid,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import { UserVoice as OnStageIcon } from "@styled-icons/boxicons-solid/UserVoice";
import React,
{
    useContext,
    useEffect,
    useState,
} from "react";
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
    const { sessions } = useContext(RoomContext);
    const { name } = useContext(LocalSessionContext);
    const [ host, setHost ] = useState<any>(true);

    useEffect(() => {
        const teachers = [ ...sessions.values() ].filter(session => session.isTeacher === true).sort((a, b) => a.joinedAt - b.joinedAt);
        const host = teachers.find(session => session.isHost === true);
        host ? setHost(host) : setHost(null);
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
