import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import CenterAlignChildren from "../../../../../components/centerAlignChildren";
import StyledButton from "../../../../../components/styled/button";
import StyledTextField from "../../../../../components/styled/textfield";
import { IUserContext } from "../app";
import KidsloopLogo from "../assets/img/kidsloop.svg";

const useStyles = makeStyles((theme: Theme) =>
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
            height: 500,
            width: "40%",
            padding: theme.spacing(4, 5),
            [theme.breakpoints.down("sm")]: {
                backgroundPosition: "bottom right",
                height: `min(${window.innerHeight - 20}px,56vw)`,
                padding: theme.spacing(2, 2),
                width: "50%",
            },
            [theme.breakpoints.down("xs")]: {
                height: `min(${window.innerHeight - 20}px,72vw)`,
                width: "100%",
            },
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
            direction="row"
            justify="space-between"
            alignItems="center"
            className={ classes.pageWrapper }
        >
            <Grid item xs={12}>
                <CenterAlignChildren>
                    <img alt="KidsLoop" src={KidsloopLogo} height="50px" />
                    <Typography variant="h6" style={{ paddingLeft: theme.spacing(1) }}>
                            Live
                    </Typography>
                </CenterAlignChildren>
            </Grid>
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
                    size="large"
                    onClick={(e) => {
                        setUserContext({
                            name: user,
                            roomId: room ? room : uuid(),
                            teacher: !room,
                        });
                    }}
                >
                    { room ? "Join Room" : "Create Room"}
                </StyledButton>
            </Grid>
        </Grid>
    );
}

