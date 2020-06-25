import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ErrorIcon from "@material-ui/icons/Error";
import LogRocket from "logrocket";
import * as QueryString from "query-string";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useRestAPI } from "../../api/restapi";
import { RestAPIError, RestAPIErrorType } from "../../api/restapi_errors";
import KidsloopLogo from "../../assets/img/kidsloop.svg";
import { redirectIfAuthorized } from "../../components/authorized";
import CenterAlignChildren from "../../components/centerAlignChildren";
import LanguageSelect from "../../components/languageSelect";
import Lightswitch from "../../components/lightswitch";
import PolicyLink from "../../components/policyLinks";
import StyledButton from "../../components/styled/button";
import StyledTextField from "../../components/styled/textfield";
import { State } from "../../store/store";

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

    const defaultEmail = useSelector((state: State) => state.account.email || "");
    const [email, setEmail] = useState(defaultEmail);
    const [password, setPassword] = useState("");

    const [passwordError, setPasswordError] = useState<JSX.Element | null>(null);
    const [emailError, setEmailError] = useState<JSX.Element | null>(null);
    const [generalError, setGeneralError] = useState<JSX.Element | null>(null);

    const history = useHistory();
    const restApi = useRestAPI();

    redirectIfAuthorized();

    async function login() {
        setEmailError(null);
        setPasswordError(null);
        if (inFlight) { return; }
        try {
            setInFlight(true);
            if (email === "") { throw new Error("EMPTY_EMAIL"); }
            if (password === "") { throw new Error("EMPTY_PASSWORD"); }
            await restApi.login(email, password);
            LogRocket.identify(email);
        } catch (e) {
            handleError(e);
        } finally {
            setInFlight(false);
        }
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
                            <Grid item xs={12}>
                                <img alt="KidsLoop Logo" src={KidsloopLogo} height="50px" />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h5">
                                    <FormattedMessage
                                        id={"login_loginPrompt"}
                                        values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }}
                                    />
                                </Typography>
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
                                    onClick={() => {
                                        history.push(`/?${QueryString.stringify({ component: "live" })}`);
                                    }}
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
                    <Grid item xs={1}>
                        <Lightswitch iconOnly onClick={() => {}}/>
                    </Grid>
                    <Grid item xs={5}>
                        <LanguageSelect noIcon />
                    </Grid>
                    <Grid item xs={6}>
                        <PolicyLink />
                    </Grid>
                </Grid>
            </Container>
        </Grid>
    );
}
