import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slide,
    TextField,
    Typography
} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {createStyles, makeStyles, useTheme} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import {CloseIconButton} from "../../components/closeIconButton";
import {FormattedMessage, useIntl} from "react-intl";
import {isBlank} from "../../utils/StringUtils";
import {TransitionProps} from "@material-ui/core/transitions";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            flexGrow: 0,
            borderBottom: `1px solid ${theme.palette.divider}`
        },
        safeArea: {
            paddingLeft: "env(safe-area-inset-left)",
            paddingRight: "env(safe-area-inset-right)",
            backgroundColor: theme.palette.background.paper
        },
        noPadding: {
            padding: 0
        },
        underline: {
            "&&&:before": {
                borderBottom: "none"
            },
            "&&:after": {
                borderBottom: "none"
            }
        },
        countCharacter: {
            position: 'absolute',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
        },
    }),
)

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
    open: boolean,
    onClose: () => void,
    onSave: (newComment: string) => void,
    defaultComment?: string
}

const MINIMUM_CHARACTER = 10;
const MAXIMUM_CHARACTER = 100;

export function CommentDialog({open, onClose, defaultComment, onSave}: Props): JSX.Element {
    const classes = useStyles();
    const intl = useIntl();
    const [isEdit, setIsEdit] = useState(false);
    const [canSave, setCanSave] = useState(false);
    const [currentComment, setCurrentComment] = useState(defaultComment);

    useEffect(() => {
        if (defaultComment && !isBlank(defaultComment)) {
            setIsEdit(true);
        } else {
            setIsEdit(false);
        }

        setCurrentComment(defaultComment);
    }, [defaultComment])

    useEffect(() => {
        if (currentComment && currentComment.length >= MINIMUM_CHARACTER && currentComment.length <= MAXIMUM_CHARACTER) {
            setCanSave(true);
        } else {
            setCanSave(false);
        }
    }, [currentComment])

    function handleOnSave() {
        if (currentComment && currentComment.length >= MINIMUM_CHARACTER && currentComment.length <= MAXIMUM_CHARACTER)
            onSave(currentComment);
        else {
            //TODO: Alert invalid comment message
        }
    }

    function handleOnCommentChange(event: React.ChangeEvent<HTMLInputElement>) {
        setCurrentComment(event.target.value);
    }

    return (
        <Dialog fullScreen open={open} onClose={onClose}
                TransitionComponent={Transition}
        >
            <DialogTitle className={classes.noPadding}>
                <CommentHeader onClickClose={onClose} onClickSave={handleOnSave} isEdit={isEdit} canSave={canSave}/>
            </DialogTitle>
            <DialogContent>
                <TextField
                    id={"textField-comment"}
                    multiline
                    fullWidth
                    autoFocus
                    onChange={handleOnCommentChange}
                    placeholder={intl.formatMessage({id: "home_fun_study_your_comment"})}
                    InputProps={{classes: {underline: classes.underline}}}
                    value={currentComment}
                />
                <Box display="flex" justifyContent="flex-end">
                    <Typography variant={"caption"}
                                color={"textSecondary"}>{`${currentComment ? currentComment.length : 0}/${MAXIMUM_CHARACTER}`}</Typography>
                </Box>
            </DialogContent>
            <DialogActions>

            </DialogActions>
        </Dialog>
    )
}

function CommentHeader({
                           onClickClose,
                           onClickSave,
                           isEdit,
                           canSave
                       }: { onClickClose: () => void, onClickSave: () => void, isEdit: boolean, canSave: boolean }): JSX.Element {
    const classes = useStyles();
    const theme = useTheme();

    return (
        <div className={classes.root}>
            <AppBar
                position="sticky"
                elevation={0}
                className={classes.safeArea}
            >
                <Toolbar style={{padding: theme.spacing(0, 1)}}>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                    >
                        <Grid
                            container
                            item
                            xs={12}
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                            wrap="nowrap"
                        >
                            <Grid item style={{flexGrow: 0}}>
                                <CloseIconButton onClick={onClickClose}/>
                            </Grid>
                            <Grid item style={{flexGrow: 1, textAlign: "left"}}>
                                <Typography color={"textPrimary"} variant={"h6"}>{isEdit ?
                                    <FormattedMessage id={"button_edit_comment"}/> :
                                    <FormattedMessage id={"button_add_comment"}/>}</Typography>
                            </Grid>

                            <Grid item style={{flexGrow: 0}}>
                                <Button disabled={!canSave} onClick={onClickSave} color={"primary"}>
                                    <FormattedMessage id={"button_save"}/>
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </div>
    )
}

