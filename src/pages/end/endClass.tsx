import { CloseIconButton } from "@/app/components/icons/closeIconButton";
import { Feedback } from '@/components/feedback/feedback';
import {
    classEndedState,
    classLeftState,
} from "@/store/layoutAtoms";
import {
    Fade,
    Grid,
    makeStyles,
    Theme,
    Typography,
} from '@material-ui/core';
import { CalendarCheck as ClassEndedIcon } from "@styled-icons/boxicons-regular/CalendarCheck";
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from "recoil";

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
    appHeader:{
        position: `fixed`,
        top: 0,
        left: 0,
        width: `100%`,
        padding: `20`,
        boxSizing: `border-box`,
    },
    appHeaderRight:{
        textAlign: `right`,
    },
}));

function EndClass () {
    const classes = useStyles();
    const HUB_ENDPOINT = process.env.ENDPOINT_HUB;
    const history = useHistory();

    const [ classLeft, setClassEnded ] = useRecoilState(classLeftState);
    const [ classEnded, setClassLeft ] = useRecoilState(classEndedState);

    const onCloseButtonClick = () => {
        setClassEnded(false);
        setClassLeft(false);
        history.push(`/schedule`)
    }

    return (
        <Fade in={true}>
            <>
                {process.env.IS_CORDOVA_BUILD &&
                    <div className={classes.appHeader}>
                        <div className={classes.appHeaderRight}>
                            <CloseIconButton onClick={onCloseButtonClick} />
                        </div>
                    </div>
                }
                <Grid
                    container
                    alignItems="center"
                    justifyContent="center"
                    className={classes.container}>
                    <Grid
                        item
                        className={classes.root}>
                        <div className={classes.icon}>
                            <ClassEndedIcon />
                        </div>
                        <Typography variant="h3"><FormattedMessage id={classLeft ? `class_ended_you_have_left` : `class_ended_title`} /></Typography>
                        <Typography variant="body1"><FormattedMessage id="class_ended_thanks_for_attending" /></Typography>

                        <Typography variant="body1"><FormattedMessage id="class_ended_how_was_the_class" /></Typography>
                        <Feedback type="END_CLASS" />

                        {HUB_ENDPOINT &&
                            <Typography className={classes.returnToHub}>
                                {
                                    process.env.IS_CORDOVA_BUILD
                                        ? <a onClick={onCloseButtonClick} href="#"><FormattedMessage id="class_ended_return_to_hub" /></a>
                                        : <a href={HUB_ENDPOINT}><FormattedMessage id="class_ended_return_to_hub" /></a>
                                }
                            </Typography>
                        }
                    </Grid>
                </Grid>
            </>
        </Fade>
    );
}

export default EndClass;
