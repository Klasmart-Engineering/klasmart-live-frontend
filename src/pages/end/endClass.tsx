import { CloseIconButton } from "@/app/components/icons/closeIconButton";
import { useCordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import { Feedback } from '@/components/feedback/feedback';
import {
    TEXT_COLOR_CONSTRAST_DEFAULT,
    TEXT_COLOR_PRIMARY_DEFAULT,
} from "@/config";
import { classLeftState } from "@/store/layoutAtoms";
import {
    Fade,
    Grid,
    makeStyles,
    Theme,
    Typography,
} from '@material-ui/core';
import { CalendarCheck as ClassEndedIcon } from "@styled-icons/boxicons-regular/CalendarCheck";
import { useWebrtcClose } from "kidsloop-live-state/ui";
import React,
{ useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useRecoilValue } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    container:{
        height: `100%`,
        backgroundColor: theme.palette.grey[200],
        overflowY: `auto`,
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
        fontWeight: theme.typography.fontWeightBold as number,
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
        marginTop: theme.spacing(3),
        marginRight: theme.spacing(4),
    },
}));

function EndClass () {
    const END_CLASS_ON_BACK_ID = `endClassOnBackID`;
    const classes = useStyles();
    const HUB_ENDPOINT = process.env.ENDPOINT_HUB;
    const history = useHistory();
    useWebrtcClose();

    const { addOnBack } = useCordovaSystemContext();
    const classLeft = useRecoilValue(classLeftState);

    const { restart } = useCordovaSystemContext();

    const onCloseButtonClick = () => {
        // TODO: The WebRTC context can't properly initiate another session unless the context
        // is completely restarted. This is something we'd have to solve at some point, but
        // the current workaround is to reload the entire app instead.
        if (restart) {
            restart();
        } else {
            history.push(`/schedule`);
        }
    };

    useEffect(() => {
        addOnBack?.({
            id: END_CLASS_ON_BACK_ID,
            onBack: onCloseButtonClick,
        });
    }, []);

    return (
        <Fade in={true}>
            <>
                {process.env.IS_CORDOVA_BUILD &&
                    <div className={classes.appHeader}>
                        <div className={classes.appHeaderRight}>
                            <CloseIconButton
                                iconSize="xlarge"
                                buttonSize="small"
                                color={TEXT_COLOR_CONSTRAST_DEFAULT}
                                backgroundColor={TEXT_COLOR_PRIMARY_DEFAULT}
                                onClick={onCloseButtonClick}
                            />
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
                        {!process.env.IS_CORDOVA_BUILD &&
                            <div className={classes.icon}>
                                <ClassEndedIcon />
                            </div>
                        }
                        <Typography variant="h3"><FormattedMessage id={classLeft ? `class_ended_you_have_left` : `class_ended_title`} /></Typography>
                        <Typography variant="body1"><FormattedMessage id="class_ended_thanks_for_attending" /></Typography>

                        <Typography variant="body1"><FormattedMessage id="class_ended_how_was_the_class" /></Typography>
                        <Feedback type="END_CLASS" />

                        {HUB_ENDPOINT &&
                            <Typography className={classes.returnToHub}>
                                {
                                    process.env.IS_CORDOVA_BUILD
                                        ? <a
                                            href="#"
                                            onClick={onCloseButtonClick}><FormattedMessage id="class_ended_return_to_hub" /></a>
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
