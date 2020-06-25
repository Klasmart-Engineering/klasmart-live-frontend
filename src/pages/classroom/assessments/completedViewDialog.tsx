import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { TransitionProps } from "@material-ui/core/transitions";
import AddIcon from "@material-ui/icons/Add";
import InfoIcon from '@material-ui/icons/Info';
import ErrorIcon from "@material-ui/icons/Error";
import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";

import DialogAppBar from "../../../components/styled/dialogAppBar";
import StyledFAB from "../../../components/styled/fabButton";
import StyledButton from "../../../components/styled/button";
import StyledTextField from "../../../components/styled/textfield";
import StyledComboBox from "../../../components/styled/combobox";
import { RestAPIError, RestAPIErrorType } from "../../../api/restapi_errors";
import {
    useRestAPI,
    CreateLearningOutcomeRequest,
    DevSkillResponse,
    SkillCatResponse
} from "./api/restapi";

interface Props {
    assId: string | undefined
    open: boolean
    onClose: any
}

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
        errorIcon: {
            fontSize: "1em",
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

export default function CompletedViewDialog(props: Props) {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <>
            <Dialog
                aria-labelledby="nav-menu-title"
                aria-describedby="nav-menu-description"
                fullScreen
                open={props.open}
                onClose={props.onClose}
                TransitionComponent={Motion}
            >
                <DialogAppBar
                    handleClose={props.onClose}
                    subtitleID={"assess_viewDialogTitle"}
                />
                <Grid
                    container
                    direction="row"
                    justify="space-around"
                    alignItems="stretch"
                    spacing={isMobile ? 1 : 3}
                    className={classes.menuContainer}
                >
                    {props.assId}
                </Grid>
            </Dialog>
        </>
    );
}
