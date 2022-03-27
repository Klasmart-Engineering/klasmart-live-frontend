import { FileIcon } from "@/app/components/icons/fileIcon";
import { useCordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import { usePopupContext } from "@/app/context-provider/popup-context";
import { Attachment } from "@/app/pages/schedule/home-fun-study/[scheduleId]";
import {
    copyFileToDirectory,
    getFileExtensionFromName,
    saveDataBlobToFile,
} from "@/app/utils/fileUtils";
import { HFSVisibilityState } from "@/app/utils/homeFunStudy";
import { isCellularConnection } from "@/app/utils/networkUtils";
import { downloadDataBlob } from "@/app/utils/requestUtils";
import {
    DIRECTORY_TARGET_FALLBACK,
    TEXT_COLOR_FILE_NAME,
} from "@/config";
import { useHttpEndpoint } from "@/providers/region-select-context";
import {
    CircularProgress,
    createStyles,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    Typography,
} from "@material-ui/core";
import {
    CloudUpload as UploadIcon,
    HighlightOffOutlined as HighlightOffOutlinedIcon,
    Save as SaveIcon,
} from "@material-ui/icons";
import { useSnackbar } from "@kl-engineering/kidsloop-px";
import React,
{
    useMemo,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    progress: {
        position: `absolute`,
        top: `50%`,
        left: `50%`,
        marginTop: -12,
        marginLeft: -12,
    },
    attachmentProgress: {
        position: `absolute`,
        top: `-5px`,
        left: `-5px`,
    },
    wrapper: {
        position: `relative`,
    },
    clickableText: {
        textDecoration: `underline`,
        color: TEXT_COLOR_FILE_NAME,
    },
}));

interface Props {
    attachments: Attachment[];
    visibilityState: HFSVisibilityState;
    onRemoveAttachment: (attachment: Attachment) => void;
}

export default function  AttachmentsList (props: Props) {
    const {
        attachments,
        visibilityState,
        onRemoveAttachment,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const { showPopup } = usePopupContext();
    const [ idsDownloading, setIdsDownloading ] = useState<string[]>([]);
    const cms = useHttpEndpoint(`cms`);
    const { enqueueSnackbar } = useSnackbar();
    const { isIOS } = useCordovaSystemContext();

    const cacheDirectory = useMemo(() => {
        const cordova = window.cordova;
        if (!cordova) return DIRECTORY_TARGET_FALLBACK;
        return isIOS ? cordova.file.tempDirectory : cordova.file.externalCacheDirectory;
    }, [ isIOS ]);

    const checkNetworkToConfirmDownload = (onConfirm: () => void) => {
        if (isCellularConnection()) {
            showPopup({
                variant: `confirm`,
                title: intl.formatMessage({
                    id: `confirm_download_file_title`,
                }),
                description: [
                    intl.formatMessage({
                        id: `confirm_download_file_description`,
                    }),
                ],
                closeLabel: intl.formatMessage({
                    id: `button_cancel`,
                }),
                confirmLabel: intl.formatMessage({
                    id: `button_continue`,
                }),
                onConfirm: () => {
                    onConfirm();
                },
            });
            return;
        }
        onConfirm();
    };

    const previewFile = (attachmentId: string, savedFilePath: string) => {
        window.PreviewAnyFile.previewPath(() => {
            setIdsDownloading((ids) => ids.filter(id => id !== attachmentId));
        }, (error: Error) => {
            console.error(error);
            enqueueSnackbar(`Couldn't preview this file`, {
                variant: `error`,
                anchorOrigin: {
                    vertical: `bottom`,
                    horizontal: `center`,
                },
            });
        }, savedFilePath);
    };

    const confirmOpenAttachmentLink = async (attachment: Attachment) => {
        setIdsDownloading((ids) => [ ...ids, attachment.attachment_id ]);
        if(attachment.status === `draft`) {
            const cachedFilePath = await copyFileToDirectory(attachment.localPath, cacheDirectory);
            previewFile(attachment.attachment_id, cachedFilePath);
        }else if(attachment.status === `submitted`) {
            checkNetworkToConfirmDownload(async () => {
                try {
                    const url = encodeURI(`${cms}/v1/contents_resources/${attachment.attachment_id}`);
                    const downloadedBlob = await downloadDataBlob(url);
                    const savedFilePath = await saveDataBlobToFile(downloadedBlob, cacheDirectory, attachment.attachment_name);
                    previewFile(attachment.attachment_id, savedFilePath);
                } catch(error) {
                    setIdsDownloading((ids) => ids.filter(id => id !== attachment.attachment_id));
                    console.error(error);
                    enqueueSnackbar(`Couldn't preview this file`, {
                        variant: `error`,
                        anchorOrigin: {
                            vertical: `bottom`,
                            horizontal: `center`,
                        },
                    });
                }
            });
        }
    };

    const handleRemoveAttachment = (attachment: Attachment) => {
        onRemoveAttachment(attachment);
    };

    return (
        <List>
            {attachments.map((attachment) => (
                <ListItem key={attachment.attachment_id}>
                    <ListItemIcon onClick={() => confirmOpenAttachmentLink(attachment)}>
                        <div className={classes.wrapper}>
                            <FileIcon fileType={getFileExtensionFromName(attachment.attachment_name)} />
                            {idsDownloading.includes(attachment.attachment_id) && (
                                <CircularProgress
                                    size={30}
                                    className={classes.progress}
                                />
                            )}
                        </div>
                    </ListItemIcon>
                    <ListItemText
                        primary={(
                            <Typography
                                className={classes.clickableText}
                                variant="body2"
                                color="textSecondary"
                            >
                                {attachment.attachment_name}
                            </Typography>
                        )}
                        onClick={() => confirmOpenAttachmentLink(attachment)}
                    />
                    <ListItemSecondaryAction>
                        {
                            <AttachmentSecondaryAction
                                canEdit={visibilityState === `visible`}
                                attachment={attachment}
                                onRemoveAttachment={() => handleRemoveAttachment(attachment)}
                            />
                        }
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
    );
}

export interface AttachmentSecondaryActionProps {
    attachment: Attachment;
    canEdit: boolean;
    onRemoveAttachment: React.ReactEventHandler<{}>;
}

export function AttachmentSecondaryAction ({
    attachment, canEdit, onRemoveAttachment,
}:AttachmentSecondaryActionProps) {
    const classes = useStyles();

    switch(attachment.status){
    case `submitting`:
        return (
            <IconButton
                edge="end"
                aria-label="progressing"
            >
                <div className={classes.wrapper}>
                    <UploadIcon color="primary"/>
                    <CircularProgress
                        size={30}
                        className={classes.attachmentProgress}
                    />
                </div>
            </IconButton>
        );
    case `saving`:
        return (
            <IconButton
                edge="end"
                aria-label="progressing"
            >
                <div className={classes.wrapper}>
                    <SaveIcon color="primary"/>
                    <CircularProgress
                        size={30}
                        className={classes.attachmentProgress}
                    />
                </div>
            </IconButton>
        );
    default:
        return (
            <>
                {canEdit &&
                    <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={onRemoveAttachment}
                    >
                        <HighlightOffOutlinedIcon color="primary"/>
                    </IconButton>
                }
            </>
        );
    }
}
