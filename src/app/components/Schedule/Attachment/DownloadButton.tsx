import {
    PermissionType,
    useCordovaSystemContext,
} from "@/app/context-provider/cordova-system-context";
import { usePopupContext } from "@/app/context-provider/popup-context";
import {
    checkNetworkToConfirmDownload,
    handleDownloadForAndroid,
    handleDownloadForIOS,
} from "@/app/utils/networkUtils";
import { useCmsApiClient } from "@kl-engineering/cms-api-client";
import {
    CircularProgress,
    createStyles,
    Grid,
    IconButton,
    makeStyles,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { GetApp as GetAppIcon } from "@styled-icons/material";
import { useSnackbar } from "notistack";
import React,
{ useState } from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    wrapper: {
        position: `relative`,
    },
    progress: {
        color: blue[500],
        position: `absolute`,
        top: `50%`,
        left: `50%`,
        marginTop: -12,
        marginLeft: -12,
    },
}));

interface Props {
    attachmentId: string;
    attachmentName: string;
}

export default function AttachmentDownloadButton (props: Props) {
    const { attachmentId, attachmentName } = props;
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const { showPopup } = usePopupContext();
    const { isIOS, requestPermissions } = useCordovaSystemContext();
    const [ downloadingAttachment, setDownloadingAttachment ] = useState(false);

    const { actions } = useCmsApiClient();

    const confirmDownloadAttachment = () => {
        checkNetworkToConfirmDownload(startDownloadAttachment, showPopup, intl);
    };

    const startDownloadAttachment = () => {
        function confirmDownload (onConfirm: () => void) {
            showPopup({
                variant: `detailConfirm`,
                title: intl.formatMessage({
                    id: `label_download`,
                    defaultMessage: `Download`,
                }),
                description: [
                    intl.formatMessage({
                        id: `confirm_download_attachment_description`,
                        description: `Do you want to download?`,
                    }),
                    attachmentName,
                ],
                confirmLabel: intl.formatMessage({
                    id: `label_download`,
                    defaultMessage: `Download`,
                }),
                onConfirm: () => {
                    requestPermissions({
                        permissionTypes: [ PermissionType.READ_STORAGE, PermissionType.WRITE_STORAGE ],
                        onSuccess: (hasPermission) => {
                            if (hasPermission)
                                onConfirm();
                        },
                        onError: () => undefined,
                    });
                },
                closeLabel: intl.formatMessage({
                    id: `button_cancel`,
                    defaultMessage: `Cancel`,
                }),
            });
        }
        confirmDownload(async () => {
            setDownloadingAttachment(true);
            try {
                const resourceBlob = await actions.getContentResourcePathById({
                    resource_id: attachmentId,
                });
                if (isIOS) await handleDownloadForIOS(resourceBlob, attachmentName, shareFile);
                else await handleDownloadForAndroid(resourceBlob, attachmentName);
            } catch (error: any) {
                enqueueSnackbar(intl.formatMessage({
                    id: `scheduleDetails.error.downloadFail`,
                    defaultMessage: error.body ?? error.message,
                }), {
                    variant: `error`,
                    anchorOrigin: {
                        vertical: `bottom`,
                        horizontal: `center`,
                    },
                });
            }
            setDownloadingAttachment(false);
        });
    };

    function shareFile (fileName: string, filePath: string) {
        const options = {
            files: [ filePath ],
        };
        const onSuccess = (result: any) => {
            if (result.completed) {
                enqueueSnackbar(intl.formatMessage({
                    id: `download_complete`,
                    defaultMessage: `Download complete`,
                }), {
                    variant: `success`,
                    anchorOrigin: {
                        vertical: `bottom`,
                        horizontal: `center`,
                    },
                });
            }
        };
        const onError = (message: string) => {
            enqueueSnackbar(message, {
                variant: `error`,
                anchorOrigin: {
                    vertical: `bottom`,
                    horizontal: `center`,
                },
            });
        };
        (window as any).plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
    }

    return (
        <Grid
            item
            xs={2}
            alignContent={`flex-end`}
        >
            <IconButton
                disabled={downloadingAttachment}
                color="primary"
                aria-label="Download attachment"
                component="span"
                onClick={() => {
                    confirmDownloadAttachment();
                }}
            >
                <div className={classes.wrapper}>
                    <GetAppIcon size={24} />
                    {downloadingAttachment && (
                        <CircularProgress
                            size={24}
                            className={classes.progress}
                        />
                    )}
                </div>
            </IconButton>
        </Grid>
    );
}
