import { useCordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import { ParentCaptcha } from "@/components/parentCaptcha";
import { useEndClassMutation } from "@/data/live/mutations/useEndClassMutation";
import { useLeaveClassMutation } from "@/data/live/mutations/useLeaveClassMutation";
import { useSessionContext } from "@/providers/session-context";
import {  classLeftState } from "@/store/layoutAtoms";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import { Warning as WarningIcon } from "@styled-icons/entypo/Warning";
import clsx from "clsx";
import { useWebrtcCloseCallback } from "@kl-engineering/live-state/ui";
import React,
{
    useEffect,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";
import { useSetRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    dialogTitle:{
        textAlign: `center`,
    },
    dialogContent:{
        textAlign: `center`,
    },
    dialogIcon:{
        display: `inline-block`,
        background: theme.palette.grey[200],
        borderRadius: 40,
        padding: 20,
        marginBottom: 20,
    },
    warningIcon:{
        color: `#ffca00`,
        background: `#f9f7e8`,
    },
    parentChecker:{
        marginTop: 20,
        marginBottom: 20,
    },
    parentCheckerItem:{
        color: `#fff`,
        width: 50,
        height: 50,
        background: `#252961`,
        justifyContent: `center`,
        display: `flex`,
        alignItems: `center`,
        borderRadius: 50,
        fontSize: `1.5rem`,
        cursor: `pointer`,
        margin: `0 10px`,
    },
    parentCheckerItemActive:{
        opacity: 0.4,
    },
    error: {
        color: red[500],
    },
}));

function DialogLeaveClass (props:any){
    const DIALOG_LEAVE_CLASS_ID = `dialogLeaveCLassID`;
    const classes = useStyles();
    const { open, onClose } = props;

    const { addOnBack, removeOnBack } = useCordovaSystemContext();
    const { isTeacher } = useSessionContext();
    const setClassLeft = useSetRecoilState(classLeftState);
    const [ showParentCaptcha, setShowParentCaptcha ] = useState(false);

    useEffect(() => {
        if(open) {
            addOnBack?.({
                id: DIALOG_LEAVE_CLASS_ID,
                onBack: onClose,
            });
        }else {
            removeOnBack?.(DIALOG_LEAVE_CLASS_ID);
        }
    }, [ open ]);

    if(!isTeacher){
        useEffect(() => {
            setShowParentCaptcha(true);
        }, [ open ]);
    }

    const closeConference = useWebrtcCloseCallback();
    const [ leaveClass ] = useLeaveClassMutation();
    const onClick = async () => {
        await Promise.allSettled([ leaveClass(), closeConference.execute() ]);
        setClassLeft(true);
    };

    return(
        <Dialog
            open={open}
            aria-labelledby="leave-class-dialog"
            maxWidth="xs"
            onClose={onClose}>
            <DialogTitle
                id="leave-class-dialog"
                className={classes.dialogTitle}>
                <FormattedMessage id="leave_class" />
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                {showParentCaptcha ?
                    <ParentCaptcha setShowParentCaptcha={setShowParentCaptcha} /> : (
                        <>
                            <div className={clsx(classes.dialogIcon, classes.warningIcon)}>
                                <WarningIcon size="2rem" />
                            </div>
                            <Typography>
                                <FormattedMessage id="leave_class_description" />
                            </Typography>
                        </>
                    )}
            </DialogContent>

            <DialogActions>
                <Button
                    color="primary"
                    onClick={onClose}>
                    <FormattedMessage id="common_cancel" />
                </Button>
                {!showParentCaptcha && <Button
                    variant="contained"
                    color="primary"
                    onClick={onClick}>
                    <FormattedMessage id="leave_class" />
                </Button>}
            </DialogActions>
        </Dialog>
    );
}
export { DialogLeaveClass };

function DialogEndClass (props:any){
    const DIALOG_END_CLASS_ID = `dialogEndClassID`;
    const classes = useStyles();
    const { open, onClose } = props;
    const { addOnBack, removeOnBack } = useCordovaSystemContext();

    const [ endClass ] = useEndClassMutation();
    const closeConference = useWebrtcCloseCallback();

    useEffect(() => {
        if(open) {
            addOnBack?.({
                id: DIALOG_END_CLASS_ID,
                onBack: onClose,
            });
        }else {
            removeOnBack?.(DIALOG_END_CLASS_ID);
        }
    }, [ open ]);

    const onClick = () => Promise.allSettled([ endClass(), closeConference.execute() ]);

    return(
        <Dialog
            open={open}
            aria-labelledby="end-class-dialog"
            maxWidth="xs"
            onClose={onClose}>
            <DialogTitle
                id="end-class-dialog"
                className={classes.dialogTitle}>
                <FormattedMessage id="end_class" />
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <div className={clsx(classes.dialogIcon, classes.warningIcon)}>
                    <WarningIcon size="2rem" />
                </div>
                <Typography><FormattedMessage id="end_class_confirm" /></Typography>
                <Typography><FormattedMessage id="end_class_description" /></Typography>
            </DialogContent>

            <DialogActions>
                <Button
                    color="primary"
                    onClick={onClose}>
                    <FormattedMessage id="common_cancel" />
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onClick}>
                    <FormattedMessage id="end_class" />
                </Button>
            </DialogActions>
        </Dialog>
    );
}
export { DialogEndClass };
