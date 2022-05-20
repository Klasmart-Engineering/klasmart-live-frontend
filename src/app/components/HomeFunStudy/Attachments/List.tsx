import { FileIcon } from "@/app/components/icons/fileIcon";
import { useCordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import { usePopupContext } from "@/app/context-provider/popup-context";
import { Attachment, AttachmentStatus } from "@/app/pages/schedule/home-fun-study/[scheduleId]";
import {
    copyFileToDirectory,
    getFileExtensionFromName,
    startDownloadPreview,
} from "@/app/utils/fileUtils";
import { HFSVisibilityState } from "@/app/utils/homeFunStudy";
import { checkNetworkToConfirmDownload } from "@/app/utils/networkUtils";
import {
    DIRECTORY_TARGET_FALLBACK,
    TEXT_COLOR_FILE_NAME,
} from "@/config";
import { useHttpEndpoint } from "@/providers/region-select-context";
import {
    CircularProgress,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import {
    CloudUpload as UploadIcon,
    HighlightOffOutlined as HighlightOffOutlinedIcon,
    Save as SaveIcon,
} from "@mui/icons-material";
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

export default function AttachmentsList(props: Props) {
    const {
        attachments,
        visibilityState,
        onRemoveAttachment,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const { showPopup } = usePopupContext();
    const [idsDownloading, setIdsDownloading] = useState<string[]>([]);
    const cms = useHttpEndpoint(`cms`);
    const { enqueueSnackbar } = useSnackbar();
    const { isIOS } = useCordovaSystemContext();

    const cacheDirectory = useMemo(() => {
        const cordova = window.cordova;
        if (!cordova) return DIRECTORY_TARGET_FALLBACK;
        return isIOS ? cordova.file.tempDirectory : cordova.file.externalCacheDirectory;
    }, [isIOS]);

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

    const onSuccess = (attachmentId: string, savedFilePath: string) => {
        previewFile(attachmentId, savedFilePath);
    }

    const onFailed = (attachmentId: string) => {
        setIdsDownloading((ids) => ids.filter(id => id !== attachmentId));
        enqueueSnackbar(`Couldn't preview this file`, {
            variant: `error`,
            anchorOrigin: {
                vertical: `bottom`,
                horizontal: `center`,
            },
        });
    }

    const confirmOpenAttachmentLink = async (attachment: Attachment) => {
        setIdsDownloading((ids) => [...ids, attachment.attachment_id]);
        if (attachment.status === AttachmentStatus.DRAFT) {
            const cachedFilePath = await copyFileToDirectory(attachment.localPath, cacheDirectory);
            previewFile(attachment.attachment_id, cachedFilePath);
        } else if (attachment.status === AttachmentStatus.SUBMITTED) {
            const url = encodeURI(`${cms}/v1/contents_resources/${attachment.attachment_id}`);
            checkNetworkToConfirmDownload(() => startDownloadPreview(attachment.attachment_id, attachment.attachment_name, url, cacheDirectory, onSuccess, onFailed), showPopup, intl)
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

export function AttachmentSecondaryAction({
    attachment, canEdit, onRemoveAttachment,
}: AttachmentSecondaryActionProps) {
    const classes = useStyles();

    switch (attachment.status) {
        case AttachmentStatus.SUBMITTING:
            return (
                <IconButton
                    edge="end"
                    aria-label="progressing"
                >
                    <div className={classes.wrapper}>
                        <UploadIcon color="primary" />
                        <CircularProgress
                            size={30}
                            className={classes.attachmentProgress}
                        />
                    </div>
                </IconButton>
            );
        case AttachmentStatus.SAVING:
            return (
                <IconButton
                    edge="end"
                    aria-label="progressing"
                >
                    <div className={classes.wrapper}>
                        <SaveIcon color="primary" />
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
                            <HighlightOffOutlinedIcon color="primary" />
                        </IconButton>
                    }
                </>
            );
    }
}
