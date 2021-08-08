import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Link,
    makeStyles,
    Theme,
    Typography
} from "@material-ui/core";
import React, {useContext, useEffect, useMemo, useState} from "react";
import { useHttpEndpoint } from "../../context-provider/region-select-context";
import { ScheduleResponse } from "../../services/cms/ISchedulerService";
import {blue} from "@material-ui/core/colors";
import {useSnackbar} from "kidsloop-px";
import {CordovaSystemContext} from "../../context-provider/cordova-system-context";

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
    },
    wrapper: {
        position: 'relative',
    },
    progress: {
        color: blue[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    }));

declare var FileTransfer: any;

export default function StudyDetail({ schedule, open, onClose, joinStudy }: {
    schedule?: ScheduleResponse,
    open: boolean,
    onClose: () => void,
    joinStudy: () => void }): JSX.Element
{
    const { dialogTitle, dialogTitleText, rowHeaderText, rowContentText, wrapper, progress } = useStyles();
    const cms = useHttpEndpoint("cms");
    const [downloading, setDownloading] = useState(false)
    const [shouldDownload, setShouldDownload] = useState(false)
    const {enqueueSnackbar} = useSnackbar()
    const { isIOS } = useContext(CordovaSystemContext);

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

    const [previewOpen, setPreviewOpen] = useState<{open: boolean, fileUrl: string}>({open: false, fileUrl: ""});

    // TODO: Will need to use a more specialized file saving mechanism
    // for Cordova. This opens the image in a new browser tab but the
    // cookie for authentication isn't transferred over. So the user
    // get authentication error trying to access the image.
    // NOTE: For now, because of file saving complexity, the app will
    // just support viewing the files. The only supported file type
    // will be images, at least until there's a clearly defined list
    // of supported file types (with specialized viewers).
    const openAttachmentLink = () => {
        setShouldDownload(true);
    };

    useEffect(() => {
        function startDownloadAttachment(){
            setShouldDownload(false)
            if(downloading)
                return
            if(attachmentDownloadLink && schedule){
                const url = encodeURI(attachmentDownloadLink);
                console.log(url)
                const ft = new FileTransfer();
                const cordova = (window as any).cordova;
                let targetDirectory =  cordova.file.externalCacheDirectory;
                if(isIOS){
                    targetDirectory = cordova.file.tempDirectory;
                }
                setDownloading(true)
                ft.download(
                    url,
                    targetDirectory + schedule.attachment.name,
                    (entry: any) => {
                        console.log(entry)
                        console.log(entry.toURL())
                        setDownloading(false)
                        setPreviewOpen({open: true, fileUrl: entry.toURL()})
                    },
                    (error: any) => {
                        setDownloading(false)
                        enqueueSnackbar(error.body, {
                            variant: "error",
                            anchorOrigin: {
                                vertical: "bottom",
                                horizontal: "center"
                            }
                        })

                    }
                )
            }
        }
        if(shouldDownload){
            startDownloadAttachment()
        }
    },[shouldDownload])

    useEffect(() => {
        if(previewOpen.open && open){
            const previewAnyFile = (window as any).PreviewAnyFile;
            previewAnyFile.previewPath(
                (result: string) => {
                    setPreviewOpen({open: false, fileUrl: ""})
                },
                (error: any) => {
                    setPreviewOpen({open: false, fileUrl: ""})
                    enqueueSnackbar(error.message, {
                        variant: "error",
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "center"
                        }
                    })
                },
                previewOpen.fileUrl
            )
        }
    },[previewOpen])
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
                                    { attachmentDownloadLink && schedule?.attachment?.name ?
                                        <div className={wrapper}>
                                            <Typography variant="body1" className={rowContentText}>
                                                <Link variant="body1" href={`#`} color={downloading ? "textSecondary" : "primary"} aria-disabled={downloading} onClick={() => openAttachmentLink()}>
                                                    { schedule?.attachment?.name }
                                                </Link>
                                            </Typography>
                                            {downloading && <CircularProgress size={24} className={progress}/>}
                                        </div>
                                        : <Typography variant="body1" className={rowContentText}>N/A</Typography>
                                    }
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button size={"large"} variant={`contained`} onClick={closeButtonHandler}>Cancel</Button>
                    <Button size={"large"} color={`primary`} variant={`contained`} onClick={joinButtonHandler} disabled={schedule === undefined}>Go Study</Button>
                </DialogActions>
            </Dialog>
            {/*<StudyDetailPreview open={previewOpen} onClose={() => setPreviewOpen(false)} attachmentId={schedule?.attachment?.id} attachmentName={schedule?.attachment?.name} />*/}
        </React.Fragment>
    )
}
