import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router";
import KidsloopButton from "../../../components/styled/fabButton";

const useStyles = makeStyles((theme) => createStyles({
    card: {
        alignItems: "center",
        display: "flex",
        padding: "48px 40px !important",
    },
}),
);

export function PasswordChanged() {
    const history = useHistory();
    const classes = useStyles();

    return (
        <Container maxWidth="sm" style={{ margin: "auto 0" }}>
            <Card>
                <CardContent className={classes.card}>
                    <Grid container justify="center" spacing={4}>
                        <Grid item xs={12}>
                            <Typography variant="h5" align="center">
                                <FormattedMessage id="password_changed" />
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <KidsloopButton
                                onClick={() => {
                                    history.push("/my-account");
                                }}
                            >
                                <FormattedMessage id="thank_you_go_to_dashboard" />
                            </KidsloopButton>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
}
