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

export default function Loading({ messageId, rawText, children }: {
    messageId?: string
    rawText?: string
    children?: React.ReactNode
}) {
    const [spinner, _] = useState(Math.floor(Math.random() * Math.floor(SPINNER.length)));

    return (
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            style={{ flex: 1, height: "100%", backgroundColor: "white" }}
            item
        >
            <Grid item>
                <img src={SPINNER[spinner]} height={80} />
            </Grid>
            <Grid item>
                <Typography variant="subtitle1" align="center" gutterBottom>
                    {messageId ? <FormattedMessage id={messageId} /> : (rawText ? rawText : null)}
                </Typography>
            </Grid>
            { children &&
                <Grid item>
                    {children}
                </Grid>
            }
        </Grid>
    );
}