import {
    Grid,
    IconButton,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import { ChevronRight as AccessIcon } from "@styled-icons/boxicons-regular/ChevronRight";
import { Attachment as AttachmentIcon } from "@styled-icons/icomoon/Attachment";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
    root:{
        cursor: `pointer`,
        borderRadius: 12,
        flexGrow: 1,
        "&:hover":{
            backgroundColor: `#fff`,
            "& $iconButton":{
                visibility: `visible`,
            },
        },
    },
    iconButton:{
        visibility: `hidden`,
        padding: 10,
        borderRadius: 12,
        color: `#fff`,
        backgroundColor: theme.palette.text.primary,
        "&:hover":{
            backgroundColor: theme.palette.text.primary,
            opacity: 0.8,
        },
    },
}));

export interface ManualPropsType {
    title: string;
    type: string;
}

function Manual (props: ManualPropsType) {
    const classes = useStyles();
    const { title, type } = props;

    return (
        <Grid
            container
            alignItems="center"
            spacing={2}
            className={classes.root}>
            <Grid item>
                <AttachmentIcon size="1rem"/>
            </Grid>
            <Grid
                item
                xs>
                <Typography>{title}</Typography>
            </Grid>
            <Grid item>
                <IconButton
                    aria-label="send"
                    className={classes.iconButton}
                    type="submit"
                >
                    <AccessIcon size="1.25rem"/>
                </IconButton>
            </Grid>
        </Grid>
    );
}

export default Manual;
