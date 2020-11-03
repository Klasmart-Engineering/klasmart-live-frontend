import * as React from "react";
import { useHistory } from "react-router";
import { FormattedMessage } from "react-intl";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import StyledButton from "../../components/styled/button";
import KidsloopIcon from "../../assets/img/kidsloop_icon.svg";
import Error2 from "../../assets/img/error/2.png";

const useStyles = makeStyles((theme) => createStyles({
    pageWrapper: {
        display: "flex",
        flexGrow: 1,
        height: "100vh",
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

export function Error({ errCode }: { errCode?: number | string }) {
    const classes = useStyles();
    const code = errCode === undefined ? "500" :
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
                                    <FormattedMessage id={`err_${code}_description`} />
                                </Typography>
                            </Grid>
                            <Grid item xs={12} style={{ textAlign: "center" }}>
                                <img src={Error2} width={250} height={250} />
                            </Grid>
                            <Grid item xs={12} className={classes.link}>
                                <StyledButton
                                    extendedOnly
                                    size="medium"
                                    type="submit"
                                    onClick={() => { location.href = "/" }} // TODO: Decide which link to go to
                                >
                                    HOME
                                </StyledButton>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Container>
        </Grid>
    );
}
