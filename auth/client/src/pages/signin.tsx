import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ErrorIcon from "@material-ui/icons/Error";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router";
import * as restApi from "../restapi";
import { RestAPIError, RestAPIErrorType } from "../restapi_errors";
import CenterAlignChildren from "../components/centerAlignChildren";
import StyledButton from "../components/button";
import StyledTextField from "../components/textfield";
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login";
import Divider from '@material-ui/core/Divider';
import useTheme from "@material-ui/core/styles/useTheme";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import withStyles from "@material-ui/core/styles/withStyles";
import { CheckboxProps } from "@material-ui/core/Checkbox/Checkbox";
import Collapse from '@material-ui/core/Collapse';
import BadanamuLogo from "../../assets/img/badanamu_logo.png";


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
    googleSSO: {
        borderRadius: "12px !important",
        fontFamily: "inherit !important",
        justifyContent: "center",
        width: "100%",
    },
    pageWrapper: {
        display: "flex",
        flexGrow: 1,
        height: "100vh",
    },
}),
);

const StyledCheckbox = withStyles({
    root: {
        color: "#0E78D5",
        '&$checked': {
            color: "#0E78D5",
        },
    },
    checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

export function SignIn() {
    const classes = useStyles();
    const theme = useTheme();

    const [inFlight, setInFlight] = useState(false);
    const [checked, setChecked] = useState(false);
    const [collapse, setCollapse] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [passwordError, setPasswordError] = useState<JSX.Element | null>(null);
    const [emailError, setEmailError] = useState<JSX.Element | null>(null);
    const [generalError, setGeneralError] = useState<JSX.Element | null>(null);
    const [checkmarkError, setCheckmarkError] = useState<JSX.Element | null>(null);

    const history = useHistory();

    async function login() {
        setEmailError(null);
        setPasswordError(null);
        setCheckmarkError(null);
        if (inFlight) { return; }

        try {
            setInFlight(true);
            if (email === "") { throw new Error("EMPTY_EMAIL"); }
            if (password === "") { throw new Error("EMPTY_PASSWORD"); }
            if (!checked) {
                setCheckmarkError(
                    <CenterAlignChildren>
                        <ErrorIcon className={classes.errorIcon} />
                        <FormattedMessage id={"Please accept the Privacy Policy to sign in."} />
                    </CenterAlignChildren>
                );
                return;
            }
            const token = await restApi.login(email, password);
            await transferLogin(token.accessToken);
        } catch (e) {
            handleError(e);
        } finally {
            setInFlight(false);
        }
        return;
    }

    async function googleLoginSuccess(response: GoogleLoginResponse | GoogleLoginResponseOffline) {
        if (!("tokenId" in response)) { return }
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
            body: JSON.stringify({ token }),
            headers,
            method: "POST",
        });
        console.log(response);
        await response.text()
        if (response.ok) {
            history.push('/continue');
            return true;
        }
        return false

    }

    function handleError(e: RestAPIError | Error) {
        if (!(e instanceof RestAPIError)) {
            if (e.toString().search("EMPTY_EMAIL") !== -1) {
                setEmailError(
                    <span style={{ display: "flex", alignItems: "center" }}>
                        <ErrorIcon className={classes.errorIcon} />
                        <FormattedMessage id="error_emptyEmail" />
                    </span>,
                );
            } else if (e.toString().search("EMPTY_PASSWORD") !== -1) {
                setPasswordError(
                    <CenterAlignChildren>
                        <ErrorIcon className={classes.errorIcon} />
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
        <React.Fragment>
            <Grid item xs={12}>
                <Typography variant="h4">
                    <FormattedMessage
                        id={"login_loginPrompt"}
                        values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }}
                    />
                </Typography>
            </Grid>
            { navigator.userAgent.includes("Cordova") || navigator.userAgent.includes("cordova") ? null :
                <>
                    <Grid item xs={12}>
                        <GoogleLogin
                            clientId="544374117288-uc6pcgmrvend0thu01p530590ob672j5.apps.googleusercontent.com"
                            accessType="online"
                            onRequest={() => setInFlight(true)}
                            onSuccess={googleLoginSuccess}
                            onFailure={googleLoginFailure}
                            className={classes.googleSSO}
                        />
                    </Grid>
                    <Grid container alignItems="center">
                        <Grid item xs={5}>
                            <Divider />
                        </Grid>

                        <Grid item xs={2}>
                            <Typography variant="body2" align="center">
                                OR
                            </Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <Divider />
                        </Grid>
                    </Grid>
                </>
            }
            <Grid item xs={12}>
                <Collapse in={!collapse}>
                    <Grid container direction="column" spacing={1}>
                        <Grid item>
                            <StyledButton
                                fullWidth
                                extendedOnly
                                style={{
                                    backgroundColor: "#fff",
                                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 2px 2px 0px, rgba(0, 0, 0, 0.24) 0px 0px 1px 0px"
                                }}
                                onClick={() => setCollapse(true)}
                            >
                                <CenterAlignChildren>
                                    <img src={BadanamuLogo} width={22} style={{ margin: 8, marginRight: 20 }} />
                                    <Typography variant="body2" style={{ color: "rgba(0,0,0,0.54)", fontWeight: 500 }}>
                                        Sign in with Badanamu
                                    </Typography>
                                </CenterAlignChildren>
                            </StyledButton>
                        </Grid>
                    </Grid>
                </Collapse>
                <Collapse in={collapse}>
                    <Grid item style={{ textAlign: "center", padding: 16 }}>
                        <img src={BadanamuLogo} width={72} />
                    </Grid>
                    <StyledTextField
                        autoComplete="email"
                        autoFocus
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
                    <Grid container justify="space-between" style={{ paddingTop: theme.spacing(1) }}>
                        <Grid item>
                            <Link
                                href="#"
                                variant="subtitle2"
                                onClick={(e: React.MouseEvent) => {
                                    window.open("https://pass.badanamu.net/#/password-forgot");
                                    e.preventDefault();
                                }}
                            >
                                <FormattedMessage id="login_forgotPassword" />
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link
                                href="#"
                                variant="subtitle2"
                                onClick={(e: React.MouseEvent) => {
                                    window.open("https://pass.badanamu.net/#/signup");
                                    e.preventDefault();
                                }}
                            >
                                <FormattedMessage id="login_createAccount" />
                            </Link>
                        </Grid>
                    </Grid>
                    <Grid container justify="space-between" style={{ padding: theme.spacing(1, 0) }}>
                        <Grid item xs={12} style={{ paddingTop: 0, paddingBottom: 0 }}>
                            <FormControlLabel
                                control={
                                    <StyledCheckbox
                                        checked={checked}
                                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                        inputProps={{ 'aria-label': 'policy-checkbox' }}
                                        onChange={() => setChecked(!checked)}
                                    />
                                }
                                label={<Typography variant="caption">I accept to the Kidsloop Privacy Policy</Typography>}
                            />
                            <Grid item xs={12}>
                                {checkmarkError === null ? null :
                                    <Typography align="left" color="error" variant="caption">
                                        {checkmarkError}
                                    </Typography>
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                    <StyledButton
                        disabled={inFlight}
                        fullWidth
                        onClick={() => login()}
                        size="medium"
                        style={{ marginTop: theme.spacing(1) }}
                        type="submit"
                    >
                        {
                            inFlight ?
                                <CircularProgress size={25} /> :
                                <FormattedMessage id="login_loginButton" />
                        }
                    </StyledButton>
                </Collapse>
            </Grid>
            <Grid item xs={12}>
                {generalError === null ? null :
                    <Typography align="left" color="error" variant="body2">
                        {generalError}
                    </Typography>
                }
            </Grid>
        </React.Fragment>
    );
}
