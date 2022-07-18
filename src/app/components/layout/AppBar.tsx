import KidsloopLogo from "@/assets/img/kidsloop_icon.svg";
import {
    THEME_COLOR_BACKGROUND_PAPER,
    THEME_COLOR_ORG_MENU_DRAWER,
} from "@/config";
import {
    AppBar as MUIAppBar,
    createStyles,
    Grid,
    makeStyles,
    Toolbar,
    Typography,
} from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    roundedAppbar: {
        backgroundColor: THEME_COLOR_ORG_MENU_DRAWER,
        borderBottomLeftRadius: theme.spacing(3),
        height: theme.spacing(8),
        fontWeight: theme.typography.fontWeightBold as number,
        color: THEME_COLOR_BACKGROUND_PAPER,
        [theme.breakpoints.up(`sm`)]: {
            height: theme.spacing(12),
        },
        "& $titleInAppBar": {
            fontSize: `1.375rem`,
        },
        "& $toolbar": {
            padding: theme.spacing(0, 1),
        },
    },
    centeredLogo: {
        textAlign: `center`,
        zIndex: -1,
        width: `100%`,
        left: `0`,
    },
    toolbar: {
        margin: theme.spacing(0, 0.5, 1, 0.5),
        flex: `1`,
        alignItems: `flex-end`,
        [theme.breakpoints.up(`md`)]: {
            margin: theme.spacing(0, 0.5, 1.5, 0.5),
        },
    },
    title: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(4),
        flex: 0,
    },
    titleInAppBar: {
        fontWeight: theme.typography.fontWeightBold as number,
        fontSize: `1rem`,
        lineHeight: 1.3,
    },
}));

export enum AppBarStyle {
    DEFAULT,
    ROUNDED,
}

interface Props {
    title?: string;
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
    style?: AppBarStyle;
}

export default function AppBar (props: Props) {
    const {
        title,
        leading,
        trailing,
        style = AppBarStyle.DEFAULT,
    } = props;
    const classes = useStyles();

    return (
        <div className={clsx({
            [classes.root]: style === AppBarStyle.DEFAULT,
        })}
        >
            <MUIAppBar
                position="sticky"
                elevation={0}
                className={clsx({
                    [classes.roundedAppbar]: style === AppBarStyle.ROUNDED,
                })}
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
                                {title ?
                                    <Typography
                                        variant="subtitle1"
                                        align="center"
                                        className={classes.titleInAppBar}
                                    >
                                        {title}
                                    </Typography>:
                                    <img
                                        alt="KidsLoop Logo"
                                        src={KidsloopLogo}
                                        height={32}
                                    />}
                            </Grid>
                            <Grid item>{trailing}</Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            </MUIAppBar>
        </div>
    );
}
