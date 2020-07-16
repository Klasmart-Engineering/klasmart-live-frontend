import React from "react";
import { FormattedMessage } from "react-intl";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function Loading() {
    return (
        <Grid item xs={12} style={{ textAlign: "center" }}>
            <Grid
                container item
                direction="row"
                alignItems="center"
                spacing={2}
            >
                <Grid item xs={12}>
                    <CircularProgress />
                </Grid>
                <Grid item xs={12}>
                    <FormattedMessage id="loading" />
                </Grid>
            </Grid>
        </Grid>
    );
}