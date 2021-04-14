import Attachment from "./item";
import {
    Button,
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import { CloudUpload as UploadIcon } from "@styled-icons/boxicons-regular/CloudUpload";
import React from "react";
import { NoItemList } from "../../../utils";

const useStyles = makeStyles((theme: Theme) => ({
    fullHeight:{
        height: `100%`,
    },
    container:{
        padding : `1rem 10px`,
        paddingBottom: 0,
    },
    buttonUpload:{
        width: `100%`,
        color: `#fff`,
        fontSize: `1rem`,
        backgroundColor: theme.palette.text.primary,
        "&:hover":{
            opacity: 0.8,
            backgroundColor: theme.palette.text.primary,
        },
    },
}));

const attachments = [
    {
        id: 1,
        title: `Image`,
        type: `image`,
    },
    {
        id: 2,
        title: `Image`,
        type: `image`,
    },
    {
        id: 3,
        title: `Image`,
        type: `image`,
    },
];

function Attachments () {
    const classes = useStyles();
    return (
        <Grid
            container
            direction="column"
            className={classes.fullHeight}>
            <Grid
                item
                xs>
                <Grid
                    container
                    direction="column"
                    className={classes.fullHeight}>
                    <Grid
                        item
                        xs>
                        {attachments.length === 0 ?
                            <NoItemList icon={<UploadIcon />} text='No attachments' /> :
                            (<div className={classes.container}>
                                {attachments?.map(attachment => (
                                    <Attachment
                                        key={attachment.id}
                                        title={attachment.title}
                                        type={attachment.type} />
                                ))}
                            </div>)
                        }
                    </Grid>
                    <Grid item>
                        <Button
                            className={classes.buttonUpload}
                            component="label">
                            <UploadIcon size="1.75rem" /> Upload
                            <input
                                hidden
                                type="file" />
  						</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Attachments;