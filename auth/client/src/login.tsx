import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ErrorIcon from "@material-ui/icons/Error";
import * as React from "react";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router";
import * as restApi from "./restapi";
import { RestAPIError, RestAPIErrorType } from "./restapi_errors";
import KidsloopLogo from "../assets/img/kidsloop.svg";
import CenterAlignChildren from "./centerAlignChildren";
import PolicyLink from "./policyLinks";
import StyledButton from "./button";
import StyledTextField from "./textfield";
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login";
import Divider from '@material-ui/core/Divider';

// import { useSelector } from "react-redux";
// import { State } from "../../store/store";
// import Lightswitch from "./lightswitch";
// import LanguageSelect from "./languageSelect";

const useStyles = makeStyles((theme) => createStyles({
    card: {
        alignItems: "center",
        display: "flex",
        padding: "48px 40px !important",
    },
    errorIcon: {
        fontSize: "1em",
        marginRight: theme.spacing(1),
    },
    formContainer: {
        width: "100%",
    },
    link: {
        textAlign: "right",
    },
    pageWrapper: {
        display: "flex",
        flexGrow: 1,
        height: "100vh",
    },
}),
);

export function Login() {
    const classes = useStyles();
    const [inFlight, setInFlight] = useState(false);

    const defaultEmail = ""//useSelector((state: State) => state.account.email || "");
    const [email, setEmail] = useState(defaultEmail);
    const [password, setPassword] = useState("");

    const [passwordError, setPasswordError] = useState<JSX.Element | null>(null);
    const [emailError, setEmailError] = useState<JSX.Element | null>(null);
    const [generalError, setGeneralError] = useState<JSX.Element | null>(null);
    const [success, setSuccess] = useState(false);

    const history = useHistory();

    async function login() {
        setEmailError(null);
        setPasswordError(null);
        if (inFlight) { return; }

        try {
            setInFlight(true);
            if (email === "") { throw new Error("EMPTY_EMAIL"); }
            if (password === "") { throw new Error("EMPTY_PASSWORD"); }
            const token = await restApi.login(email, password);
            await transferLogin(token);
        } catch (e) {
            handleError(e);
        } finally {
            setInFlight(false);
        }
        return;
    }

    async function googleLoginSuccess(response: GoogleLoginResponse | GoogleLoginResponseOffline) {
        if(!("tokenId" in response)) { return }
        const result = await transferLogin(response.tokenId);
    }

    function googleLoginFailure(error: any) {
        console.error(error)
        setInFlight(false)
    }

    async function transferLogin(token: string) {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        const response = await fetch("/transfer", {
            body: JSON.stringify({token}),
            headers,
            method: "POST",
        });
        console.log(response);
        await response.text()
        if(response.ok) {
            handleSuccess();
            return true
        }
        return false
        
    }

    function handleSuccess() {
        const url = new URL(window.location.href)
        const continueParam = url.searchParams.get("continue");
        console.log("continueParam " + continueParam)
        console.log("document.referrer " + document.referrer)
        //TODO validate continue param
        if (continueParam) { window.location.replace(continueParam); }
        if (document.referrer) { window.location.replace(document.referrer); }
        window.location.replace("https://live.kidsloop.net")

        return;
    }

    function handleError(e: RestAPIError | Error) {
        if (!(e instanceof RestAPIError)) {
            if (e.toString().search("EMPTY_EMAIL") !== -1) {
                setEmailError(
                    <span style={{ display: "flex", alignItems: "center" }}>
                        <ErrorIcon className={classes.errorIcon}/>
                        <FormattedMessage id="error_emptyEmail" />
                    </span>,
                );
            } else if (e.toString().search("EMPTY_PASSWORD") !== -1) {
                setPasswordError(
                    <CenterAlignChildren>
                        <ErrorIcon className={classes.errorIcon}/>
                        <FormattedMessage id="error_emptyPassword" />
                    </CenterAlignChildren>,
                );
            } else {
                console.error(e);
            }
            return;
        }
        const id = e.getErrorMessageID();
        const errorMessage = <FormattedMessage id={id} />;
        switch (e.getErrorMessageType()) {
        case RestAPIErrorType.INVALID_LOGIN:
            setEmailError(errorMessage);
            break;
        case RestAPIErrorType.INVALID_PASSWORD:
            setPasswordError(errorMessage);
            break;
        case RestAPIErrorType.EMAIL_NOT_VERIFIED:
            history.push("/verify-email");
            break;
        case RestAPIErrorType.EMAIL_NOT_VERIFIED:
            history.push("/verify-phone");
            break;
        case RestAPIErrorType.ACCOUNT_BANNED:
        default:
            setGeneralError(errorMessage);
            break;
        }
    }

    return (
        <Grid
            container
            direction="column"
            justify="space-around"
            alignItems="center"
            className={ classes.pageWrapper }
        >
            <Container maxWidth="xs">
                <Card>
                    <CardContent className={classes.card}>
                        <Grid container direction="row" justify="center" alignItems="center" spacing={4}>
                            <Grid item xs={8}>
                                <Typography variant="h4">
                                    <FormattedMessage
                                        id={"login_loginPrompt"}
                                        values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }}
                                    />
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <img alt="KidsLoop Logo" src={KidsloopLogo} height="50px" />
                            </Grid>
                            <Grid item>
                                <GoogleLogin
                                    clientId="544374117288-uc6pcgmrvend0thu01p530590ob672j5.apps.googleusercontent.com"
                                    accessType="online"
                                    onRequest={() => setInFlight(true)}
                                    onSuccess={googleLoginSuccess}
                                    onFailure={googleLoginFailure}
                                />
                            </Grid>
                            <Grid container alignItems="center">
                                <Grid item xs={5}>
                                    <Divider  />
                                </Grid>

                                <Grid item xs={2}>
                                    <Typography align="center">
                                        OR
                                    </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Divider  />
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <StyledTextField
                                    autoComplete="email"
                                    error={emailError !== null}
                                    fullWidth
                                    helperText={emailError}
                                    id="email-input"
                                    label={<FormattedMessage id="form_emailLabel" />}
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                />
                                <StyledTextField
                                    autoComplete="current-password"
                                    error={passwordError !== null}
                                    fullWidth
                                    helperText={passwordError}
                                    id="password-input"
                                    label={<FormattedMessage id="form_passwordLabel" />}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    value={password}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Link
                                    href="#"
                                    variant="subtitle2"
                                    onClick={(e: React.MouseEvent) => { history.push("/signup"); e.preventDefault(); }}
                                >
                                    <FormattedMessage id="login_createAccount" />
                                </Link>
                            </Grid>
                            <Grid item xs={6} className={classes.link}>
                                <StyledButton
                                    disabled={inFlight}
                                    onClick={() =>  login() }
                                    size="medium"
                                    type="submit"
                                >
                                    {
                                        inFlight ?
                                            <CircularProgress size={25} /> :
                                            <FormattedMessage id="login_loginButton" />
                                    }
                                </StyledButton>
                            </Grid>
                            <Grid item>
                                {
                                    generalError === null ? null :
                                        <Typography color="error">
                                            {generalError}
                                        </Typography>
                                }
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Grid container direction="row" justify="space-between" alignItems="center">
                    {/* <Grid item xs={1}>
                        <Lightswitch iconOnly />
                    </Grid> */}
                    {/* <Grid item xs={5}>
                        <LanguageSelect noIcon />
                    </Grid> */}
                    <Grid item xs={6}>
                        <PolicyLink />
                    </Grid>
                </Grid>
            </Container>
        </Grid>
    );
}
