import React, {useEffect, useState} from "react";
import {Header} from "../../components/header";
import {
    Box,
    Button, CircularProgress,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Grid, IconButton,
    List,
    ListItem,
    ListItemIcon, ListItemSecondaryAction,
    ListItemText,
    Typography
} from "@material-ui/core";
import {Edit, InfoOutlined, HighlightOffOutlined} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {lockOrientation} from "../../utils/screenUtils";
import {OrientationType} from "../../store/actions";
import {useDispatch, useSelector} from "react-redux";
import {useServices} from "../../context-provider/services-provider";
import {State} from "../../store/store";
import {Assignment, ScheduleFeedbackResponse, ScheduleResponse} from "../../services/cms/ISchedulerService";
import {formatDueDate} from "../../utils/timeUtils";
import {SupportFileInfo} from "../../components/supportFileInfo";
import {FormattedMessage, useIntl} from "react-intl";
import {Upload as UploadIcon} from "@styled-icons/bootstrap/Upload"
import Loading from "../../components/loading";
import StyledIcon from "../../components/styled/icon";
import {getFileExtensionFromName, validateFileSize, validateFileType} from "../../utils/fileUtils";
import {FileIcon} from "../../components/fileIcon";
import {setSelectHomeFunStudyDialogOpen} from "../../store/reducers/control";
import {CommentDialog} from "./commentDialog";
import {setHomeFunStudies} from "../../store/reducers/data";
import {BottomSelector} from "../../components/bottomSelector";
import {DetailErrorDialog} from "../../components/dialogs/detailErrorDialog";

export type StudyComment = {
    studyId: string,
    comment: string
}

const useStyles = makeStyles(() => ({
    noPadding: {
        padding: 0
    },
    dialogActionsPadding: {
        padding: "10px 15px"
    },
    container: {
        height: "100%"
    },
    rounded_button: {
        borderRadius: "12px",
        paddingTop: "10px",
        paddingBottom: "10px",
    },
    disabled_button: {
        backgroundColor: "#A9CDFF",
    },
    submit_button: {
        backgroundColor: "#3671CE",
    },
    file_icon: {
        maxBlockSize: "2rem"
    }
}));

export function HomeFunStudyDialog() {
    const [studyId, setStudyId] = useState<string>();
    const classes = useStyles();
    const dispatch = useDispatch();
    const selectHomeFunStudyDialog = useSelector((state: State) => state.control.selectHomeFunStudyDialogOpen);
    const homeFunStudyComments = useSelector((state: State) => state.data.homeFunStudyComments); //TODO: Find the comment in this list to submit.
    const {schedulerService} = useServices();
    const {selectedOrg, selectedUserId} = useSelector((state: State) => state.session);
    const [studyInfo, setStudyInfo] = useState<ScheduleResponse>();
    const [feedbacks, setFeedbacks] = useState<ScheduleFeedbackResponse[]>();
    const [key, setKey] = useState(Math.random().toString(36))
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        lockOrientation(OrientationType.PORTRAIT, dispatch);
    }, [])
    useEffect(() => {
        if (selectHomeFunStudyDialog?.studyId) {
            setStudyId(selectHomeFunStudyDialog.studyId);
        }
    }, [selectHomeFunStudyDialog])
    useEffect(() => {
        async function fetchEverything() {
            async function fetchScheduleStudyInfo() {
                if (!schedulerService) {
                    throw new Error("Scheduler service not available.");
                }
                if (!selectedOrg) {
                    throw new Error("Organization is not selected");
                }
                if (!studyId) {
                    throw new Error("No studyId on query path");
                }
                const scheduleInfoPayload = await schedulerService.getScheduleInfo(selectedOrg.organization_id, studyId);
                setStudyInfo((scheduleInfoPayload));
            }

            async function fetchScheduleFeedback() {
                if (!schedulerService) {
                    throw new Error("Scheduler service not available.");
                }
                if (!selectedOrg) {
                    throw new Error("Organization is not selected");
                }
                if (!selectedUserId) {
                    throw new Error("User profile is not selected");
                }
                if (!studyId) {
                    throw new Error("No studyId on query path");
                }
                const scheduleFeedbacksPayload = await schedulerService.getScheduleFeedbacks(selectedOrg.organization_id, studyId, selectedUserId);
                setFeedbacks(scheduleFeedbacksPayload);
            }

            try {
                await Promise.all([fetchScheduleStudyInfo(), fetchScheduleFeedback()]);
                setLoading(false);
            } catch (err) {
                console.log(`Fail to fetchScheduleInfo or fetchHomeFunStudyInfo ${err}`)
            }
        }

        setLoading(true);
        fetchEverything();
    }, [studyId, selectedOrg, key, selectedUserId])


    return (
        <Dialog
            aria-labelledby="select-home-fun-study-dialog"
            fullScreen
            open={selectHomeFunStudyDialog?.open}
            onClose={() => dispatch(setSelectHomeFunStudyDialogOpen({open: false, studyInfo: undefined}))}
        >
            <DialogTitle className={classes.noPadding}>
                <Header setKey={setKey}/>
            </DialogTitle>
            <DialogContent>
                {!loading ?
                    <HomeFunStudyContainer studyInfo={studyInfo} feedbacks={feedbacks}/>
                    : <Loading messageId={"cordova_loading"} retryCallback={() => {
                        setKey(Math.random().toString(36))
                    }}/>}
            </DialogContent>
            <DialogActions className={classes.dialogActionsPadding}>
                <Button fullWidth variant="contained"
                        className={classes.rounded_button}
                        color="primary"
                        disabled={studyInfo ? studyInfo.exist_feedback : false}
                        classes={{
                            disabled: classes.disabled_button,
                        }}
                > <FormattedMessage id="button_submit"/></Button>
            </DialogActions>
        </Dialog>)
}

