import { LocalSessionContext } from "../../providers/providers";
import {
    observeContentState,
    observeWarningState,
} from "../../states/layoutAtoms";
import {
    Button,
    Checkbox,
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
    useEffect,
} from "react";
import { FormattedMessage } from "react-intl";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    dialogTitle: {
        "& h2": {
            width: `100%`,
            display: `flex`,
            alignItems: `center`,
            justifyContent: `center`,
        },
    },
    dialogContent: {
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
    dialogActions: {
        flexWrap: `wrap`,
    },
    buttonWrap: {
        marginLeft: `auto`,
    },
    buttonOk: {
        marginLeft: `10px`,
    },
    checkWrap: {
        display: `flex`,
        alignItems: `center`,
        marginRight: `auto`,
    },
}));

function ObserveWarning (props:any){
    const classes = useStyles();
    const {
        open,
        onClose,
        onConfirm,
    } = props;

    const { isTeacher } = useContext(LocalSessionContext);
    const [ observeContent, setObserveContent ] = useRecoilState(observeContentState);
    const [ observeOpen, setObserveOpen ] = useRecoilState(observeWarningState);

    const doNotShowAgain = (event:any) => {
        if(event.target.checked) {
            localStorage.setItem(`ObserveWarning`, `false`);
        } else {
            localStorage.setItem(`ObserveWarning`, `true`);
        }
    };

    /*
    const onClick = () => {
        setObserveOpen(false);
        setObserveContent(!observeContent);
        console.log(`observeWarning Clicked`, observeContent);
    };
    */

    useEffect(() => {
        setObserveContent(observeContent);
        console.log(`observeWarning Opened`, observeContent);
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
                <FormattedMessage id="common_warning" />
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <div className={clsx(classes.dialogIcon, classes.warningIcon)}>
                    <WarningIcon size="2rem" />
                </div>
                <Typography>
                    <FormattedMessage id="observe_warning_videotype_text" />
                </Typography>
            </DialogContent>

            <DialogActions className={classes.dialogActions}>
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
                <div className={classes.buttonWrap}>
                    <Button
                        color="primary"
                        onClick={onClose}>
                        <FormattedMessage id="common_cancel" />
                    </Button>
                    <Button
                        className={classes.buttonOk}
                        variant="contained"
                        color="primary"
                        onClick={onConfirm}>
                        <FormattedMessage id="common_ok" />
                    </Button>
                </div>
            </DialogActions>
        </Dialog>
    );
}
export default ObserveWarning;
