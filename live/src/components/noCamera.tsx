import React from "react";
import { FormattedMessage } from "react-intl";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

export default function NoCamera({messageId}: {
    messageId: string
}) {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
    return (
        <Grid
            container
            justify="space-between"
            alignItems="center"
            style={{
                position: "relative",
                width: "100%",
                backgroundColor: "#193d6f",
                paddingTop: isSmDown ? "100%" : "56.25%",
            }}
        >
            <Typography style={{
                color: "white",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
            }} align="center">
                <FormattedMessage id={messageId} />
            </Typography>
        </Grid>
    );
}