function HomeFunStudyContainer({
                                   studyInfo,
                                   feedbacks
                               }: { studyInfo?: ScheduleResponse, feedbacks?: ScheduleFeedbackResponse[] }) {
    const intl = useIntl();
    const [openSupportFileInfo, setOpenSupportFileInfo] = useState(false);
    const [openButtonSelector, setOpenButtonSelector] = useState(false);
    const [openErrorDialog, setOpenErrorDialog] = useState<{ open: boolean, title: string, description: string[] }>({
        open: false,
        title: "",
        description: []
    });
    const [assignments, setAssignments] = useState<{ assignment: Assignment, loading: boolean }[]>([]);
    const {fileSelectService} = useServices();

    useEffect(() => {
        let formattedAssignments: { assignment: Assignment, loading: boolean }[] = [];
        if (feedbacks && feedbacks.length > 0) {
            const feedBackAssignments = feedbacks[0].assignments;
            formattedAssignments = feedBackAssignments.slice().map((item) => ({assignment: item, loading: false}));
        }
        for (let i = 0; i < assignments.length; i++) {
            if (!assignments[i].loading)
                formattedAssignments.push(assignments[i]);
        }
        setAssignments(formattedAssignments);
    }, [feedbacks])

    function handleClickUploadInfo() {
        setOpenSupportFileInfo(true);
    }

    function handleClickUpload() {
        setOpenButtonSelector(true);
    }

    function onSelectFile() {
        fileSelectService?.selectFile().then(file => {
            console.log(`selected file: ${file.name}`);
            setOpenButtonSelector(false);
            handleSelectedFile(file);
        }).catch(error => {
            console.error(error);
        });
    }

    function onSelectCamera() {
        fileSelectService?.selectFromCamera().then(file => {
            console.log(`selected from camera: ${file.name}`);
            setOpenButtonSelector(false);
            handleSelectedFile(file)
        }).catch(error => {
            console.error(error);
        });
    }

    function onSelectGallery() {
        fileSelectService?.selectFromGallery().then(file => {
            console.log(`selected from gallery: ${file.name}`);
            setOpenButtonSelector(false);
            handleSelectedFile(file)
        }).catch(error => {
            console.error(error);
        });
    }

    function addAnUploadingAssignment(uploadingAssignment: Assignment) {
        const newAssignments = assignments.slice();
        newAssignments.push({assignment: uploadingAssignment, loading: true});
        setAssignments(newAssignments);
    }

    function handleSelectedFile(file: File) {
        if (validateFileType(file)) {
            if (validateFileSize(file)) {
                console.log(`validated file: ${file.name}`);
                //TODO: upload the file here
                const id = Math.random().toString(36).substring(7);
                addAnUploadingAssignment({attachment_id: id, attachment_name: file.name, number: assignments.length});
            } else {
                setOpenErrorDialog({
                    open: true,
                    title: intl.formatMessage({id: "submission_failed"}),
                    description: [
                        intl.formatMessage({id: "upload_please_check_your_file"}),
                        intl.formatMessage({id: "upload_file_too_big"})
                    ]
                })
            }
        } else {
            setOpenErrorDialog({
                open: true,
                title: intl.formatMessage({id: "submission_failed"}),
                description: [
                    intl.formatMessage({id: "upload_please_check_your_file"}),
                    intl.formatMessage({id: "upload_file_not_supported"})
                ]
            })
        }
    }

    return (
        <>
            <Grid
                container
                direction="column"
                wrap="nowrap"
                justify="flex-start"
                item
                style={{flexGrow: 1, overflowY: "auto", backgroundColor: "white"}}
            >
                <Grid item xs>
                    <Box mb={2} mt={1}>
                        <Typography variant="subtitle1" align="center">{studyInfo?.title}</Typography>
                        <Typography variant='body1' align="center" color='textSecondary'>Home fun
                            study</Typography>
                    </Box>
                </Grid>
                <Grid item xs>
                    <Box mb={3}>
                        <Typography variant='subtitle1'><FormattedMessage
                            id="home_fun_study_your_task"/></Typography>
                        <Typography variant="body2"
                                    color="textSecondary">{studyInfo?.description ? studyInfo.description : <FormattedMessage id={"label_not_defined"}/>}</Typography>
                    </Box>
                </Grid>
                <Grid item xs>
                    <Box mb={3}>
                        <Typography variant='subtitle1'>Due date</Typography>
                        <Typography variant='body2' color="textSecondary">
                            {studyInfo?.due_at && studyInfo.due_at !== 0 ? formatDueDate(studyInfo.due_at) : <FormattedMessage id={"label_not_defined"}/>}
                        </Typography>
                    </Box>
                </Grid>
                <HomeFunStudyAssignment
                    assignments={assignments}
                    onClickUploadInfo={handleClickUploadInfo} onClickUpload={handleClickUpload} />
                <HomeFunStudyComment
                    studyId={studyInfo?.id}
                    defaultComment={feedbacks && feedbacks.length > 0 ? feedbacks[0].comment : ""}
                />
            </Grid>
            <SupportFileInfo
                open={openSupportFileInfo}
                onClose={() => {
                    setOpenSupportFileInfo(false)
                }}/>
            <BottomSelector
                onClose={() => {
                    setOpenButtonSelector(false)
                }}
                onOpen={() => {
                    setOpenButtonSelector(true)
                }}
                onSelectFile={onSelectFile}
                onSelectCamera={onSelectCamera}
                onSelectGallery={onSelectGallery}
                open={openButtonSelector}/>
            <DetailErrorDialog open={openErrorDialog.open}
                               onClose={() => {
                                   setOpenErrorDialog({open: false, title: "", description: []})
                               }}
                               title={openErrorDialog.title} description={openErrorDialog.description}
                               closeLabel={intl.formatMessage({id: "button_ok"})}/>
        </>
    )
}

