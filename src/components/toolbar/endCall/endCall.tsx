/* eslint-disable react/no-multi-comp */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import { ParentalGateHorizontal } from "@/app/dialogs/parentalGateHorizontal";
import { dialogsState } from "@/app/model/appModel";
import { ParentCaptcha } from "@/components/parentCaptcha";
import { useEndClassMutation } from "@/data/live/mutations/useEndClassMutation";
import { useLeaveClassMutation } from "@/data/live/mutations/useLeaveClassMutation";
import { useSessionContext } from "@/providers/session-context";
import { classLeftState } from "@/store/layoutAtoms";
import { useWebrtcCloseCallback } from "@kl-engineering/live-state/ui";
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
    useEffect,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";
import {
    useRecoilState,
    useSetRecoilState,
} from "recoil";

const MIN_HEIGHT_DIALOG_SMALL = 317;
const MIN_WIDTH_DIALOG_SMALL = 396;
const MIN_WIDTH_DIALOG_MEDIUM = 508;
const MIN_HEIGHT_DIALOG_MEDIUM = 344;

const useStyles = makeStyles((theme: Theme) => ({
    dialogTitle: {
        textAlign: `center`,
    },
    dialogContent: {
        textAlign: `center`,
    },
    dialogIcon: {
        display: `inline-block`,
        background: theme.palette.grey[200],
        borderRadius: 40,
        padding: 20,
        marginBottom: 20,
    },
    warningIcon: {
        color: `#ffca00`,
        background: `#f9f7e8`,
    },
    parentChecker: {
        marginTop: 20,
        marginBottom: 20,
    },
    parentCheckerItem: {
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
    parentCheckerItemActive: {
        opacity: 0.4,
    },
    error: {
        color: red[500],
    },
    container: {
        borderRadius: theme.spacing(2.5),
        minHeight: MIN_HEIGHT_DIALOG_SMALL,
        minWidth: MIN_WIDTH_DIALOG_SMALL,
        [theme.breakpoints.up(`md`)]: {
            minWidth: MIN_WIDTH_DIALOG_MEDIUM,
            minHeight: MIN_HEIGHT_DIALOG_MEDIUM,
        },
    },
}));

function DialogLeaveClass (props: any){
    const DIALOG_LEAVE_CLASS_ID = `dialogLeaveCLassID`;
    const classes = useStyles();
    const { open, onClose } = props;
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
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
            PaperProps={{
                className: classes.container,
            }}
            onClose={onClose}
        >
            <ParentalGateHorizontal
                setClosedDialog={onClose}
                onCompleted={() => {
                    onClose();
                }}
            />
        </Dialog>
    );
}
export { DialogLeaveClass };

function DialogEndClass (props: any){
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
            onClose={onClose}
        >
            <DialogTitle
                id="end-class-dialog"
                className={classes.dialogTitle}
            >
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
                    onClick={onClose}
                >
                    <FormattedMessage id="common_cancel" />
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onClick}
                >
                    <FormattedMessage id="end_class" />
                </Button>
            </DialogActions>
        </Dialog>
    );
}
export { DialogEndClass };
