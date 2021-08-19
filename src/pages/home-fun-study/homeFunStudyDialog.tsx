import React, {useContext, useEffect, useState, useMemo} from "react";
import {Header} from "../../components/header";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Typography
} from "@material-ui/core";
import CircularProgress, { CircularProgressProps } from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import {Edit, HighlightOffOutlined, InfoOutlined} from "@material-ui/icons";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
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
    getFileExtensionFromType,
    validateFileSize,
    validateFileType
} from "../../utils/fileUtils";
import {FileIcon} from "../../components/fileIcon";
import {setSelectHomeFunStudyDialogOpen} from "../../store/reducers/control";
import {CommentDialog} from "./commentDialog";
import {setHomeFunStudies} from "../../store/reducers/data";
import {BottomSelector} from "../../components/bottomSelector";
import {useSnackbar} from "kidsloop-px";
import {blue} from "@material-ui/core/colors";
import clsx from "clsx";
import {usePopupContext} from "../../context-provider/popup-context";
import {CordovaSystemContext, PermissionType} from "../../context-provider/cordova-system-context";
import useCordovaInitialize from "../../cordova-initialize";
import {CustomCircularProgress} from "../../components/customCircularProgress";

export type HomeFunStudyFeedback = {
    userId: string,
    studyId: string,
    comment: string,
    assignmentItems: AssignmentItem[]
}

export type AssignmentItem = {
    itemId: string,
    attachmentId: string,
    attachmentName: string,
    status: AttachmentStatus,
    file?: File,
    uploadProgress?: number
}

export enum AttachmentStatus {
    SELECTED,
    UPLOADING,
    UPLOADED
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles ({
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
        },
        buttonWrapper: {
            width: "100%",
            margin: theme.spacing(1),
            position: 'relative',
        },
        buttonSubmitting: {
            backgroundColor:"#d7e4f5",
        },
        buttonProgress: {
            color: blue[500],
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -12,
            marginLeft: -12,
        },
    }
));

const now = new Date();
const todayTimeStamp = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;

enum SubmitStatus {
    NONE, UPLOADING,SUBMITTING, SUCCESS
}

const HFS_ON_BACK_ID = "hfs_onBack"

