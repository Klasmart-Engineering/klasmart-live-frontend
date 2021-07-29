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
import {
    getFileExtensionFromName,
    validateFileSize,
    validateFileType
} from "../../utils/fileUtils";
import {FileIcon} from "../../components/fileIcon";
import {setSelectHomeFunStudyDialogOpen} from "../../store/reducers/control";
import {CommentDialog} from "./commentDialog";
import {setHomeFunStudies} from "../../store/reducers/data";
import {BottomSelector} from "../../components/bottomSelector";
import {DetailErrorDialog} from "../../components/dialogs/detailErrorDialog";
import {DetailConfirmDialog} from "../../components/dialogs/detailConfirmDialog";
import {ErrorDialogState} from "../../components/dialogs/baseErrorDialog";
import {ConfirmDialogState} from "../../components/dialogs/baseConfirmDialog";
import {isBlank} from "../../utils/StringUtils";

export type HomeFunStudyFeedback = {
    studyId: string,
    comment: string,
    assignmentItems: AssignmentItem[]
}

export type AssignmentItem = {
    itemId: string,
    attachmentId: string,
    attachmentName: string,
    status: AttachmentStatus,
    file?: File
}

export enum AttachmentStatus {
    SELECTED,
    UPLOADING,
    UPLOADED
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

const now = new Date();
const todayTimeStamp = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;

export function HomeFunStudyDialog() {
    const [studyId, setStudyId] = useState<string>();
    const classes = useStyles();
    const dispatch = useDispatch();
    const selectHomeFunStudyDialog = useSelector((state: State) => state.control.selectHomeFunStudyDialogOpen);
    const hfsFeedbacks = useSelector((state: State) => state.data.hfsFeedbacks); //TODO: Find the comment in this list to submit.
    const {schedulerService} = useServices();
    const {selectedOrg, selectedUserId} = useSelector((state: State) => state.session);
    const [studyInfo, setStudyInfo] = useState<ScheduleResponse>();
    const [feedbacks, setFeedbacks] = useState<ScheduleFeedbackResponse[]>();
    const [key, setKey] = useState(Math.random().toString(36))
    const [loading, setLoading] = useState(false);
    const [shouldShowSubmitButton, setShouldShowSubmitButton] = useState(false);

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

    useEffect(() => {
        function checkShowSubmitButtonCondition(){
            if(studyInfo && !studyInfo.exist_assessment && (studyInfo.due_at === 0 || studyInfo?.due_at >= todayTimeStamp)){
                const feedback = hfsFeedbacks.find(item => item.studyId === studyInfo.id)
                if(feedback && feedback.assignmentItems.length > 0 && !isBlank(feedback.comment)){
                    return true;
                }
            }
            return false
        }
        setShouldShowSubmitButton(checkShowSubmitButtonCondition());
    }, [studyInfo, hfsFeedbacks])
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
                        disabled={!shouldShowSubmitButton}
                        classes={{
                            disabled: classes.disabled_button,
                        }}
                > <FormattedMessage id="button_submit"/></Button>
            </DialogActions>
        </Dialog>)
}

interface ConfirmDeleteAttachmentDialogState extends ConfirmDialogState{
    itemId: string,
    attachmentName: string
}

