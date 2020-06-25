import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector, useStore } from "react-redux";
import { useHistory } from "react-router";
import { useRestAPI } from "../../../api/restapi";
import { RestAPIError } from "../../../api/restapi_errors";
import KidsloopButton from "../../../components/styled/fabButton";
import BadanamuTextField from "../../../components/styled/textfield";
import { ActionTypes } from "../../../store/actions";
import { State } from "../../../store/store";

const useStyles = makeStyles((theme: Theme) => createStyles({
    card: {
        alignItems: "center",
        display: "flex",
        padding: "48px 40px !important",
    },
    formContainer: {
        width: "100%",
    },
    links: {
        padding: theme.spacing(4, 0),
        textAlign: "right",
    },
}),
);
export function PasswordForgot() {
    const store = useStore();
    const [inFlight, setInFlight] = useState(false);

    const defaultEmail = useSelector((state: State) => state.account.email || "");
    const [email, setEmail] = useState(defaultEmail);

    const [generalError, setGeneralError] = useState<JSX.Element | null>(null);

    const classes = useStyles();
    const restApi = useRestAPI();
    const history = useHistory();
    async function forgotPassword(e: React.FormEvent) {
        e.preventDefault();
        const lang = "en"; // TODO: use locale
        try {
            setInFlight(true);
            const response = await restApi.forgotPassword(email, lang);
            if (response.status === 200) {
                store.dispatch({ type: ActionTypes.EMAIL, payload: email });
                history.push("/password-restore");
            }
        } catch (e) {
            if (!(e instanceof RestAPIError)) {
                console.error(e);
                return;
            }
            setGeneralError(<FormattedMessage id={e.getErrorMessageID()} />);
        } finally {
            setInFlight(false);
        }
    }

    return (
        <Container maxWidth="xs" style={{ margin: "auto 0" }}>
            <Card>
                <CardContent className={classes.card}>
                    <Grid container direction="column" justify="center" alignItems="center" spacing={4}>
                        <Grid item xs={12}>
                            <Typography variant="h5">
                                <FormattedMessage
                                    id="password_forgot_heading"
                                    values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }}
                                />
                            </Typography>
                        </Grid>
                        <Grid item xs={12} className={classes.formContainer}>
                            <form onSubmit={(e) => forgotPassword(e)}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <BadanamuTextField
                                            required
                                            fullWidth
                                            autoComplete="email"
                                            label={<FormattedMessage id="email" />}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    {
                                        generalError === null ? null :
                                            <Typography color="error">
                                                {generalError}
                                            </Typography>
                                    }
                                </Grid>
                                <Grid item xs={12}>
                                    <KidsloopButton
                                        type="submit"
                                        disabled={inFlight}
                                    >
                                        {
                                            inFlight ?
                                                <CircularProgress size={25} /> :
                                                <FormattedMessage id="password_forgot_button" />
                                        }
                                    </KidsloopButton>
                                </Grid>
                            </form>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
}
