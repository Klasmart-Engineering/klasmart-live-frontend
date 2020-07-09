import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import CenterAlignChildren from "../../../../../components/centerAlignChildren";
import StyledButton from "../../../../../components/styled/button";
import StyledTextField from "../../../../../components/styled/textfield";
import { IUserContext } from "../app";
import KidsloopLogo from "../assets/img/kidsloop.svg";

const useStyles = makeStyles(() =>
    createStyles({
        card: {
            alignItems: "center",
            display: "flex",
            padding: "48px 40px !important",
        },
        container: {
            margin: "auto 0",
        },
        formContainer: {
            width: "100%",
        },
        pageWrapper: {
            display: "flex",
            flexGrow: 1,
            height: "100vh",
        },
    }),
);

interface Props {
    setUserContext: (userContext: IUserContext) => any;
}

export function Join({setUserContext}: Props): JSX.Element {
    const classes = useStyles();
    const theme = useTheme();

    const [user, setUser] = useState<string>("");
    const room = useMemo(() => {
        const url = new URL(window.location.href);
        return url.searchParams.get("room");
    }, [window.location.href]);

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
                                <CenterAlignChildren>
                                    <img alt="KidsLoop" src={KidsloopLogo} height="50px" />
                                    <Typography variant="h6" style={{ paddingLeft: theme.spacing(1) }}>
                                        Live
                                    </Typography>
                                </CenterAlignChildren>
                            </Grid>
                            <Grid item xs={12} className={classes.formContainer}>
                                <form onSubmit={(e) => { e.preventDefault(); setUserContext({roomId: room ? room : uuid(), teacher: !room, name: user}); }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <StyledTextField
                                                required
                                                fullWidth
                                                value={user}
                                                label={"Name"}
                                                onChange={(e) => setUser(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <StyledButton
                                                fullWidth
                                                type="submit"
                                                size="large"
                                            >
                                                <Typography>
                                                    { room ? "Join Room" : "Create Room"}
                                                </Typography>
                                            </StyledButton>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Container>
        </Grid>
    );
}