function HomeFunStudyAssignment({
                                    assignments,
                                    onClickUploadInfo,
                                    onClickUpload
                                }: { assignments: { assignment: Assignment, loading: boolean }[], onClickUploadInfo: () => void, onClickUpload: () => void }) {
    const classes = useStyles();

    return (
        <Grid item xs>
            <Box mb={2}>
                <Box display="flex" alignItems="center">
                    <Typography variant='subtitle1' display="inline">
                        Upload your Assignment
                    </Typography>
                    <Box ml={2}
                         display="flex"
                         justifyContent="flex-start"
                         onClick={onClickUploadInfo}>
                        <InfoOutlined color="primary" fontSize="small"/>
                        <Box ml={1}>
                            <Typography variant='caption' color="primary">Info</Typography>
                        </Box>

                    </Box>
                </Box>
                <Typography variant="caption" display="block" color="textSecondary">*Maximum three
                    files</Typography>
                <Box my={2}>
                    <Button
                        variant="outlined"
                        color="primary"
                        className={classes.rounded_button}
                        onClick={onClickUpload}
                        startIcon={<StyledIcon icon={<UploadIcon/>} size="medium" color="primary"/>}
                    >
                        <Typography variant="body2">Choose File</Typography>
                    </Button>
                </Box>
                <Box>
                    <List>
                        {assignments.map((item) => (
                            <ListItem key={item.assignment.attachment_id}>
                                <ListItemIcon>
                                    <FileIcon fileType={getFileExtensionFromName(item.assignment.attachment_name)}/>
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant="body2"
                                                         color="textSecondary">{item.assignment.attachment_name}</Typography>}
                                />
                                <ListItemSecondaryAction>
                                    {
                                        item.loading
                                            ? <CircularProgress size={20} thickness={4}/>
                                            : <IconButton edge="end" aria-label="delete">
                                                <HighlightOffOutlined color="primary"/>
                                            </IconButton>
                                    }

                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Box>
        </Grid>
    );
}

function HomeFunStudyComment({studyId, defaultComment}: { studyId?: string, defaultComment: string }) {
    const classes = useStyles();

    const dispatch = useDispatch();
    const [openEditComment, setOpenEditComment] = useState(false);
    const [comment, setComment] = useState(defaultComment);
    const homeFunStudyComments = useSelector((state: State) => state.data.homeFunStudyComments);

    useEffect(() => {
        if (studyId) {
            for (let i = 0; homeFunStudyComments && i < homeFunStudyComments.length; i++) {
                if (homeFunStudyComments[i].studyId == studyId) {
                    setComment(homeFunStudyComments[i].comment)
                    break;
                }
            }
        }
    }, [homeFunStudyComments])

    function handleOnClickEditComment() {
        setOpenEditComment(true);
    }

    function handleSaveComment(newComment: string) {
        setComment(newComment);
        if (studyId) {
            let newHFSComments = homeFunStudyComments ? homeFunStudyComments.slice() : [];
            let hasDetail = false;
            for (let i = 0; i < newHFSComments.length; i++) {
                if (newHFSComments[i].studyId == studyId) {
                    newHFSComments[i] = {studyId: studyId, comment: newComment};
                    hasDetail = true;
                    break;
                }
            }
            if (!hasDetail) {
                newHFSComments.push({studyId: studyId, comment: newComment});
            }
            dispatch(setHomeFunStudies(newHFSComments));
        }
        setOpenEditComment(false);
    }

    function handleCloseComment() {
        setOpenEditComment(false);
    }

    return (
        <Grid item xs>
            <Box mb={1}>
                <Typography variant='subtitle1'>
                    Comment
                </Typography>
                <Button
                    variant="outlined"
                    color="primary"
                    className={classes.rounded_button}
                    startIcon={<Edit/>}
                    onClick={handleOnClickEditComment}
                >
                    <Typography variant="body2">
                        {comment ? <FormattedMessage id="button_edit_comment"/> :
                            <FormattedMessage id="button_add_comment"/>}
                    </Typography>
                </Button>
            </Box>
            <Typography variant="body2" color="textSecondary">
                {comment ? comment : <FormattedMessage id="home_fun_study_comment"/>}
            </Typography>
            <CommentDialog
                open={openEditComment}
                onClose={handleCloseComment}
                onSave={handleSaveComment}
                defaultComment={comment}
            />
        </Grid>
    )
}