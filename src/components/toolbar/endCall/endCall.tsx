import {
    LIVE_LINK,
    LocalSessionContext,
} from "../../../providers/providers";
import {  classLeftState } from "../../../store/layoutAtoms";
import {
    MUTATION_ENDCLASS,
    MUTATION_LEAVECLASS,
} from "../../../utils/graphql";
import { ParentCaptcha } from "../../parentCaptcha";
import { useMutation } from "@apollo/client";
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
import { useToolbarContext } from "kidsloop-canvas/lib/components/toolbar/toolbar-context-provider";
import React,
{
    useContext,
    useEffect,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";
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
    const { open, onClose } = props;

    const { isTeacher, sessionId } = useContext(LocalSessionContext);
    const [ classLeft, setClassLeft ] = useRecoilState(classLeftState);
    const [ showParentCaptcha, setShowParentCaptcha ] = useState(false);

    const { actions: { clear } } = useToolbarContext();

    if(!isTeacher){
        useEffect(() => {
            setShowParentCaptcha(true);
        }, [ open ]);
    }

    const [ leaveClass ] = useMutation(MUTATION_LEAVECLASS, {
        context: {
            target: LIVE_LINK,
        },
    });
    const onClick = async () => {
        clear([ sessionId ]);
        await leaveClass();
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
                    onClick={() => onClick()}>
                    <FormattedMessage id="leave_class" />
                </Button>}
            </DialogActions>
        </Dialog>
    );
}
export { DialogLeaveClass };

function DialogEndClass (props:any){
    const classes = useStyles();
    const { open, onClose } = props;

    const [ endClass ] = useMutation(MUTATION_ENDCLASS, {
        context: {
            target: LIVE_LINK,
        },
    });

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
                    onClick={() => endClass() }>
                    <FormattedMessage id="end_class" />
                </Button>
            </DialogActions>
        </Dialog>
    );
}
export { DialogEndClass };
