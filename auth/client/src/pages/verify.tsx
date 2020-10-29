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
import { RouteComponentProps, useHistory } from "react-router";
import * as restApi from "../restapi";
import { RestAPIError, RestAPIErrorType } from "../restapi_errors";
import CenterAlignChildren from "../components/centerAlignChildren";
import PolicyLink from "../components/policyLinks";
import StyledButton from "../components/button";
import StyledTextField from "../components/textfield";
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login";
import Divider from '@material-ui/core/Divider';
import useTheme from "@material-ui/core/styles/useTheme";
import LanguageSelect from "../components/languageSelect";

import KidsloopIcon from "../../assets/img/kidsloop_icon.svg";
import { getIdentityType, IdentityType } from "../utils/accountType";

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
        justifyContent: "center",
        width: "100%",
        fontFamily: "inherit !important",
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

export function Verify() {
    const classes = useStyles();
    const theme = useTheme();

    const [inFlight, setInFlight] = useState(false);

    const url = new URL(window.location.href);
    const identityParam = url.searchParams.get("id");
    let deviceFromIdentity = "";
    if (!identityParam) {
        // Display textfield to enter identity
    } else {
        deviceFromIdentity = getIdentityType(identityParam) ? "phone" : "email";
    }

    const [identity, setIdentity] = useState(identityParam);
    const [verificationCode, setVerificationCode] = useState("");
    const [verificationError, setVerificationError] = useState<JSX.Element | null>(null);
    const [generalError, setGeneralError] = useState<JSX.Element | null>(null);

    const history = useHistory();

    async function verify() {
        setVerificationError(null);
        if (inFlight) { return; }

        try {
            setInFlight(true);
            if (verificationCode === "") { throw new Error("EMPTY_VERIFICATION_CODE"); }
            // const token = await restApi.verify(verificationCode);
            // await transferLogin(token);
        } catch (e) {
            handleError(e);
        } finally {
            setInFlight(false);
        }
        return;
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
            if (e.toString().search("EMPTY_VERIFICATION_CODE") !== -1) {
                setVerificationError(
                    <span style={{ display: "flex", alignItems: "center" }}>
                        <ErrorIcon className={classes.errorIcon} />
                        <FormattedMessage 
                            id="error_emptyVerificationCode"
                            values={{
                                device: deviceFromIdentity,
                            }}
                        />
                    </span>,
                );
            } else {
                console.error(e);
            }
            return;
        }
        // const id = e.getErrorMessageID();
        // const errorMessage = <FormattedMessage id={id} />;
        // switch (e.getErrorMessageType()) {
        //     case RestAPIErrorType.INVALID_LOGIN:
        //         setVerif(errorMessage);
        //         break;
        //     case RestAPIErrorType.INVALID_PASSWORD:
        //         setPasswordError(errorMessage);
        //         break;
        //     case RestAPIErrorType.EMAIL_NOT_VERIFIED:
        //         history.push("/verify-email");
        //         break;
        //     case RestAPIErrorType.EMAIL_NOT_VERIFIED:
        //         history.push("/verify-phone");
        //         break;
        //     case RestAPIErrorType.ACCOUNT_BANNED:
        //     default:
        //         setGeneralError(errorMessage);
        //         break;
        // }
    }

    return (
        <React.Fragment>
            <Grid item xs={12}>
                <Typography variant="h4">
                    <FormattedMessage id={"verify_verifyPrompt"} />
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <StyledTextField
                    error={verificationError !== null}
                    fullWidth
                    helperText={verificationError}
                    id="verification-code-input"
                    label={<FormattedMessage id="form_verificationLabel" />}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    value={verificationCode}
                />
            </Grid>
            <Grid item xs={6}>
                <Link
                    href="#"
                    variant="subtitle2"
                    onClick={(e: React.MouseEvent) => { history.push("/signup"); e.preventDefault(); }}
                >
                    <FormattedMessage id="verify_backButton" />
                </Link>
            </Grid>
            <Grid item xs={6} className={classes.link}>
                <StyledButton
                    disabled={inFlight}
                    onClick={() => verify()}
                    size="medium"
                    type="submit"
                >
                    {
                        inFlight ?
                            <CircularProgress size={25} /> :
                            <FormattedMessage id="verify_verifyButton" />
                    }
                </StyledButton>
            </Grid>
            <Grid item xs={12}>
                { generalError === null ? null :
                        <Typography align="left" color="error" variant="body2">
                            {generalError}
                        </Typography>
                }
            </Grid>
        </React.Fragment>
    );
}
