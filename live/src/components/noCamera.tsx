import React from "react";
import { FormattedMessage } from "react-intl";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            position: "relative",
            width: "100%",
            backgroundColor: "#193d6f",
        },
        centeredText: {
            color: "white",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            whiteSpace: "pre-line",
            wordBreak: "break-word"
        },
    })
);

export default function NoCamera({ messageId }: { messageId: string }) {
    const classes = useStyles();
    return (
        <Grid
            className={classes.root}
            container
            justify="space-between"
            alignItems="center"
            style={{ paddingTop: "75%" }}
        >
            <Typography className={classes.centeredText} variant="caption" align="center">
                <FormattedMessage id={messageId} />
            </Typography>
        </Grid>
    );
}