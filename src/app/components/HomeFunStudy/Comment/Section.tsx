import CommentDialog from "@/app/components/HomeFunStudy/Comment/Dialog";
import {
    Box,
    Button,
    createStyles,
    Grid,
    makeStyles,
    Typography,
} from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import React, {
    useEffect,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    roundedButton: {
        borderRadius: `12px`,
        paddingTop: `10px`,
        paddingBottom: `10px`,
    },
}));

interface Props {
    canEdit: boolean;
    comment: string;
    onChange: (comment: string) => void;
}

export default function HomeFunStudyCommentSection (props: Props) {
    const {
        canEdit,
        comment,
        onChange,
    } = props;
    const classes = useStyles();

    const [ isEditCommentDialogOpen, setIsEditCommentDialogOpen ] = useState(false);
    const [ newComment, setNewComment ] = useState(comment);

    useEffect(() => {
        if (comment === newComment) return;
        setNewComment(comment);
    }, [ comment ]);

    function handleOnClickEditComment () {
        setIsEditCommentDialogOpen(true);
    }

    function handleSaveComment (comment: string) {
        console.log(`handleSaveComment`, comment);
        if (comment !== newComment) {
            setNewComment(comment);
            onChange(comment);
        }
        setIsEditCommentDialogOpen(false);
    }

    function handleCloseComment () {
        setIsEditCommentDialogOpen(false);
    }

    return (
        <Grid
            item
            xs
        >
            <Box mb={1}>
                <Typography variant="subtitle1">
                    <FormattedMessage id={`homeFunStudy.comment`}/>
                </Typography>
            </Box>
            <Box mb={1}>
                <Button
                    variant="outlined"
                    color="primary"
                    className={classes.roundedButton}
                    startIcon={<Edit/>}
                    disabled={!canEdit}
                    onClick={handleOnClickEditComment}
                >
                    <Typography variant="body2">
                        {newComment
                            ? <FormattedMessage id="button_edit_comment"/>
                            : <FormattedMessage id="button_add_comment"/>
                        }
                    </Typography>
                </Button>
            </Box>
            <Typography
                variant="body2"
                color="textSecondary"
            >
                {newComment || <FormattedMessage id="home_fun_study_comment" />}
            </Typography>
            <CommentDialog
                open={isEditCommentDialogOpen}
                comment={newComment}
                onClose={handleCloseComment}
                onSave={handleSaveComment}
            />
        </Grid>
    );
}
