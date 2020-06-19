import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import FaceIcon from "@material-ui/icons/Face";
import randomBytes from "randombytes";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import StudyingBackground from "../../../assets/img/studying_bg.svg";
import CenterAlignChildren from "../../../components/centerAlignChildren";
import StyledFAB from "../../../components/fabButton";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        classInfoContainer: {
            background: `url(${StudyingBackground}) no-repeat`,
            backgroundColor: "#030D1C",
            backgroundPosition: "center right",
            backgroundSize: "50%",
            borderRadius: 12,
            color: "white",
            height: 500,
            padding: theme.spacing(4, 5),
            [theme.breakpoints.down("sm")]: {
                backgroundPosition: "bottom right",
                height: "64vw",
                padding: theme.spacing(2, 2),
            },
            [theme.breakpoints.down("xs")]: {
                height: "72vw",
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

    return (
        <Grid
            container
            direction="column"
            justify="space-between"
            alignItems="flex-start"
            className={classes.classInfoContainer}
        >
            <Grid item>
                <Grid container item spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h4">Shawn @ Calm Island</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <CenterAlignChildren>
                            <Typography variant="h6" style={{ paddingRight: theme.spacing(2) }}>
                                <FormattedMessage id={"live_classCodeLabel"} />:
                            </Typography>
                            <Typography variant="body1">{ randomBytes(6).toString("base64") }</Typography>
                        </CenterAlignChildren>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">
                            KidsLoop <span className={classes.liveTextWrapper}>LIVE</span>
                            &nbsp;
                            <FormattedMessage id={"live_liveLinkLabel"} />:
                        </Typography>
                        <Typography variant="body1">https://meet.google.com/wit-masa-dzw</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <CenterAlignChildren>
                    <StyledFAB extendedOnly className={classes.liveButton}>
                        <FormattedMessage id="live_liveButton" />
                    </StyledFAB>
                    <CenterAlignChildren>
                        <FaceIcon color="inherit" style={{ marginRight: theme.spacing(1) }} />
                        { Math.floor(Math.random() * Math.floor(5)) }
                    </CenterAlignChildren>
                </CenterAlignChildren>
            </Grid>
        </Grid>
    );
}
