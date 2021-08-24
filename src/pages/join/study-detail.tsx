import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Link,
    makeStyles,
    Theme,
    Typography
} from "@material-ui/core";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {useHttpEndpoint} from "../../context-provider/region-select-context";
import {ScheduleResponse} from "../../services/cms/ISchedulerService";
import {blue} from "@material-ui/core/colors";
import {useSnackbar} from "kidsloop-px";
import {CordovaSystemContext, PermissionType} from "../../context-provider/cordova-system-context";
import {usePopupContext} from "../../context-provider/popup-context";
import {useIntl} from "react-intl";
import {GetApp} from "@material-ui/icons"

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
        fontWeight: 600,
        overflowWrap: "break-word",
        wordWrap: "break-word"
    },
    attachmentName: {
        color: `#193756`,
        fontWeight: 600,
        textOverflow: `ellipsis`,
        overflow: "hidden"
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

const STUDY_DETAIL_ON_BACK_ID = "studyDetailOnBackID"
const secondsBeforeClassCanStart = 900;

export default function StudyDetail({ schedule, open, onClose, joinStudy }: {
    schedule?: ScheduleResponse,
    open: boolean,
    onClose: () => void,
    joinStudy: () => void }): JSX.Element
{
    const { dialogTitle, dialogTitleText, rowHeaderText, rowContentText, wrapper, progress, attachmentName } = useStyles();
    const cms = useHttpEndpoint("cms");
    const [downloadingPreview, setDownloadingPreview] = useState(false)
    const [shouldDownloadPreview, setShouldDownloadPreview] = useState(false)
    const {enqueueSnackbar} = useSnackbar()
    const { isIOS, requestPermissions } = useContext(CordovaSystemContext);
    const { showPopup } = usePopupContext();
    const intl = useIntl();
    const { addOnBack, removeOnBack } = useContext(CordovaSystemContext);
    const [downloadingAttachment, setDownloadingAttachment] = useState(false);
    const [shouldDownloadAttachment, setShouldDownloadAttachment] = useState(false);

    useEffect(() => {
        if(open){
            if (addOnBack) {
                addOnBack({
                    id: STUDY_DETAIL_ON_BACK_ID,
                    onBack: () => {
                        closeButtonHandler()
                    }
                })
            }
        }else{
            if(removeOnBack){
                removeOnBack(STUDY_DETAIL_ON_BACK_ID)
            }
        }
    }, [open])

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
        setShouldDownloadPreview(true);
    };

    const downloadAttachment = () => {
        setShouldDownloadAttachment(true)
    }

    const checkNetworkToConfirmDownload = (onConfirm: () => void) => {
        // reference: https://cordova.apache.org/docs/en/10.x/reference/cordova-plugin-network-information/
        const connectionType = (navigator as any).connection.type;
        const isCellularConnection = connectionType == `2g` ||
            connectionType == `3g` ||
            connectionType == `4g` ||
            connectionType == `5g` || // NOTE: Not sure if plugin supports 5g yet, adding it for future safery.
            connectionType == `cellular`;

        if (isCellularConnection) {
            showPopup({
                variant: "confirm",
                title: intl.formatMessage({ id: "confirm_download_file_title" }),
                description: [intl.formatMessage({ id: "confirm_download_file_description" })],
                closeLabel: intl.formatMessage({ id: "button_cancel" }),
                confirmLabel: intl.formatMessage({ id: "button_continue" }),
                onConfirm: () => {
                    onConfirm();
                },
            });
        } else {
            onConfirm();
        }
    }

    const confirmOpenAttachmentLink = () => {
        checkNetworkToConfirmDownload(openAttachmentLink);
    };

    const confirmDownloadAttachment = () => {
        checkNetworkToConfirmDownload(downloadAttachment);
    };

    const downloadDataBlob = (url: string): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.responseType = 'blob';
            request.open('GET', url);

            request.onreadystatechange = () => {
                if (request.readyState === XMLHttpRequest.DONE ||
                    request.readyState === 4) {
                    resolve(request.response);
                }
            };

            request.onerror = () => {
                reject(request.statusText);
            };

            request.ontimeout = () => {
                reject('timeout');
            };

            request.send();
        });
    };

    const getCacheDirectory = useMemo(() => {
        const cordova = (window as any).cordova;
        let targetDirectory = "";
        if(cordova !== undefined) {
            targetDirectory = cordova.file.externalCacheDirectory;
            if(isIOS){
                targetDirectory = cordova.file.tempDirectory;
            }
        }
        return targetDirectory
    }, [window, isIOS])

    const getDownloadDirectory = useMemo(() => {
        const cordova = (window as any).cordova;
        let targetDirectory = "";
        if(cordova !== undefined) {
            targetDirectory = `${cordova.file.externalRootDirectory}Download/`;
            if(isIOS){
                targetDirectory = cordova.file.documentsDirectory;
            }
        }
        return targetDirectory
    }, [window, isIOS])

    const saveDataBlobToFile = (blob: Blob, targetDirectory: string, fileName: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            window.resolveLocalFileSystemURL(targetDirectory, (entry) => {
                (entry as DirectoryEntry).getFile(fileName, { create: true, exclusive: false }, (fileEntry) => {
                    fileEntry.createWriter(writer => {
                        writer.onwriteend = () => {
                            resolve(fileEntry.toURL());
                        };

                        writer.onerror = () => {
                            console.error('could not write file: ', writer.error);
                            reject(writer.error);
                        }

                        writer.write(blob);
                    });
                }, (error) => {
                    console.error('could not create file: ', error);
                    reject(error);
                });
            }, (error) => {
                console.error('could not retrieve directory: ', error);
                reject(error);
            })
        });
    };

    useEffect(() => {
        function startDownloadPreview(){
            setShouldDownloadPreview(false)
            if(downloadingPreview)
                return
            if(attachmentDownloadLink && schedule){
                const url = encodeURI(attachmentDownloadLink);
                setDownloadingPreview(true);

                downloadDataBlob(url).then(downloadedData => {
                    saveDataBlobToFile(downloadedData, getCacheDirectory, schedule.attachment.name).then(savedFilePath => {
                        setPreviewOpen({open: true, fileUrl: savedFilePath});
                    }).catch(error => {
                        enqueueSnackbar(error.body ?? error.message, {
                            variant: "error",
                            anchorOrigin: {
                                vertical: "bottom",
                                horizontal: "center"
                            }
                        });
                    });
                }).catch(error => {
                    enqueueSnackbar(error.body ?? error.message, {
                        variant: "error",
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "center"
                        }
                    });
                }).finally(() => {
                    console.log("finally")
                    setDownloadingPreview(false);
                });
            }
        }
        if(shouldDownloadPreview){
            startDownloadPreview()
        }
    },[shouldDownloadPreview])

    useEffect(() => {
        function confirmDownload(onConfirm: () => void) {
            showPopup({
                variant: "detailConfirm",
                title: intl.formatMessage({id: "label_download", defaultMessage: "Download"}),
                description: [
                    intl.formatMessage({
                        id: "confirm_download_attachment_description",
                        description: "Do you want to download?"
                    }),
                    schedule?.attachment.name ?? ""
                ],
                confirmLabel: intl.formatMessage({id: "label_download", defaultMessage: "Download"}),
                onConfirm: () => {
                    requestPermissions({
                        permissionTypes: [PermissionType.READ_STORAGE, PermissionType.WRITE_STORAGE],
                        onSuccess: (hasPermission) => {
                            if(hasPermission)
                                onConfirm();
                        },
                        onError: () => {

                        }
                    })
                },
                closeLabel: intl.formatMessage({id: "button_cancel", defaultMessage: "Cancel"})
            })
        }
        function startDownloadAttachment() {
            setShouldDownloadAttachment(false)
            if(downloadingAttachment)
                return
            if(attachmentDownloadLink && schedule){
                confirmDownload(() => {
                    const url = encodeURI(attachmentDownloadLink);
                    setDownloadingAttachment(true);

                    downloadDataBlob(url).then(downloadedData => {
                        saveDataBlobToFile(downloadedData, getDownloadDirectory, schedule.attachment.name).then(savedFilePath => {
                            enqueueSnackbar(intl.formatMessage({id: "download_complete", defaultMessage: "Download complete"}), {
                                variant: "success",
                                anchorOrigin: {
                                    vertical: "bottom",
                                    horizontal: "center"
                                }
                            });
                        }).catch(error => {
                            enqueueSnackbar(error.body ?? error.message, {
                                variant: "error",
                                anchorOrigin: {
                                    vertical: "bottom",
                                    horizontal: "center"
                                }
                            });
                        });
                    }).catch(error => {
                        enqueueSnackbar(error.body ?? error.message, {
                            variant: "error",
                            anchorOrigin: {
                                vertical: "bottom",
                                horizontal: "center"
                            }
                        });
                    }).finally(() => {
                        setDownloadingAttachment(false);
                    });
                })
            }
        }
        if(shouldDownloadAttachment){
            startDownloadAttachment()
        }
    },[shouldDownloadAttachment, schedule])

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

    function goJoin() {
        onClose();
        joinStudy();
    }

    const joinButtonHandler = useCallback(() => {
        if(schedule === undefined)
            return
        if(!open)
            return

        if(schedule.class_type === "OnlineClass") {
            const now = new Date().getTime() / 1000;
            const timeBeforeClass = schedule.start_at - now;
            console.log(`timeBeforeClass: ${timeBeforeClass}`)
            if(schedule.end_at < now) {
                enqueueSnackbar(
                    intl.formatMessage({id: "time_expired", defaultMessage: "Time expired"}),
                    {
                        variant: "error",
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "center"
                        }
                    }
                )
            }else if(timeBeforeClass > secondsBeforeClassCanStart) {
                enqueueSnackbar(
                    intl.formatMessage({id: "err_join_live_failed", defaultMessage: "You can only start a class 15 minutes before the start time."}),
                    {
                        variant: "warning",
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "center"
                        }
                    }
                )
            }else {
                goJoin();
            }
        }else{
            goJoin();
        }
    },[schedule, open]);

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
                        <Grid container item direction={`row`} spacing={1} alignItems={"center"}>
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
                        { dueAt ? <Grid container item direction={`row`} spacing={1} alignItems={"center"}>
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
                        { startAt ? <Grid container item direction={`row`} spacing={1} alignItems={"center"}>
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
                        { endAt ? <Grid container item direction={`row`} spacing={1} alignItems={"center"}>
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
                        <Grid container item direction={`row`} spacing={1} alignItems={"center"}>
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
                        <Grid container item direction={`row`} spacing={1} alignItems={"center"}>
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
                        <Grid container item direction={`row`} spacing={1} alignItems={"center"}>
                            <Grid item xs={4} sm={3}>
                                <Typography variant="body1" className={rowHeaderText}>
                                    Attachment
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                    { attachmentDownloadLink && schedule?.attachment?.name ?
                                        <Grid container direction={"row"} justify={"space-between"} alignItems={"center"}>
                                            <Grid item xs={10} alignContent={"flex-start"}>
                                                <div className={wrapper}>
                                                    <Typography variant="body1" noWrap className={attachmentName}>
                                                        <Link key={`${downloadingPreview}`} variant="body1" href={`#`} color={downloadingPreview ? "textSecondary" : "primary"} aria-disabled={downloadingPreview} onClick={() => confirmOpenAttachmentLink()}>
                                                            { schedule?.attachment?.name }
                                                        </Link>
                                                    </Typography>
                                                    {downloadingPreview && <CircularProgress size={24} className={progress}/>}
                                                </div>
                                            </Grid>
                                            <Grid item xs={2} alignContent={"flex-end"}>
                                                <div className={wrapper}>
                                                    <IconButton key={`${downloadingAttachment}`} onClick={() => {confirmDownloadAttachment()}} disabled={downloadingAttachment} color="primary" aria-label="Download attachment" component="span">
                                                        <GetApp />
                                                    </IconButton>
                                                    {downloadingAttachment && <CircularProgress size={24} className={progress}/>}
                                                </div>
                                            </Grid>
                                        </Grid>
                                        : <Typography variant="body1" className={rowContentText}>N/A</Typography>
                                    }
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button size={"large"} variant={`contained`} onClick={closeButtonHandler}>Cancel</Button>
                    <Button key={`${schedule === undefined}`} size={"large"} color={`primary`} variant={`contained`} onClick={joinButtonHandler} disabled={schedule === undefined}>
                        {schedule?.class_type === "OnlineClass" ? intl.formatMessage({id: 'button_go_live', defaultMessage: "Go Live"}) :  intl.formatMessage({id: 'button_go_study', defaultMessage: "Go Study"})}
                    </Button>
                </DialogActions>
            </Dialog>
            {/*<StudyDetailPreview open={previewOpen} onClose={() => setPreviewOpen(false)} attachmentId={schedule?.attachment?.id} attachmentName={schedule?.attachment?.name} />*/}
        </React.Fragment>
    )
}