export function HomeFunStudyDialog() {
    const intl = useIntl();
    const [studyId, setStudyId] = useState<string>();
    const classes = useStyles();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const {showPopup} = usePopupContext();
    const selectHomeFunStudyDialog = useSelector((state: State) => state.control.selectHomeFunStudyDialogOpen);
    const hfsFeedbacks = useSelector((state: State) => state.data.hfsFeedbacks);
    const {schedulerService} = useServices();
    const {selectedOrg, selectedUserId} = useSelector((state: State) => state.session);
    const [studyInfo, setStudyInfo] = useState<ScheduleResponse>();
    const [newestFeedback, setNewestFeedback] = useState<ScheduleFeedbackResponse>();
    const [key, setKey] = useState(Math.random().toString(36))
    const [loading, setLoading] = useState(false);
    const [shouldSubmitFeedback, setShouldSubmitFeedback] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(SubmitStatus.NONE);
    const { addOnBack, removeOnBack } = useContext(CordovaSystemContext);

    useEffect(() => {
        lockOrientation(OrientationType.PORTRAIT, dispatch);
        //Reset state for the first render
        dispatch(setSelectHomeFunStudyDialogOpen({open: false}))
    }, [])

    function handleCloseHomeFunStudy() {
        dispatch(setSelectHomeFunStudyDialogOpen({open: false, studyInfo: undefined}))
    }

    useEffect(() => {
        //Wait for the reset state completed
        setTimeout(() => {
            if(selectHomeFunStudyDialog.open && newestFeedback && !newestFeedback.is_allow_submit){
                showPopup({
                    variant: "info",
                    title: intl.formatMessage({id: "label_info", defaultMessage: "Info"}),
                    description: [intl.formatMessage({id: "block_for_assessment_completed", defaultMessage: "This assignment has already been assessed by the teacher and can no longer be edited or re-submitted."})],
                    closeLabel: intl.formatMessage({id: "button_close", defaultMessage: "Close"})
                })
            }
        },200)
    }, [newestFeedback])

    useEffect(() => {
        if (selectHomeFunStudyDialog?.studyId) {
            setStudyId(selectHomeFunStudyDialog.studyId);
            setKey(Math.random().toString(36)); //force to refresh HFS detail
        }
        if(selectHomeFunStudyDialog.open){
            if (addOnBack) {
                addOnBack({
                    id: HFS_ON_BACK_ID,
                    onBack: () => {
                        handleCloseHomeFunStudy()
                    }
                })
            }
        }else{
            if(removeOnBack){
                removeOnBack(HFS_ON_BACK_ID)
            }
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
                const newestFeedbackPayload = await schedulerService.getNewestFeedback(selectedOrg.organization_id, studyId, selectedUserId);
                setNewestFeedback(newestFeedbackPayload);
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

    function getLocalFeedback(userId: string, studyId: string) {
        return hfsFeedbacks.find(feedback => feedback.userId === userId && feedback.studyId === studyId)
    }

    const shouldShowSubmitButton = useMemo(() => {
        if(submitStatus === SubmitStatus.SUBMITTING)
            return false;
        if (selectedUserId && studyInfo && newestFeedback?.is_allow_submit && (studyInfo.due_at === 0 || studyInfo?.due_at >= todayTimeStamp)) {
            const feedback = getLocalFeedback(selectedUserId, studyInfo.id);
            if (feedback && feedback.assignmentItems.length > 0 && feedback.assignmentItems.length <= MAX_FILE_LIMIT) {
                return true;
            }
        }
        return false
    },[selectedUserId,studyInfo, hfsFeedbacks, submitStatus, newestFeedback])


    useEffect(() => {
        async function submitFeedback(){
            if (!schedulerService) {
                throw new Error("Scheduler service not available.");
            }

            if (!selectedOrg) {
                throw new Error("Organization is not selected.");
            }
            if(!shouldSubmitFeedback || !studyInfo || !hfsFeedbacks || !selectedUserId)
                return ;
            const currentFeedback = getLocalFeedback(selectedUserId, studyInfo.id);
            if(!currentFeedback)
                return ;
            if(submitStatus === SubmitStatus.SUBMITTING)
                return ;

            setShouldSubmitFeedback(false);
            setSubmitStatus(SubmitStatus.SUBMITTING);

            await schedulerService.postScheduleFeedback(
                selectedOrg.organization_id, studyInfo.id, currentFeedback.comment,
                currentFeedback.assignmentItems.map((item, index) => ({attachment_id: item.attachmentId, attachment_name: item.attachmentName, number: index})))
                .then(result => {
                    if(result && result.data && result.data.id){
                        setSubmitStatus(SubmitStatus.SUCCESS);
                        enqueueSnackbar(intl.formatMessage({id: "submission_successful", defaultMessage: "Submission successful"}), {
                            variant: "success",
                            anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'center',
                            }
                        })
                        dispatch(setSelectHomeFunStudyDialogOpen({open: false, submitted: true})) //trigger to refresh the schedule list
                    }else{
                        if(result && result.label){
                            showPopup({
                                variant: 'detailError',
                                title: intl.formatMessage({id: "submission_failed", defaultMessage: "Submission Failed"}),
                                description: [ intl.formatMessage({id: "submission_failed_message", defaultMessage: "Oops, an unexpected error occurred. Please try again."}), result.label ],
                                closeLabel: intl.formatMessage({id: "button_ok", defaultMessage: "Ok"})
                            });
                        }else{
                            showPopup({
                                variant: 'error',
                                title: intl.formatMessage({id: "submission_failed", defaultMessage: "Submission Failed"}),
                                description: [ intl.formatMessage({id: "submission_failed_message", defaultMessage: "Oops, an unexpected error occurred. Please try again."}) ],
                                closeLabel: intl.formatMessage({id: "button_ok", defaultMessage: "Ok"})
                            });
                        }
                    }
                    setSubmitStatus(SubmitStatus.NONE);
                }).catch(err => {
                    setSubmitStatus(SubmitStatus.NONE);
                    showPopup({
                        variant: 'detailError',
                        title: intl.formatMessage({id: "submission_failed", defaultMessage: "Submission Failed"}),
                        description: [ intl.formatMessage({id: "submission_failed_message", defaultMessage: "Oops, an unexpected error occurred. Please try again."}), err.message ],
                        closeLabel: intl.formatMessage({id: "button_ok", defaultMessage: "Ok"})
                    });
                })
        }
        if(shouldSubmitFeedback === true){
            setShouldSubmitFeedback(false)
            if(submitStatus === SubmitStatus.UPLOADING){
                showPopup({
                    variant: "error",
                    title: intl.formatMessage({id: "submission_failed", defaultMessage: "Submission Failed"}),
                    description: [intl.formatMessage({id: "err_try_after_uploaded", defaultMessage: "Can't complete submitting. Please try after file uploading is finished."})],
                    closeLabel: intl.formatMessage({id: "button_ok", defaultMessage: "Ok"})
                })
            }else{
                submitFeedback()
            }
        }

    }, [selectedOrg, studyInfo, hfsFeedbacks, schedulerService, shouldSubmitFeedback, submitStatus])

    return (
        <Dialog
            aria-labelledby="select-home-fun-study-dialog"
            fullScreen
            open={selectHomeFunStudyDialog? selectHomeFunStudyDialog.open : false}
            onClose={handleCloseHomeFunStudy}
        >
            <DialogTitle className={classes.noPadding}>
                <Header setKey={setKey}/>
            </DialogTitle>
            <DialogContent>
                {!loading ?
                    <HomeFunStudyContainer studyInfo={studyInfo} newestFeedback={newestFeedback} setSubmitStatus={setSubmitStatus}/>
                    : <Loading messageId={"cordova_loading"} retryCallback={() => {
                        setKey(Math.random().toString(36))
                    }}/>}
            </DialogContent>
            <DialogActions className={classes.dialogActionsPadding}>
                <div className={classes.buttonWrapper}>
                    <Button fullWidth variant="contained"
                            className={clsx({
                                [classes.buttonSubmitting]: submitStatus === SubmitStatus.SUBMITTING,
                            }, classes.rounded_button)}
                            color="primary"
                            disabled={!shouldShowSubmitButton}
                            onClick={() => {setShouldSubmitFeedback(true)}}
                    > <FormattedMessage id="button_submit"/></Button>
                    {submitStatus === SubmitStatus.SUBMITTING ? <CircularProgress size={24} className={classes.buttonProgress} />: ''}
                </div>

            </DialogActions>
        </Dialog>)
}

function HomeFunStudyContainer({
                                   studyInfo,
                                   newestFeedback,
                                    setSubmitStatus
                               }: { studyInfo?: ScheduleResponse, newestFeedback?: ScheduleFeedbackResponse, setSubmitStatus: (status: SubmitStatus) => void }) {
    const intl = useIntl();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const [openSupportFileInfo, setOpenSupportFileInfo] = useState(false);
    const [openButtonSelector, setOpenButtonSelector] = useState(false);
    const {showPopup} = usePopupContext()
    const [assignmentItems, setAssignmentItems] = useState<AssignmentItem[]>([]);
    const {fileSelectService, contentService} = useServices();
    const selectedOrg = useSelector((state: State) => state.session.selectedOrg);
    const selectedUserId = useSelector((state: State) => state.session.selectedUserId);
    const hfsFeedbacks = useSelector((state: State) => state.data.hfsFeedbacks);
    const [saveAssignmentItems, setSaveAssignmentItems] = useState<{ shouldSave: boolean, assignmentItems: AssignmentItem[] }>();
    const {requestPermissions} = useContext(CordovaSystemContext)
    const [shouldSyncAssignments, setShouldSyncAssignments] = useState(false)
    const [attachmentFile, setAttachmentFile] = useState<File>()
    const [uploadedAttachment, setUploadedAttachment] = useState<{itemId: string, resourceId: string}>()
    const [deletedAssignmentItemId, setDeletedAssignmentItemId] = useState<string>()
    const [uploadProgress, setUploadProgress] = useState<{itemId: string, progress: number}>()

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
    function getLocalFeedback(userId: string, studyId: string) {
        return hfsFeedbacks.find(feedback => feedback.userId === userId && feedback.studyId === studyId)
    }

    function getLocalAssignmentItems(userId: string, studyId: string) {
        return getLocalFeedback(userId, studyId)?.assignmentItems ?? []
    }

    useEffect(() => {
        setShouldSyncAssignments(true)
    }, [newestFeedback])

    useEffect(() => {
        function mergeLocalAssignmentWithCMSAssignment(localAssignments: AssignmentItem[],  cmsAssignments: AssignmentItem[]) : AssignmentItem[]{
            const hasNotSubmittedAssignments = localAssignments.filter(item => cmsAssignments.find(cmsItem => cmsItem.attachmentId === item.attachmentId) === undefined)
            return cmsAssignments.concat(hasNotSubmittedAssignments)
        }

        function syncAssignments() {
            if (!selectedUserId) return;
            if (!studyInfo) return;
            if(!newestFeedback) return;
            if(!hfsFeedbacks) return;

            const localAssignmentItems: AssignmentItem[]  = getLocalAssignmentItems(selectedUserId, studyInfo.id);
            let newAssignmentItems: AssignmentItem[] = [];

            if (newestFeedback) {
                const feedBackAssignments = newestFeedback.assignments ? newestFeedback.assignments : [];
                newAssignmentItems = convertAssignmentsToAssignmentItems(feedBackAssignments);
                newAssignmentItems = mergeLocalAssignmentWithCMSAssignment(localAssignmentItems, newAssignmentItems)
                setAssignmentItems(newAssignmentItems);
                setSaveAssignmentItems({shouldSave: true, assignmentItems: newAssignmentItems})
            }
        }

        if(shouldSyncAssignments){
            setShouldSyncAssignments(false)
            syncAssignments()
        }

    }, [selectedUserId, newestFeedback, hfsFeedbacks, studyInfo, shouldSyncAssignments])

    useEffect(() => {
        //Save Assignments after uploaded
        function saveAssignments(assignmentItems: AssignmentItem[]) {
            if (studyInfo && selectedUserId) {
                let newHFSFeedbacks = hfsFeedbacks ? hfsFeedbacks.slice() : [];
                const currentFeedbackIndex = newHFSFeedbacks.findIndex(item => item.userId === selectedUserId && item.studyId === studyInfo.id)
                if(currentFeedbackIndex >= 0){
                    const feedback = newHFSFeedbacks[currentFeedbackIndex];
                    newHFSFeedbacks[currentFeedbackIndex] = {
                        userId: selectedUserId,
                        studyId: studyInfo.id,
                        comment: feedback.comment,
                        assignmentItems: assignmentItems
                    };
                }
                else{
                    newHFSFeedbacks.push({userId: selectedUserId, studyId: studyInfo.id, comment: "", assignmentItems: assignmentItems});
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

        function updateSubmitStatus(){
            if(assignmentItems){
                if(assignmentItems.filter(item => item.status === AttachmentStatus.UPLOADING).length > 0){
                    setSubmitStatus(SubmitStatus.UPLOADING)
                }else{
                    setSubmitStatus(SubmitStatus.NONE)
                }
            }
        }

        uploadSelectedAttachments();
        updateSubmitStatus();
    }, [assignmentItems])

    useEffect(() => {
        function updateUploadProgressForAssignmentItem(itemId: string, progress: number) {
            if(!assignmentItems) return;
            const newAssignmentItems = assignmentItems.slice();
            const itemIndex = newAssignmentItems.findIndex(item => item.itemId === itemId)
            if(itemIndex >= 0){
                newAssignmentItems[itemIndex] = {
                    ...newAssignmentItems[itemIndex],
                    uploadProgress: progress
                }
                setAssignmentItems(newAssignmentItems)
            }
        }
        if(uploadProgress){
            updateUploadProgressForAssignmentItem(uploadProgress.itemId, uploadProgress.progress)
            setUploadProgress(undefined)
        }
    }, [uploadProgress, assignmentItems])

    async function uploadAttachment(assignmentItemId: string, file: File) {
        if (!selectedOrg) {
            throw new Error("Organization is not selected.");
        }
        try {
            const contentResourceUploadPathResponse = await contentService?.getContentResourceUploadPath(selectedOrg.organization_id, getFileExtensionFromType(file.type));
            if (contentResourceUploadPathResponse) {

                    const uploadResult = await contentService?.uploadAttachment(contentResourceUploadPathResponse.path, file, (completed) => {
                        setUploadProgress({itemId: assignmentItemId, progress: completed})
                    });
                    if (uploadResult) {
                        setUploadedAttachment({itemId: assignmentItemId, resourceId: contentResourceUploadPathResponse.resource_id});
                    }else{
                        throw new Error("Upload failed.")
                    }
            } else {
                throw new Error("Get upload path failed.")
            }
        } catch(error) {
            setDeletedAssignmentItemId(assignmentItemId);
            enqueueSnackbar(intl.formatMessage({ id: "file_upload_failed", defaultMessage: "File upload failed. Please check your file and try again." }), {
                variant: "error",
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'center',
                }
            });
        }
    }

    //Update the attachment's status to UPLOADED after upload successfully, then save it to local (only save the attachment_id and attachment_name without need to save the file)
    useEffect(() => {
        function updateAssignmentItemStatusToUploaded(itemId: string, resourceId: string) {
            if(!assignmentItems) return;
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
            setSaveAssignmentItems({shouldSave: true, assignmentItems: newAssignmentItems.filter(item => item.status === AttachmentStatus.UPLOADED)});
        }
        if(uploadedAttachment){
            updateAssignmentItemStatusToUploaded(uploadedAttachment.itemId, uploadedAttachment.resourceId);
            setUploadedAttachment(undefined)
        }
    }, [uploadedAttachment, assignmentItems])

    function handleClickUploadInfo() {
        setOpenSupportFileInfo(true);
    }

    function handleClickUpload() {
        setOpenButtonSelector(true);
    }

    function onSelectFile() {
        requestPermissions({
            permissionTypes: [PermissionType.READ_STORAGE],
            onSuccess: (hasPermission) => {
                if(hasPermission){
                    fileSelectService?.selectFile().then(file => {
                        console.log(`selected file: ${file.name}`);
                        setOpenButtonSelector(false);
                        handleSelectedFile(file);
                    }).catch(error => {
                        console.error(error);
                    });
                }else{
                    enqueueSnackbar("Couldn't request permissions",{
                        variant: "error",
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "center"
                        }
                    })
                }
            },
            onError: () => {
                enqueueSnackbar("Couldn't request permissions",{
                    variant: "error",
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "center"
                    }
                })
            }
        })

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
        requestPermissions({
            permissionTypes: [PermissionType.READ_STORAGE],
            onSuccess: (hasPermission) => {
                if(hasPermission){
                    fileSelectService?.selectFromGallery().then(file => {
                        console.log(`selected from gallery: ${file.name}`);
                        setOpenButtonSelector(false);
                        handleSelectedFile(file)
                    }).catch(error => {
                        console.error(error);
                    });
                }else{
                    enqueueSnackbar("Couldn't request permissions",{
                        variant: "error",
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "center"
                        }
                    })
                }
            },
            onError: () => {
                enqueueSnackbar("Couldn't request permissions",{
                    variant: "error",
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "center"
                    }
                })
            }
        })
    }

    //Add selected attachment then update the assignmentItems. It would be trigger to upload the attachment.
    useEffect(() => {
        function addAnSelectedAttachment(file: File) {
            if(!assignmentItems) return;
            const newAssignmentItems = assignmentItems.slice();
            const itemId = generateAssignmentItemId();

            var name = file.name;
            var extension = getFileExtensionFromType(file.type);

            // NOTE: IF the file name is content we'll generate a more
            // unique name with extension for the assignment.
            if (name === `content`) {
                if (extension.length) {
                    name = `attachment_${itemId}.${extension}`;
                } else {
                    name = `attachment_${itemId}`;
                }
            }
            newAssignmentItems.push({
                itemId: itemId,
                attachmentId: "",
                attachmentName: name,
                status: AttachmentStatus.SELECTED,
                file: file
            });
            setAssignmentItems(newAssignmentItems);
        }
        if(attachmentFile){
            addAnSelectedAttachment(attachmentFile)
            setAttachmentFile(undefined)
        }
    }, [attachmentFile, assignmentItems])


    function handleSelectedFile(file: File) {
        if (validateFileType(file)) {
            if (validateFileSize(file)) {
                console.log(`validated file: ${file.name}`);

                const confirmCellularUpload = () => {
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
                            title: intl.formatMessage({ id: "confirm_upload_file_title", defaultMessage: "Please connect to WiFi" }),
                            description: [intl.formatMessage({ id: "confirm_upload_file_description" , defaultMessage: "You are currently not connected to WiFi. Do you want to continue uploading this file using cellular data?"})],
                            closeLabel: intl.formatMessage({ id: "button_cancel", defaultMessage: "Cancel" }),
                            confirmLabel: intl.formatMessage({ id: "button_continue", defaultMessage: "Continue" }),
                            onConfirm: () => {
                                setAttachmentFile(file);
                            }
                        });
                    } else {
                        setAttachmentFile(file);
                    }
                };

                showPopup({
                    variant: "confirm",
                    title: intl.formatMessage({id: "upload_file", defaultMessage: "Upload file"}),
                    description: [intl.formatMessage({id: "confirm_to_upload_file", defaultMessage: "Selected file will be uploaded. Do you want to continue?"})],
                    closeLabel: intl.formatMessage({id: "button_cancel", defaultMessage: "Cancel"}),
                    confirmLabel: intl.formatMessage({id: "button_upload", defaultMessage: "Upload"}),
                    onConfirm: () => {
                        // TODO: I have to use setTimeout for opening the nested
                        // popup window because currently usePopupContext doesn't
                        // support opening additional popup windows within the
                        // onConfirm/onCancel callback functions.
                        setTimeout(confirmCellularUpload, 200);
                    }
                });
            } else {
                showPopup({
                    variant: "detailError",
                    title: intl.formatMessage({id: "submission_failed", defaultMessage: "Submission Failed"}),
                    description: [
                        intl.formatMessage({id: "upload_please_check_your_file", defaultMessage: "Please Check Your File!"}),
                        intl.formatMessage({id: "upload_file_too_big", defaultMessage: "Uploaded file should not be bigger than 100MB. Please try another file."})
                    ],
                    closeLabel: intl.formatMessage({id: "button_ok", defaultMessage: "Ok"})
                })
            }
        } else {
            showPopup({
                variant: "detailError",
                title: intl.formatMessage({id: "submission_failed", defaultMessage: "Submission Failed"}),
                description: [
                    intl.formatMessage({id: "upload_please_check_your_file", defaultMessage: "Please Check Your File!"}),
                    intl.formatMessage({id: "upload_file_not_supported", defaultMessage: "This file format is not supported. Please try another file."})
                ],
                closeLabel: intl.formatMessage({id: "button_ok", defaultMessage: "Ok"})
            })
        }
    }

    useEffect(() => {
        function deleteAssignmentItem(assignmentItemId: string) {
            if(!assignmentItems) return;
            const newAssignmentItems = assignmentItems.slice();
            for(let i = 0 ; i < newAssignmentItems.length ; i++){
                if(newAssignmentItems[i].itemId === assignmentItemId){
                    newAssignmentItems.splice(i, 1);
                    break;
                }
            }
            setAssignmentItems(newAssignmentItems);
            setSaveAssignmentItems({shouldSave: true, assignmentItems: newAssignmentItems});
        }
        if(deletedAssignmentItemId){
            deleteAssignmentItem(deletedAssignmentItemId);
            setDeletedAssignmentItemId(undefined)
        }
    }, [deletedAssignmentItemId, assignmentItems])


    function handleDeleteAssignmentItem(item: AssignmentItem){
        showPopup({
            variant: "confirm",
            title: intl.formatMessage({id: "button_delete", defaultMessage: "Delete"}),
            description: [
                intl.formatMessage({id: "confirm_delete_description", defaultMessage: "Are you sure you want to Delete?"}),
                item.attachmentName,
            ],
            closeLabel: intl.formatMessage({id: "button_cancel", defaultMessage: "Cancel"}),
            onConfirm: () => {
                setDeletedAssignmentItemId(item.itemId);
            },
            confirmLabel: intl.formatMessage({id: "button_delete", defaultMessage: "Delete"})
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
                    studyInfo={studyInfo}
                    newestFeedback={newestFeedback}
                    assignmentItems={assignmentItems}
                    onClickUploadInfo={handleClickUploadInfo} onClickUpload={handleClickUpload}
                    onDeleteAssignment={handleDeleteAssignmentItem} />
                <HomeFunStudyComment
                    studyInfo={studyInfo}
                    newestFeedback={newestFeedback}
                    defaultComment={newestFeedback ? newestFeedback.comment : ""}
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
        </>
    )
}
const MAX_FILE_LIMIT = 3
function HomeFunStudyAssignment({
                                    studyInfo, newestFeedback,
                                    assignmentItems, onClickUploadInfo,
                                    onClickUpload, onDeleteAssignment,
                                }: {
    studyInfo?: ScheduleResponse, newestFeedback?: ScheduleFeedbackResponse, assignmentItems: AssignmentItem[], onClickUploadInfo: () => void,
    onClickUpload: () => void, onDeleteAssignment: (item: AssignmentItem) => void
}) {
    const {isAndroid} = useCordovaInitialize();
    const classes = useStyles();
    const shouldShowChooseFile = useMemo(() => {
        // const fileIsBeingUploaded = assignmentItems.some(item => item.status === AttachmentStatus.UPLOADING);
        // if (fileIsBeingUploaded) {
        //     return false;
        // }

        return studyInfo && assignmentItems.length < MAX_FILE_LIMIT && newestFeedback?.is_allow_submit;
    }, [assignmentItems, studyInfo, newestFeedback]);

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
                    (assignmentItems.length < MAX_FILE_LIMIT)
                        ? <Typography variant="caption" display="block" color="textSecondary"><FormattedMessage id={"home_fun_study_maximum_three_files"}/></Typography>
                        :  <Typography variant="caption" display="block" color="secondary"><FormattedMessage id={"home_fun_study_maximum_three_files_limited"} /></Typography>
                }
                <Box my={2}>
                    <Button
                        variant="outlined"
                        color="primary"
                        className={classes.rounded_button}
                        onClick={onClickUpload}
                        disabled={!shouldShowChooseFile }
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
                                {
                                    newestFeedback?.is_allow_submit ?
                                    <ListItemSecondaryAction>
                                        {
                                            item.status === AttachmentStatus.UPLOADED
                                                ? <IconButton edge="end" aria-label="delete" onClick={() => {
                                                    onDeleteAssignment(item)
                                                }}>
                                                    <HighlightOffOutlined color="primary"/>
                                                </IconButton>
                                                : isAndroid ? <CustomCircularProgress size={20} thickness={4} value={item.uploadProgress}/> : <CustomCircularProgress size={20} thickness={4}/>
                                        }
                                    </ListItemSecondaryAction>
                                        : ''
                                }

                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Box>
        </Grid>
    );
}

