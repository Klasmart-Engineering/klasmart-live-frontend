import { Feedback } from '../components/others/feedback';
import { LocalSessionContext, SFU_LINK } from '../providers/providers';
import { MUTE, MuteNotification } from '../providers/WebRTCContext';
import { useMutation } from '@apollo/client';
import {
    Fade, Grid, makeStyles, Theme, Typography,
} from '@material-ui/core';
import { CalendarCheck as ClassEndedIcon } from "@styled-icons/boxicons-regular/CalendarCheck";
import React, {
    useContext, useEffect, useState,
} from 'react';
import { FormattedMessage } from 'react-intl';

const useStyles = makeStyles((theme: Theme) => ({
    container:{
        height: `100%`,
        backgroundColor: theme.palette.grey[200],
    },
    root: {
        textAlign: `center`,
    },
    icon:{
        color: theme.palette.text.primary,
        marginBottom: 10,
        "& svg": {
            height: `3rem`,
            width: `3rem`,
            background: theme.palette.text.primary,
            borderRadius: 40,
            color: theme.palette.common.white,
            padding: `1rem`,
        },
    },
    returnToHub:{
        fontWeight: 600,
        marginTop: theme.spacing(4),
        "& a": {
            color: theme.palette.text.primary,
        },
    },
}));

function ClassLeft () {
    const classes = useStyles();

    // TODO : Full Disable camera on leave page
    const { sessionId, roomId } = useContext(LocalSessionContext);
    const [ muteMutation ] = useMutation(MUTE, {
        context: {
            target: SFU_LINK,
        },
    });
    const notification: MuteNotification = {
        roomId,
        sessionId,
        audio: false,
        video: false,
    };
    useEffect(()=>{
        muteMutation({
            variables: notification,
        });
    }, []);

    return (
        <Fade in={true}>
            <Grid
                container
                alignItems="center"
                justify="center"
                className={classes.container}>
                <Grid
                    item
                    className={classes.root}>
                    <div className={classes.icon}>
                        <ClassEndedIcon />
                    </div>
                    <Typography variant="h3"><FormattedMessage id="class_ended_you_have_left" /></Typography>
                    <Typography variant="body1"><FormattedMessage id="class_ended_thanks_for_attending" /></Typography>

                    {/* TODO : FEEDBACK
                    <Typography variant="body1"><FormattedMessage id="class_ended_how_was_the_class" /></Typography>
                     <Feedback type="leaving" />
                    */}
                    <Typography className={classes.returnToHub}>
                        <a href="#"><FormattedMessage id="class_ended_return_to_hub" /></a>
                    </Typography>
                </Grid>
            </Grid>
        </Fade>
    );
}

export default ClassLeft;
