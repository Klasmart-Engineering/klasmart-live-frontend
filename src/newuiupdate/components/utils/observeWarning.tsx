import { LocalSessionContext } from "../../providers/providers";
import { observeContentState, observeWarningState } from "../../states/layoutAtoms";
import {
    Checkbox,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import { Warning as WarningIcon } from "@styled-icons/entypo/Warning";
import clsx from "clsx";
import React,
{
    useContext,
    useEffect, useState,
} from "react";
import { FormattedMessage } from "react-intl";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    dialogTitle: {
        paddingBottom: `0`,
        "& h2": {
            width: `100%`,
            display: `flex`,
            alignItems: `center`,
            justifyContent: `center`,
        }
    },
    dialogContent: {
        textAlign: `center`,
    },
    dialogIcon: {
        background: "transparent !important",
        marginRight: 5,
        lineHeight: 0,
    },
    warningIcon: {
        color: `#ffca00`,
        background: `#f9f7e8`,
    },
    dialogActions: {
        flexWrap: `wrap`,
    },
    buttonWrap: {
        width: `100%`,
        textAlign: `center`,
    },
    buttonOk: {
        marginLeft: `10px`,
    },
    checkWrap: {
        display: `flex`,
        alignItems: `center`,
        width: `100%`,
        textAlign: `left`,
    },
}));

function ObserveWarning (props:any){
    const classes = useStyles();
    const { open, onClose } = props;

    const { isTeacher } = useContext(LocalSessionContext);
    const [ observeContent, setObserveContent ] = useRecoilState(observeContentState);
    const [ observeOpen, setObserveOpen ] = useRecoilState(observeWarningState);

    const doNotShowAgain = (event:any) => {
        if(event.target.checked) {
            localStorage.setItem('ObserveWarning', 'false');
        } else {
            localStorage.setItem('ObserveWarning', 'true');
        }
    }

    const onClick = () => {
        setObserveOpen(false);
        setObserveContent(!observeContent);
        console.log('observeWarning Clicked', observeContent);
    };

    useEffect(() => {
        setObserveContent(observeContent);
        console.log('observeWarning Opened', observeContent);
    }, [ observeOpen ]);

    return(
        <Dialog
            open={open}
            aria-labelledby="leave-class-dialog"
            maxWidth="xs"
            onClose={onClose}>
            <DialogTitle
                id="leave-class-dialog"
                className={classes.dialogTitle}>
                <div className={clsx(classes.dialogIcon, classes.warningIcon)}>
                    <WarningIcon size="1rem" />
                </div>
                <FormattedMessage id="observe_warning_videotype" />
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <Typography>
                    <FormattedMessage id="observe_warning_videotype_text" />
                </Typography>
            </DialogContent>

            <DialogActions className={classes.dialogActions}>
                <div className={classes.buttonWrap}>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="medium"
                        onClick={onClose}>
                        <FormattedMessage id="common_cancel" />
                    </Button>
                    <Button
                        className={classes.buttonOk}
                        variant="contained"
                        color="primary"
                        size="medium"
                        onClick={() => onClick()}>
                        <FormattedMessage id="common_ok" />
                    </Button>
                </div>
                <div className={classes.checkWrap}>
                    <Checkbox
                        color="primary"
                        size="small"
                        onChange={(event) => doNotShowAgain(event)}
                    ></Checkbox>
                    <Typography variant="body2">
                        <FormattedMessage id="common_do_not_show_again" />
                    </Typography>
                </div>
            </DialogActions>
        </Dialog>
    );
}
export default ObserveWarning;
