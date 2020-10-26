import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import CurlySpinner1 from "../assets/img/spinner/curly1_spinner.gif"
import CurlySpinner2 from "../assets/img/spinner/curly2_spinner.gif"
import EccoSpinner1 from "../assets/img/spinner/ecco1_spinner.gif"
import EccoSpinner2 from "../assets/img/spinner/ecco2_spinner.gif"
import JessSpinner1 from "../assets/img/spinner/jess1_spinner.gif"
import MimiSpinner1 from "../assets/img/spinner/mimi1_spinner.gif"

const SPINNER = [CurlySpinner1, CurlySpinner2, EccoSpinner1, EccoSpinner2, JessSpinner1, MimiSpinner1];

export default function Loading({ messageId }: { messageId?: string }) {
    const [spinner, _] = useState(Math.floor(Math.random() * Math.floor(SPINNER.length)));

    return (
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            style={{ flex: 1 }}
            item
        >
            <Grid item>
                <img src={SPINNER[spinner]} height={80} />
            </Grid>
            {messageId ? (
                <Grid item>
                    <Typography variant="h6" align="center" gutterBottom>
                        <FormattedMessage id={messageId} />
                    </Typography>
                </Grid>
            ) : null}
        </Grid>
    );
}