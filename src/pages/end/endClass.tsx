import { useCordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import { Feedback } from '@/components/feedback/feedback';
import {
    COLOR_RANGE_CALENDAR,
    LEAVE_CLASS_BACKGROUND,
    TEXT_COLOR_CONSTRAST_DEFAULT,
} from "@/config";
import {
    classEndedState,
    classLeftState,
    hasJoinedClassroomState,
} from "@/store/layoutAtoms";
import { useWebrtcClose } from "@kl-engineering/live-state/ui";
import {
    Button,
    Grid,
    makeStyles,
    Theme,
    Typography,
} from '@material-ui/core';
import React,
{ useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import {
    useRecoilState,
    useSetRecoilState,
} from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        height: `100%`,
        backgroundColor: LEAVE_CLASS_BACKGROUND,
        overflowY: `auto`,
        justifyContent: `center`,
        alignItems: `center`,
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
    returnToHub: {
        fontWeight: theme.typography.fontWeightBold as number,
        marginTop: theme.spacing(4),
        "& a": {
            color: theme.palette.text.primary,
        },
    },
    appHeader: {
        position: `fixed`,
        top: 0,
        left: 0,
        width: `100%`,
        padding: `20`,
        boxSizing: `border-box`,
    },
    appHeaderRight: {
        textAlign: `right`,
        marginTop: theme.spacing(3),
        marginRight: theme.spacing(4),
    },
    button: {
        backgroundColor: COLOR_RANGE_CALENDAR,
        color: TEXT_COLOR_CONSTRAST_DEFAULT,
        fontWeight: theme.typography.fontWeightBold as number,
        padding: theme.spacing(1, 2.5),
        borderRadius: theme.spacing(3),
        marginTop: theme.spacing(3),
        fontSize: `1rem`,
        [theme.breakpoints.up(`md`)]: {
            padding: theme.spacing(1, 3.75),
        },
    },
    title: {
        color: TEXT_COLOR_CONSTRAST_DEFAULT,
    },
}));

export default function EndClass () {
    const END_CLASS_ON_BACK_ID = `endClassOnBackID`;
    const classes = useStyles();
    const history = useHistory();
    useWebrtcClose();

    const { addOnBack } = useCordovaSystemContext();
    const [ classLeft, setClassLeft ] = useRecoilState(classLeftState);
    const setClassEnded = useSetRecoilState(classEndedState);
    const setHasJoinedClassroom = useSetRecoilState(hasJoinedClassroomState);

    const onCloseButtonClick = () => {
        history.goBack();
        setClassEnded(false);
        setClassLeft(false);
        setHasJoinedClassroom(false);
    };

    useEffect(() => {
        addOnBack?.({
            id: END_CLASS_ON_BACK_ID,
            onBack: onCloseButtonClick,
        });
    }, []);

    return (
        <Grid
            container
            className={classes.container}
        >
            <Grid
                item
                className={classes.root}
            >
                <Typography
                    className={classes.title}
                    variant="h3"
                ><FormattedMessage id={classLeft ? `class_ended_you_have_left` : `class_ended_title`} />
                </Typography>
                <Button
                    className={classes.button}
                    onClick={onCloseButtonClick}
                >
                    <FormattedMessage
                        id="none"
                        defaultMessage="Back to schedule"
                    />
                </Button>
            </Grid>
        </Grid>
    );
}
