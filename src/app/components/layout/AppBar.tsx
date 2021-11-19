import KidsloopLogo from "@/assets/img/kidsloop_icon.svg";
import {
    AppBar as MUIAppBar,
    createStyles,
    Grid,
    makeStyles,
    Toolbar,
    Typography,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    centeredLogo:{
        position: `absolute`,
        textAlign: `center`,
        zIndex: -1,
        width: `100%`,
        left: `0`,
    },
    toolbar: {
        padding: theme.spacing(0, 1),
    },
    title: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(4),
        flex: 0,
    },
}));

interface Props {
    title?: string;
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
}

export default function AppBar (props: Props) {
    const {
        title,
        leading,
        trailing,
    } = props;
    const classes = useStyles();

    return (
        <div>
            <MUIAppBar
                position="sticky"
                elevation={0}
                className={classes.root}
            >
                <Toolbar className={classes.toolbar}>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Grid
                            container
                            item
                            xs={12}
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            wrap="nowrap"
                        >
                            <Grid item>{leading}</Grid>
                            <Grid
                                item
                                className={classes.centeredLogo}
                            >
                                <img
                                    alt="KidsLoop Logo"
                                    src={KidsloopLogo}
                                    height={32}
                                />
                            </Grid>
                            <Grid item>{trailing}</Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            </MUIAppBar>
            {title && (
                <Grid
                    item
                    xs={12}
                    className={classes.title}
                >
                    <Typography
                        variant="h4"
                        align="center"
                    >
                        {title}
                    </Typography>
                </Grid>
            )}
        </div>
    );
}