function HomeFunStudyComment({studyInfo, newestFeedback, defaultComment}: { studyInfo?: ScheduleResponse, newestFeedback?: ScheduleFeedbackResponse, defaultComment: string }) {
    const classes = useStyles();

    const dispatch = useDispatch();
    const [openEditComment, setOpenEditComment] = useState(false);
    const [comment, setComment] = useState(defaultComment);
    const hfsFeedbacks = useSelector((state: State) => state.data.hfsFeedbacks);
    const selectedUserId = useSelector((state: State) => state.session.selectedUserId);

    useEffect(() => {
        if (studyInfo && studyInfo.id && selectedUserId) {
            for (let i = 0; hfsFeedbacks && i < hfsFeedbacks.length; i++) {
                if (hfsFeedbacks[i].userId == selectedUserId && hfsFeedbacks[i].studyId == studyInfo.id) {
                    setComment(hfsFeedbacks[i].comment)
                    break;
                }
            }
        }
    }, [selectedUserId, studyInfo, hfsFeedbacks])

    function handleOnClickEditComment() {
        setOpenEditComment(true);
    }

    function handleSaveComment(newComment: string) {
        setComment(newComment);
        if (studyInfo && selectedUserId) {
            let newHFSFeedbacks = hfsFeedbacks ? hfsFeedbacks.slice() : [];
            const currentFeedbackIndex = newHFSFeedbacks.findIndex(item => item.userId === selectedUserId && item.studyId === studyInfo.id);
            if(currentFeedbackIndex >= 0){
                newHFSFeedbacks[currentFeedbackIndex] = {
                    userId: selectedUserId,
                    studyId: studyInfo.id,
                    comment: newComment,
                    assignmentItems: newHFSFeedbacks[currentFeedbackIndex].assignmentItems
                };
            }
            else{
                newHFSFeedbacks.push({userId: selectedUserId, studyId: studyInfo.id, comment: newComment, assignmentItems: []});
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
                    disabled={!newestFeedback?.is_allow_submit}
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