function HomeFunStudyContainer({
                                   studyInfo,
                                   feedbacks
                               }: { studyInfo?: ScheduleResponse, feedbacks?: ScheduleFeedbackResponse[] }) {
    const intl = useIntl();
    const dispatch = useDispatch();
    const [openSupportFileInfo, setOpenSupportFileInfo] = useState(false);
    const [openButtonSelector, setOpenButtonSelector] = useState(false);
    const [openErrorDialog, setOpenErrorDialog] = useState<ErrorDialogState>({open: false, title: "", description: []});
    const [openDeleteAttachmentDialog, setOpenDeleteAttachmentDialog] = useState<ConfirmDeleteAttachmentDialogState>({
        open: false, title: "", description: [], itemId: "", attachmentName: ""
    });
    const [assignmentItems, setAssignmentItems] = useState<AssignmentItem[]>([]);
    const {fileSelectService} = useServices();
    const {contentService} = useServices();
    const selectedOrg = useSelector((state: State) => state.session.selectedOrg);
    const hfsFeedbacks = useSelector((state: State) => state.data.hfsFeedbacks);
    const [saveAssignmentItems, setSaveAssignmentItems] = useState<{ shouldSave: boolean, assignmentItems: AssignmentItem[] }>()

    function generateAssignmentItemId() {
        return Math.random().toString(36).substring(7);
    }

    function convertAssignmentsToAssignmentItems(assignments: Assignment[]) {
        return assignments.map(item => ({
            itemId: generateAssignmentItemId(),
            attachmentId: item.attachment_id,
            attachmentName: item.attachment_name,
            status: AttachmentStatus.UPLOADED
        }));
    }

    useEffect(() => {
        function displayAssignments() {
            if (!studyInfo)
                return;
            let newAssignmentItems : AssignmentItem[] = [];
            //Submitted feedback from CMS.
            // If the HFS have been submitted, it should be prioritized to show feedback from CMS first.
            if(studyInfo.exist_feedback && feedbacks && feedbacks.length > 0){
                const feedBackAssignments = feedbacks[0].assignments;
                newAssignmentItems = convertAssignmentsToAssignmentItems(feedBackAssignments);
                setAssignmentItems(newAssignmentItems);
                setSaveAssignmentItems({shouldSave: true, assignmentItems: newAssignmentItems})
            }
        }
        displayAssignments()
    }, [studyInfo, feedbacks])

    useEffect(() => {
        function displayAssignmentsFromLocal(){
            if(!studyInfo)
                return;
            let newAssignmentItems : AssignmentItem[] = [];
            if(hfsFeedbacks){
                const currentFeedback = hfsFeedbacks.find(feedback => feedback.studyId === studyInfo.id);
                if (currentFeedback) {
                    newAssignmentItems = currentFeedback.assignmentItems;
                }
            }
            setAssignmentItems(newAssignmentItems);
        }
        displayAssignmentsFromLocal()
    }, [hfsFeedbacks])

    useEffect(() => {
        //Save Assignments after uploaded
        function saveAssignments(assignmentItems: AssignmentItem[]) {
            if (studyInfo) {
                let newHFSFeedbacks = hfsFeedbacks ? hfsFeedbacks.slice() : [];
                let hasFeedback = false;
                for (let i = 0; i < newHFSFeedbacks.length; i++) {
                    if (newHFSFeedbacks[i].studyId == studyInfo.id) {
                        const feedback = newHFSFeedbacks[i];
                        newHFSFeedbacks[i] = {
                            studyId: studyInfo.id,
                            comment: feedback.comment,
                            assignmentItems: assignmentItems
                        };
                        hasFeedback = true;
                        break;
                    }
                }
                if (!hasFeedback) {
                    newHFSFeedbacks.push({studyId: studyInfo.id, comment: "", assignmentItems: assignmentItems});
                }
                dispatch(setHomeFunStudies(newHFSFeedbacks));
            }
        }

        if (saveAssignmentItems && saveAssignmentItems.shouldSave) {
            saveAssignments(saveAssignmentItems.assignmentItems)
        }
    }, [saveAssignmentItems])

    useEffect(() => {
        //Check assignmentItems every time file is selected.
        //If it detects that the file is in selected state, then upload it.
        function uploadSelectedAttachments() {
            if (assignmentItems) {
                let isNeedUpload = false;
                const newAssignmentItems = assignmentItems.slice();
                for (let i = 0; i < newAssignmentItems.length; i++) {
                    if (newAssignmentItems[i].status === AttachmentStatus.SELECTED) {
                        const file = newAssignmentItems[i].file
                        if (file) {
                            uploadAttachment(newAssignmentItems[i].itemId, file);
                            const item = newAssignmentItems[i];
                            newAssignmentItems[i] = {
                                itemId: item.itemId,
                                attachmentId: item.attachmentId,
                                attachmentName: item.attachmentName,
                                status: AttachmentStatus.UPLOADING
                            }
                            isNeedUpload = true;
                        }
                    }
                }
                if (isNeedUpload) {
                    setAssignmentItems(newAssignmentItems);
                }

            }
        }

        uploadSelectedAttachments();
    }, [assignmentItems])

    async function uploadAttachment(assignmentItemId: string, file: File) {
        if (!selectedOrg) {
            throw new Error("Organization is not selected.");
        }
        const contentResourceUploadPathResponse = await contentService?.getContentResourceUploadPath(selectedOrg.organization_id, getFileExtensionFromName(file.name));
        if (contentResourceUploadPathResponse) {
            const uploadResult = await contentService?.uploadAttachment(contentResourceUploadPathResponse.path, file);
            if (uploadResult) {
                updateAssignmentItemStatusToUploaded(assignmentItemId, contentResourceUploadPathResponse.resource_id);
            }
        } else {
            //TODO: Would be implement to alert the failed message (Hung)
        }
    }

    //Update the attachment's status to UPLOADED after upload successfully, then save it to local (only save the attachment_id and attachment_name without need to save the file)
    function updateAssignmentItemStatusToUploaded(itemId: string, resourceId: string) {
        let newAssignmentItems = assignmentItems.slice();
        for (let i = 0; i < newAssignmentItems.length; i++) {
            if (newAssignmentItems[i].itemId === itemId) {
                newAssignmentItems[i] = {
                    itemId: itemId,
                    attachmentId: resourceId,
                    attachmentName: newAssignmentItems[i].attachmentName,
                    status: AttachmentStatus.UPLOADED
                }
                break;
            }
        }
        setAssignmentItems(newAssignmentItems);
        setSaveAssignmentItems({shouldSave: true, assignmentItems: newAssignmentItems});
    }

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

    //Add selected attachment then update the assignmentItems. It would be trigger to upload the attachment.
    function addAnSelectedAttachment(file: File) {
        const newAssignmentItems = assignmentItems.slice();
        const itemId = generateAssignmentItemId();
        newAssignmentItems.push({
            itemId: itemId,
            attachmentId: "",
            attachmentName: file.name,
            status: AttachmentStatus.SELECTED,
            file: file
        });
        setAssignmentItems(newAssignmentItems);
    }

    function handleSelectedFile(file: File) {
        if (validateFileType(file)) {
            if (validateFileSize(file)) {
                console.log(`validated file: ${file.name}`);
                addAnSelectedAttachment(file);
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

    function handleConfirmDeleteAssignmentItem() {
        const newAssignmentItems = assignmentItems.slice();
        for(let i = 0 ; i < newAssignmentItems.length ; i++){
            if(newAssignmentItems[i].itemId === openDeleteAttachmentDialog.itemId){
                newAssignmentItems.splice(i, 1);
                break;
            }
        }
        setAssignmentItems(newAssignmentItems);
        setSaveAssignmentItems({shouldSave: true, assignmentItems: newAssignmentItems});
        setOpenDeleteAttachmentDialog({open: false, title: "", description: [], itemId: "", attachmentName: ""})
    }

    function handleDeleteAssignmentItem(item: AssignmentItem){
        setOpenDeleteAttachmentDialog({
            open: true,
            title: intl.formatMessage({id: "button_delete"}),
            description: [
                intl.formatMessage({id: "confirm_delete_description"}),
                item.attachmentName,
            ],
            itemId: item.itemId,
            attachmentName: item.attachmentName
        })
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
                        <Typography variant='body1' align="center" color='textSecondary'>
                            <FormattedMessage id={"home_fun_study"} />
                            </Typography>
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
                    assignmentItems={assignmentItems} onClickUploadInfo={handleClickUploadInfo}
                    onClickUpload={handleClickUpload} onDeleteAssignment={handleDeleteAssignmentItem}/>
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
            <DetailConfirmDialog open={openDeleteAttachmentDialog.open}
                                 onClose={() => {
                                     setOpenDeleteAttachmentDialog({open: false, title: "", description: [], itemId: "", attachmentName: ""})
                                 }}
                                 onConfirm={handleConfirmDeleteAssignmentItem}
                                 title={openDeleteAttachmentDialog.title}
                                 description={openDeleteAttachmentDialog.description}
                                 closeLabel={intl.formatMessage({id: "button_cancel"})}
                                 confirmLabel={intl.formatMessage({id: "button_delete"})}/>
        </>
    )
}

function HomeFunStudyAssignment({
                                    assignmentItems, onClickUploadInfo,
                                    onClickUpload, onDeleteAssignment,
                                }: {
    assignmentItems: AssignmentItem[], onClickUploadInfo: () => void,
    onClickUpload: () => void, onDeleteAssignment: (item: AssignmentItem) => void
}) {
    const classes = useStyles();

    const [shouldShowChooseFile, setShouldShowChooseFile] = useState(false);
    
    useEffect(() => {
        if(assignmentItems.length >= 3){
            setShouldShowChooseFile(false);
        }else{
            setShouldShowChooseFile(true);
        }
    }, [assignmentItems])

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
                {
                    (shouldShowChooseFile)
                        ? <Typography variant="caption" display="block" color="textSecondary"><FormattedMessage id={"home_fun_study_maximum_three_files"}/></Typography>
                        :  <Typography variant="caption" display="block" color="secondary"><FormattedMessage id={"home_fun_study_maximum_three_files_limited"} /></Typography>
                }

                <Box my={2}>
                    <Button
                        variant="outlined"
                        color="primary"
                        className={classes.rounded_button}
                        onClick={onClickUpload}
                        disabled={!shouldShowChooseFile}
                        startIcon={<StyledIcon icon={<UploadIcon/>} size="medium" color="primary"/>}
                    >
                        <Typography variant="body2">Choose File</Typography>
                    </Button>
                </Box>
                <Box>
                    <List>
                        {assignmentItems.map((item) => (
                            <ListItem key={item.itemId}>
                                <ListItemIcon>
                                    <FileIcon fileType={getFileExtensionFromName(item.attachmentName)}/>
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant="body2"
                                                         color="textSecondary">{item.attachmentName}</Typography>}
                                />
                                <ListItemSecondaryAction>
                                    {
                                        item.status === AttachmentStatus.UPLOADED
                                            ? <IconButton edge="end" aria-label="delete" onClick={() => {
                                                onDeleteAssignment(item)
                                            }}>
                                                <HighlightOffOutlined color="primary"/>
                                            </IconButton>
                                            : <CircularProgress size={20} thickness={4}/>
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
    const hfsFeedbacks = useSelector((state: State) => state.data.hfsFeedbacks);

    useEffect(() => {
        if (studyId) {
            for (let i = 0; hfsFeedbacks && i < hfsFeedbacks.length; i++) {
                if (hfsFeedbacks[i].studyId == studyId) {
                    setComment(hfsFeedbacks[i].comment)
                    break;
                }
            }
        }
    }, [hfsFeedbacks])

    function handleOnClickEditComment() {
        setOpenEditComment(true);
    }

    function handleSaveComment(newComment: string) {
        setComment(newComment);
        if (studyId) {
            let newHFSFeedbacks = hfsFeedbacks ? hfsFeedbacks.slice() : [];
            let hasFeedback = false;
            for (let i = 0; i < newHFSFeedbacks.length; i++) {
                if (newHFSFeedbacks[i].studyId == studyId) {
                    newHFSFeedbacks[i] = {
                        studyId: studyId,
                        comment: newComment,
                        assignmentItems: newHFSFeedbacks[i].assignmentItems
                    };
                    hasFeedback = true;
                    break;
                }
            }
            if (!hasFeedback) {
                newHFSFeedbacks.push({studyId: studyId, comment: newComment, assignmentItems: []});
            }
            dispatch(setHomeFunStudies(newHFSFeedbacks));
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
