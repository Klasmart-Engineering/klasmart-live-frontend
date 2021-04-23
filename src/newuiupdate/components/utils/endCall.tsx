import { LocalSessionContext } from "../../providers/providers";
import { classEndedState, classLeftState } from "../../states/layoutAtoms";
import { ParentCaptcha } from "./parentCaptcha";
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
import React,
{
    useContext,
    useEffect, useState,
} from "react";
import { useRecoilState } from "recoil";

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
    const classes = useStyles();
    const { isTeacher } = useContext(LocalSessionContext);

    const { open, onClose } = props;
    const [ classLeft, setClassLeft ] = useRecoilState(classLeftState);
    const [ showParentCaptcha, setShowParentCaptcha ] = useState(false);

    if(!isTeacher){
        useEffect(() => {
            setShowParentCaptcha(true);
        }, [ open ]);
    }

    return(
        <Dialog
            open={open}
            aria-labelledby="leave-class-dialog"
            maxWidth="xs"
            onClose={onClose}>
            <DialogTitle
                id="leave-class-dialog"
                className={classes.dialogTitle}>Leave Class</DialogTitle>
            <DialogContent className={classes.dialogContent}>
                {showParentCaptcha ?
                    <ParentCaptcha setShowParentCaptcha={setShowParentCaptcha} /> : (
                        <>
                            <div className={clsx(classes.dialogIcon, classes.warningIcon)}>
                                <WarningIcon size="2rem" />
                            </div>
                            <Typography>Leaving class will close the session window tab, close your camera and turn off your microphone</Typography>
                        </>
                    )}
            </DialogContent>

            <DialogActions>
                <Button
                    color="primary"
                    onClick={onClose}>Cancel</Button>
                {!showParentCaptcha && <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setClassLeft(true)}>Leave Class</Button>}
            </DialogActions>
        </Dialog>
    );
}
export { DialogLeaveClass };

function DialogEndClass (props:any){
    const classes = useStyles();
    const { open, onClose } = props;
    const [ classEnded, setClassEnded ] = useRecoilState(classEndedState);

    return(
        <Dialog
            open={open}
            aria-labelledby="end-class-dialog"
            maxWidth="xs"
            onClose={onClose}>
            <DialogTitle
                id="end-class-dialog"
                className={classes.dialogTitle}>End Class</DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <div className={clsx(classes.dialogIcon, classes.warningIcon)}>
                    <WarningIcon size="2rem" />
                </div>
                <Typography>Are you sure to end the class?</Typography>
                <Typography>Ending class will close the session window tab for all participants</Typography>
            </DialogContent>

            <DialogActions>
                <Button
                    color="primary"
                    onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setClassEnded(true)}>End Class</Button>
            </DialogActions>
        </Dialog>
    );
}
export { DialogEndClass };
