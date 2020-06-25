import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import { TransitionProps } from "@material-ui/core/transitions";
import React, { useState } from "react";
import DialogAppBar from "../../../components/dialogAppBar";
import StyledFAB from "../../../components/fabButton";

const useStyles = makeStyles((theme: Theme) =>
createStyles({
    appBar: {
        position: "relative",
    },
    menuContainer: {
        padding: theme.spacing(4, 5),
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(2, 2),
        },
    },
    title: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(1),
    },
}),
);

const Motion = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Grow style={{ transformOrigin: "0 0 0" }} ref={ref} {...props} />;
});

export default function CreateDialog() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <StyledFAB
                extendedOnly
                onClick={handleClickOpen}
                aria-label="create new lesson or material button"
            >
                + Create
            </StyledFAB>
            <Dialog
                aria-labelledby="nav-menu-title"
                aria-describedby="nav-menu-description"
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Motion}
            >
                <DialogAppBar
                    handleClose={handleClose}
                    subtitleID={"Create..."}
                />
                <Grid
                    container
                    direction="row"
                    justify="space-around"
                    alignItems="stretch"
                    className={classes.menuContainer}
                >
                    What are you creating today?
                </Grid>
            </Dialog>
        </>
    );
}
