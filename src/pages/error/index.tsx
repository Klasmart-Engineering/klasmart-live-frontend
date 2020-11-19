import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import StyledButton from "../../components/styled/button";
import KidsloopIcon from "../../assets/img/kidsloop_icon.svg";
import Error1 from "../../assets/img/error/1.png";
import Error2 from "../../assets/img/error/2.png";
import Error3 from "../../assets/img/error/3.png";
import Error4 from "../../assets/img/error/4.png";

const ERROR_IMAGES = [Error1, Error2, Error3, Error4];
export const DESCRIPTION_403 = "Please check if your organization is not created or selected."

const useStyles = makeStyles((theme) => createStyles({
    pageWrapper: {
        display: "flex",
        flexGrow: 1,
        height: "100vh"
    },
    card: {
        alignItems: "center",
        display: "flex",
        padding: "48px 40px !important",
    },
    link: {
        textAlign: "center",
    },
}),
);

type ErrorCode = "400" | "401" | "403" | "404" | "500" | string;

interface FallbackProps {
    titleMsgId: string;
    subtitleMsgId?: string;
    descriptionMsgId?: string;
    errCode?: ErrorCode;
}

// TODO: Mapping description by errCode
export function Fallback({ titleMsgId, subtitleMsgId, descriptionMsgId, errCode }: FallbackProps) {
    const classes = useStyles();
    const [shouldSignOut, setShouldSignOut] = useState<boolean>(false);
    const [buttonText, setButtonText] = useState<JSX.Element>(<FormattedMessage id="err_button_home" />);

    useEffect(() => {
        if (errCode === "401") {
            setButtonText(<FormattedMessage id="err_button_signin" />)
        } else if (errCode === "403") {
            setShouldSignOut(true)
            setButtonText(<FormattedMessage id="err_button_confirm" />)
        }
    }, [])

    async function handleSignOut() {
        try {
            const headers = new Headers();
            headers.append("Accept", "application/json");
            headers.append("Content-Type", "application/json");
            await fetch("https://auth.kidsloop.net/signout", {
                credentials: "include",
                headers,
                method: "GET",
            })
                .then(() => {
                    location.href = "/";
                });
        } catch (e) {
            console.error("Fail to handleSignOut: ", e);
        }
    }

    const handleClick = () => {
        if (!shouldSignOut) {
            if (errCode === "401") {
                location.href = "/auth"
            }
            location.href = "/"
        } else {
            console.log("Call signout")
            handleSignOut();
        }
    }

    return (
        <Grid
            container
            direction="column"
            justify="space-around"
            alignItems="center"
            className={classes.pageWrapper}
        >
            <Container maxWidth="xs">
                <Card>
                    <CardContent className={classes.card}>
                        <Grid container direction="row" justify="center" alignItems="center" spacing={4}>
                            <Grid item xs={12} style={{ textAlign: "center" }}>
                                <img alt="KidsLoop Logo" src={KidsloopIcon} height="50px" />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h4" align="center">
                                    <FormattedMessage id={titleMsgId} />
                                </Typography>
                                {subtitleMsgId ? (
                                    <Typography variant="h6" align="center">
                                        <FormattedMessage id={subtitleMsgId} />
                                    </Typography>
                                ) : null}
                                <br />
                                {descriptionMsgId ? (
                                    <Typography variant="body2" align="center">
                                        <FormattedMessage id={descriptionMsgId} />
                                    </Typography>) : null}
                            </Grid>
                            <Grid item xs={12} style={{ textAlign: "center" }}>
                                <img src={ERROR_IMAGES[((Math.floor(Math.random() * 10)) % ERROR_IMAGES.length)]} width={250} height={250} />
                            </Grid>
                            <Grid item xs={12} className={classes.link}>
                                <StyledButton
                                    extendedOnly
                                    size="medium"
                                    type="submit"
                                    onClick={handleClick}
                                >
                                    <Typography variant="button">
                                        {buttonText}
                                        {/* {shouldSignOut ? <FormattedMessage id="err_button_confirm" /> : <FormattedMessage id="err_button_home" />} */}
                                    </Typography>
                                </StyledButton>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Container>
        </Grid>
    );
}
