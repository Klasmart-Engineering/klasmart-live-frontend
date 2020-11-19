import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";
// import { useRestAPI } from "../../../api/restapi";
// import { RestAPIError } from "../../../api/restapi_errors";
import KidsloopButton from "../../../components/styled/fabButton";
import BadanamuTextField from "../../../components/styled/textfield";

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

export function PasswordChange() {
    const [inFlight, setInFlight] = useState(false);
    const [generalError, setGeneralError] = useState<JSX.Element | null>(null);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
    const [passwordMatchError, setPasswordMatchError] = useState(false);

    const classes = useStyles();
    const history = useHistory();
    // const restApi = useRestAPI();

    function checkPasswordMatch() {
        if (newPassword === "") { return; }
        if (newPasswordConfirmation === "") { return; }
        const match = (newPassword !== newPasswordConfirmation);
        setPasswordMatchError(match);
    }

    async function changepassword(e: React.FormEvent) {
        e.preventDefault();
        // if (inFlight) { return; }
        // if (newPassword === "") { return; }
        // if (currentPassword === "") { return; }
        // if (newPassword !== newPasswordConfirmation) { return; }
        // try {
        //     setInFlight(true);
        //     const result = await restApi.changePassword(currentPassword, newPassword);
        //     if (result.status === 200) { history.push("/password-changed"); }
        // } catch (e) {
        //     handleError(e);
        // } finally {
        //     setInFlight(false);
        // }
    }

    // function handleError(e: RestAPIError | Error) {
    //     if (!(e instanceof RestAPIError)) {
    //         console.error(e);
    //         return;
    //     }
    //     const id = e.getErrorMessageID();
    //     const errorMessage = <FormattedMessage id={id} />;
    //     switch (e.getErrorMessageType()) {
    //     default:
    //         setGeneralError(errorMessage);
    //         break;
    //     }
    // }

    return (
        <Container maxWidth="xs" style={{ margin: "auto 0" }}>
            <Card>
                <CardContent className={classes.card}>
                    <Grid container direction="column" justify="center" alignItems="center" spacing={4}>
                        <Grid item xs={12}>
                            <Typography variant="h5">
                                <FormattedMessage
                                    id="password_change_heading"
                                    values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }}
                                />
                            </Typography>
                        </Grid>
                        <Grid item xs={12} className={classes.formContainer}>
                            <form onSubmit={(e) => changepassword(e)}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <BadanamuTextField
                                            required
                                            fullWidth
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            label={<FormattedMessage id="password_current" />}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <BadanamuTextField
                                            required
                                            fullWidth
                                            type="password"
                                            error={passwordMatchError}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            onBlur={() => checkPasswordMatch()}
                                            label={<FormattedMessage id="password_new" />}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <BadanamuTextField
                                            required
                                            fullWidth
                                            type="password"
                                            error={passwordMatchError}
                                            value={newPasswordConfirmation}
                                            onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                                            onBlur={() => checkPasswordMatch()}
                                            label={<FormattedMessage id="password_new_confirmation" />}
                                        />
                                    </Grid>
                                </Grid>
                                <KidsloopButton
                                    type="submit"
                                    disabled={inFlight}
                                >
                                    {
                                        inFlight ?
                                            <CircularProgress size={25} /> :
                                            <FormattedMessage id="password_change_button" />
                                    }
                                </KidsloopButton>
                                {
                                    generalError === null ? null :
                                        <Typography color="error">
                                            {generalError}
                                        </Typography>
                                }
                            </form>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
}
