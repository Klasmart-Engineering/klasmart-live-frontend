import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import FaceIcon from "@material-ui/icons/Face";
import randomBytes from "randombytes";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { useSelector, useStore } from "react-redux";
import LiveBackground from "../../../assets/img/live_bg.svg";
import CenterAlignChildren from "../../../components/centerAlignChildren";
import StyledFAB from "../../../components/styled/fabButton";
import { ActionTypes } from "../../../store/actions";
import { State } from "../../../store/store";
import ClassSelect from "../../../components/classSelect"
import { LiveSessionData } from "../../../types/objectTypes";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        classInfoContainer: {
            background: `url(${LiveBackground}) no-repeat`,
            backgroundColor: "#f0e6cf",
            backgroundPosition: "center right",
            backgroundSize: "30%",
            borderRadius: 12,
            color: "#193d6f",
            height: "100%",
            minHeight: 360,
            padding: theme.spacing(4, 5),
            [theme.breakpoints.down("sm")]: {
                backgroundPosition: "bottom right",
                height: `min(${window.innerHeight - 20}px,56vw)`,
                padding: theme.spacing(2, 2),
            },
            [theme.breakpoints.down("xs")]: {
                height: `min(${window.innerHeight - 20}px,72vw)`,
            },
        },
        liveButton: {
            backgroundColor: "#ff6961",
            color: "white",
            marginRight: theme.spacing(2),
        },
        liveTextWrapper: {
            backgroundColor: "#ff6961",
            borderRadius: 20,
            color: "white",
            fontSize: "0.6em",
            padding: theme.spacing(0.25, 0.75),
        },
    }),
);

export default function LiveCard() {
    const classes = useStyles();
    const theme = useTheme();
    const store = useStore();

    const liveData = useSelector((state: State) => state.account.finishLiveData);
    const setLiveData = (value: LiveSessionData) => {
        store.dispatch({ type: ActionTypes.FINISH_LIVE_DATA, payload: value });
    };
    const toggleLive = () => {
        const data = initLiveData();
        setLiveData(data);
        store.dispatch({ type: ActionTypes.LIVE_CLASS_TOGGLE, payload: true });
    };

    function initLiveData() {
        const startDate = new Date().getTime();
        const data: LiveSessionData = {
            classId: liveData.classId,
            className: liveData.className,
            startDate,
            students: liveData.students
        }
        return data
    }

    return (
        <Grid
            container
            direction="column"
            justify="space-between"
            alignItems="flex-start"
            wrap="nowrap"
            className={classes.classInfoContainer}
        >
            <Grid item>
                <Grid container item spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h4">Welcome to Calm Island</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <CenterAlignChildren>
                            <Typography variant="h6" style={{ paddingRight: theme.spacing(2) }}>
                                <FormattedMessage id={"live_classNameLabel"} />:
                            </Typography>
                            <ClassSelect />
                        </CenterAlignChildren>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">
                            KidsLoop <span className={classes.liveTextWrapper}>LIVE</span>
                            &nbsp;
                            <FormattedMessage id={"live_liveLinkLabel"} />:
                        </Typography>
                        <Typography variant="body1">https://zoo.kidsloop.net/live/</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <CenterAlignChildren>
                    <StyledFAB
                        extendedOnly
                        flat
                        className={classes.liveButton}
                        onClick={() => toggleLive()}>
                        <FormattedMessage id="live_liveButton" />
                    </StyledFAB>
                    <CenterAlignChildren>
                        <FaceIcon color="inherit" style={{ marginRight: theme.spacing(1) }} />
                        {Math.floor(Math.random() * Math.floor(5))}
                    </CenterAlignChildren>
                </CenterAlignChildren>
            </Grid>
        </Grid>
    );
}
