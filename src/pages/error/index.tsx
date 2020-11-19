import * as React from "react";
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

// TODO: Mapping description by errCode
export function Error({ errCode, description }: { errCode: string | number | null, description?: string }) {
    const classes = useStyles();
    const code = errCode === null ? "500" :
        (typeof errCode === "number" ? errCode.toString() : errCode);

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
                                    {code + " "}<FormattedMessage id={`err_${code}_title`} />
                                </Typography>
                                <Typography variant="h6" align="center">
                                    <FormattedMessage id={`err_${code}_subtitle`} />
                                </Typography><br />
                                {description ? <Typography variant="body2" align="center">{description}</Typography> : null}
                            </Grid>
                            <Grid item xs={12} style={{ textAlign: "center" }}>
                                <img src={ERROR_IMAGES[((Math.floor(Math.random() * 10)) % ERROR_IMAGES.length)]} width={250} height={250} />
                            </Grid>
                            <Grid item xs={12} className={classes.link}>
                                <StyledButton
                                    extendedOnly
                                    size="medium"
                                    type="submit"
                                    onClick={() => { location.href = "/" }} // TODO: Decide which link to go to
                                >
                                    BACK
                                </StyledButton>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Container>
        </Grid>
    );
}
