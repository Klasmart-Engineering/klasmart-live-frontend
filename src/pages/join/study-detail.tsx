import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Link, makeStyles, Theme, Typography } from "@material-ui/core";
import React, { useMemo, useState } from "react";
import { useHttpEndpoint } from "../../context-provider/region-select-context";
import { ScheduleResponse } from "../../services/cms/ISchedulerService";
import StudyDetailPreview from "./study-detail-preview";

const useStyles = makeStyles((theme: Theme) => ({
    dialogTitle: {
        backgroundColor: `#cce8f9`,
    },
    dialogTitleText: {
        color: `#193756`,
        textOverflow: `ellipsis`,
        overflow: `hidden`,
    },
    rowHeaderText: {
        color: `#193756`,
        fontWeight: 900
    },
    rowContentText: {
        color: `#193756`,
        fontWeight: 600
    }
}));

export default function StudyDetail({ schedule, open, onClose, joinStudy }: {
    schedule?: ScheduleResponse,
    open: boolean,
    onClose: () => void,
    joinStudy: () => void }): JSX.Element
{
    const { dialogTitle, dialogTitleText, rowHeaderText, rowContentText } = useStyles();

    const cms = useHttpEndpoint("cms");

    const startAt = useMemo<string | undefined>(() => {
        if (schedule?.start_at) {
            return new Date(Number(schedule.start_at) * 1000).toLocaleString();
        } else {
            return undefined;
        }
    }, [schedule]);

    const endAt = useMemo<string | undefined>(() => {
        if (schedule?.end_at) {
            return new Date(Number(schedule.end_at) * 1000).toLocaleString();
        } else {
            return undefined;
        }
    }, [schedule]);

    const dueAt = useMemo<string | undefined>(() => {
        if (schedule?.due_at) {
            return new Date(Number(schedule.due_at) * 1000).toLocaleString();
        } else {
            return undefined;
        }
    }, [schedule]);

    const attachmentDownloadLink = useMemo<string | undefined>(() => {
        if (schedule?.attachment) {
            return `${cms}/v1/contents_resources/${schedule.attachment.id}`;
        } else {
            return undefined;
        }
    }, [schedule]);

    const [previewOpen, setPreviewOpen] = useState<boolean>(false);

    // TODO: Will need to use a more specialized file saving mechanism
    // for Cordova. This opens the image in a new browser tab but the
    // cookie for authentication isn't transferred over. So the user
    // get authentication error trying to access the image.
    // NOTE: For now, because of file saving complexity, the app will
    // just support viewing the files. The only supported file type
    // will be images, at least until there's a clearly defined list
    // of supported file types (with specialized viewers).
    const openAttachmentLink = () => {
        setPreviewOpen(true);
    };

    const closeButtonHandler = () => {
        onClose();
    };

    const joinButtonHandler = () => {
        onClose();
        joinStudy();
    };

    return (
        <React.Fragment>
            <Dialog fullWidth maxWidth={`sm`} scroll={`paper`} open={open} onClose={closeButtonHandler}>
                <DialogTitle id="study-detail-title" className={dialogTitle}>
                    <Typography noWrap className={dialogTitleText}>
                        { schedule?.title || `N/A` }
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Grid container direction={`column`} justify={`center`} alignItems={`center`} spacing={4}>
                        <Grid container item direction={`row`} spacing={1}>
                            <Grid item xs={4} sm={3}>
                                <Typography variant="body1" className={rowHeaderText}>
                                    Description
                                </Typography>
                            </Grid>
                            <Grid item xs>
                                <Typography variant="body1" className={rowContentText}>
                                    { schedule?.description || `N/A` }
                                </Typography>
                            </Grid>
                        </Grid>
                        { dueAt ? <Grid container item direction={`row`} spacing={1}>
                            <Grid item xs={4} sm={3}>
                                <Typography variant="body1" className={rowHeaderText}>
                                    Due Date
                                </Typography>
                            </Grid>
                            <Grid item xs>
                                <Typography variant="body1" className={rowContentText}>
                                    { dueAt || `N/A`}
                                </Typography>
                            </Grid>
                        </Grid> : undefined }
                        { startAt ? <Grid container item direction={`row`} spacing={1}>
                            <Grid item xs={4} sm={3}>
                                <Typography variant="body1" className={rowHeaderText}>
                                    Start Time
                                </Typography>
                            </Grid>
                            <Grid item xs>
                                <Typography variant="body1" className={rowContentText}>
                                    { startAt || `N/A` }
                                </Typography>
                            </Grid>
                        </Grid> : undefined }
                        { endAt ? <Grid container item direction={`row`} spacing={1}>
                            <Grid item xs={4} sm={3}>
                                <Typography variant="body1" className={rowHeaderText}>
                                    End Time
                                </Typography>
                            </Grid>
                            <Grid item xs>
                                <Typography variant="body1" className={rowContentText}>
                                    { endAt || `N/A` }
                                </Typography>
                            </Grid>
                        </Grid> : undefined }
                        <Grid container item direction={`row`} spacing={1}>
                            <Grid item xs={4} sm={3}>
                                <Typography variant="body1" className={rowHeaderText}>
                                    Class Name
                                </Typography>
                            </Grid>
                            <Grid item xs>
                                <Typography variant="body1" className={rowContentText}>
                                    { schedule?.class?.name || `N/A` }
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container item direction={`row`} spacing={1}>
                            <Grid item xs={4} sm={3}>
                                <Typography variant="body1" className={rowHeaderText}>
                                    { schedule?.is_home_fun ? "Teacher" : "Lesson Plan" }
                                </Typography>
                            </Grid>
                            <Grid item xs>
                                {schedule?.is_home_fun ?
                                    <Grid container direction={"column"}>
                                        {schedule.teachers.map(item => (
                                        <Grid key={item.id} item>
                                            <Typography variant="body1" className={rowContentText}>
                                                {item.name}
                                            </Typography>
                                        </Grid>
                                        ))}
                                    </Grid>
                                    : <Typography variant="body1" className={rowContentText}>
                                        {schedule?.lesson_plan?.name || `N/A`}
                                    </Typography>
                                }
                            </Grid>
                        </Grid>
                        <Grid container item direction={`row`} spacing={1}>
                            <Grid item xs={4} sm={3}>
                                <Typography variant="body1" className={rowHeaderText}>
                                    Attachment
                                </Typography>
                            </Grid>
                            <Grid item xs>
                                <Typography variant="body1" className={rowContentText}>
                                    { attachmentDownloadLink && schedule?.attachment?.name ?
                                        <Link variant="body1" href={`#`} onClick={() => openAttachmentLink()}>
                                            { schedule?.attachment?.name }
                                        </Link>
                                        : `N/A`
                                    }
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button size={"large"} variant={`contained`} onClick={closeButtonHandler}>Cancel</Button>
                    <Button size={"large"} color={`primary`} variant={`contained`} onClick={joinButtonHandler} disabled={schedule === undefined}>Go Study</Button>
                </DialogActions>
            </Dialog>
            <StudyDetailPreview open={previewOpen} onClose={() => setPreviewOpen(false)} attachmentId={schedule?.attachment?.id} attachmentName={schedule?.attachment?.name} />
        </React.Fragment>
    )
}
