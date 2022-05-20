import KidsloopLogo from "@/assets/img/kidsloop.svg";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { Theme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import { Close as CloseIcon } from "@styled-icons/material/Close";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            position: `relative`,
        },
        title: {
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(1),
        },
    }));

interface Props {
    handleClose: () => void;
    subtitleID: string;
    toolbarBtn?: React.ReactNode;
}

export default function DialogAppBar (props: Props) {
    const classes = useStyles();
    const {
        handleClose,
        subtitleID,
        toolbarBtn,
    } = props;

    return (<>
        <AppBar
            color="inherit"
            className={classes.appBar}
        >
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="close"
                    size="large"
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>
                <Grid
                    container
                    item
                    wrap="nowrap"
                >
                    <img
                        alt="kidsloop logo"
                        className={classes.title}
                        src={KidsloopLogo}
                        height={32}
                    />
                    <Typography
                        id="nav-menu-title"
                        variant="h6"
                    >
                        for Organizations
                    </Typography>
                </Grid>
                { toolbarBtn ? toolbarBtn : null }
            </Toolbar>
        </AppBar>
        <Grid
            container
            direction="row"
        >
            <Paper
                square
                style={{
                    flex: 1,
                    height: `100%`,
                }}
            >
                <Toolbar variant="dense">
                    <Typography
                        id="nav-menu-description"
                        variant="body2"
                    >
                        <FormattedMessage id={subtitleID} />
                    </Typography>
                </Toolbar>
            </Paper>
        </Grid>
    </>);
}
