import { Feedback } from '../components/others/feedback';
import {
    Fade, Grid, makeStyles, Theme, Typography,
} from '@material-ui/core';
import { CalendarCheck as ClassEndedIcon } from "@styled-icons/boxicons-regular/CalendarCheck";
import React, { useContext } from 'react';
import { LocalSessionContext } from '../providers/providers';

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        height: `100%`,
        backgroundColor: theme.palette.grey[200],
    },
    root: {
        textAlign: `center`,
    },
    icon: {
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
}));

function ClassEnded () {
    const classes = useStyles();
    const { isTeacher } = useContext(LocalSessionContext);

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
                    <Typography variant="h3">Class has ended</Typography>
                    <Typography variant="body1">Thanks for attending the class</Typography>
                    <Feedback type={isTeacher ? 'teacher' : 'student'}/>
                </Grid>
            </Grid>
        </Fade>
    );
}

export default ClassEnded;
