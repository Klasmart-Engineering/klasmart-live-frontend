import AppBar from "@/app/components/layout/AppBar";
import CloseButton from "@/app/components/layout/CloseButton";
import { CordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import { usePopupContext } from "@/app/context-provider/popup-context";
import {
    COMMENT_CHAR_LIMIT_MAX,
    COMMENT_CHAR_LIMIT_MIN,
} from "@/config";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Slide,
    TextField,
    Typography,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";
import { TransitionProps } from "@material-ui/core/transitions";
import React,
{
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles(() => createStyles({
    noPadding: {
        padding: 0,
    },
}));

const Transition = React.forwardRef((props: TransitionProps & { children?: React.ReactElement<any, any> }, ref: React.Ref<unknown>) => {
    return (
        <Slide
            ref={ref}
            direction="up"
            {...props}
        />
    );
});

const COMMENT_ON_BACK_ID = `commentOnBackID`;

interface Props {
    open: boolean;
    onClose: () => void;
    onSave: (comment: string) => void;
    comment?: string;
}

export default function CommentDialog (props: Props) {
    const {
        open,
        comment = ``,
        onClose,
        onSave,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const { showPopup } = usePopupContext();
    const { addOnBack, removeOnBack } = useContext(CordovaSystemContext);
    const [ newComment, setNewComment ] = useState(comment);
    const [ hasEditedComment, setHasEditedComment ] = useState(false);

    const isValidComment = useMemo(() => newComment.length >= COMMENT_CHAR_LIMIT_MIN && newComment.length <= COMMENT_CHAR_LIMIT_MAX, [ newComment ]);

    const addCommentDialogToBackQueue = () => {
        addOnBack?.({
            id: COMMENT_ON_BACK_ID,
            onBack: () => {
                onClose();
            },
        });
    };

    const initOnBack = () => {
        if (open) {
            addCommentDialogToBackQueue();
        } else {
            removeOnBack?.(COMMENT_ON_BACK_ID);
        }
    };

    useEffect(() => {
        if (!open) setHasEditedComment(false);
        setNewComment(comment);
        initOnBack();
    }, [ open, comment ]);

    const handleOnSave = () => {
        console.log(`handleOnSave`);
        onSave(newComment);
        onClose();
        setNewComment(``);
    };

    const handleOnCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(event.target.value);
        setHasEditedComment(true);
    };

    const handleConfirmClose = () => {
        setNewComment(``);
        onClose();
    };

    const handleOnCloseDialog = useCallback(() => {
        if (newComment === comment) {
            onClose();
            return;
        }
        showPopup({
            variant: `confirm`,
            title:intl.formatMessage({
                id: `homeFunStudy.discardChange.title`,
                defaultMessage: `Discard Changes?`,
            }),
            description:[
                intl.formatMessage({
                    id: `homeFunStudy.discardChange`,
                    defaultMessage: `Closing the window will discard any changes you have made.`,
                }),
            ],
            closeLabel:intl.formatMessage({
                id: `button_cancel`,
            }),
            confirmLabel:intl.formatMessage({
                id: `button_close`,
            }),
            onConfirm: handleConfirmClose,
            onClose: addCommentDialogToBackQueue,
        });
        onClose();
        setNewComment(``);
    }, [ newComment ]);

    return (
        <Dialog
            fullScreen
            open={open}
            TransitionComponent={Transition}
            onClose={onClose}
        >
            <DialogTitle className={classes.noPadding}>
                <AppBar
                    leading={(
                        <CloseButton onClick={handleOnCloseDialog} />
                    )}
                    title={comment
                        ? intl.formatMessage({
                            id: `button_edit_comment`,
                        })
                        : intl.formatMessage({
                            id: `button_add_comment`,
                        })
                    }
                    trailing={(
                        <Button
                            disabled={!isValidComment || !hasEditedComment}
                            color="primary"
                            onClick={handleOnSave}
                        >
                            {intl.formatMessage({
                                id: `button_save`,
                            })}
                        </Button>
                    )}
                />
            </DialogTitle>
            <DialogContent>
                <TextField
                    multiline
                    fullWidth
                    autoFocus
                    id="textField-comment"
                    placeholder={intl.formatMessage({
                        id: `home_fun_study_your_comment`,
                    })}
                    InputProps={{
                        disableUnderline: true,
                    }}
                    value={newComment}
                    onFocus={(event) => event.currentTarget.setSelectionRange(event.currentTarget.value.length, event.currentTarget.value.length)}
                    onChange={handleOnCommentChange}
                />
                <Box
                    display="flex"
                    justifyContent="flex-end"
                >
                    <Typography
                        variant="caption"
                        color="textSecondary"
                    >
                        {`${newComment.length}/${COMMENT_CHAR_LIMIT_MAX}`}
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
