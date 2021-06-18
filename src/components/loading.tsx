import React from "react";
import { FormattedMessage } from "react-intl";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";

export default function Loading({ messageId, retryCallback }: { messageId?: string, retryCallback?: () => void }) {
    return (
        <Grid item xs={12} style={{ textAlign: "center", backgroundColor: "white" }}>
            <Grid
                container item
                direction="row"
                alignItems="center"
                spacing={2}
            >
                <Grid item xs={12}>
                    <CircularProgress />
                </Grid>
                {messageId ?
                    <Grid item xs={12}>
                        <Typography variant="subtitle2">
                            <FormattedMessage id={messageId} />
                        </Typography>
                    </Grid> : null}
                {retryCallback ?
                    <Grid item xs={12}>
                        <Button onClick={() => { retryCallback() }}><FormattedMessage id={"loading_try_again"} /></Button>
                    </Grid> : null}
            </Grid>
        </Grid>
    );
}