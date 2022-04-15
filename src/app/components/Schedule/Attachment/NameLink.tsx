import { useCordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import { usePopupContext } from "@/app/context-provider/popup-context";
import {
    convertFileNameToUnderscores,
    getCacheDirectory,
    saveDataBlobToFile,
} from "@/app/utils/fileUtils";
import { checkNetworkToConfirmDownload } from "@/app/utils/networkUtils";
import { TEXT_COLOR_SIGN_OUT } from "@/config";
import { useCmsApiClient } from "@kl-engineering/cms-api-client";
import { useSnackbar } from "@kl-engineering/kidsloop-px";
import {
    CircularProgress,
    createStyles,
    Grid,
    Link,
    makeStyles,
    Typography,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import React,
{ useState } from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    attachmentName: {
        color: TEXT_COLOR_SIGN_OUT,
        fontWeight: theme.typography.fontWeightBold as number,
        textOverflow: `ellipsis`,
        overflow: `hidden`,
    },
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

export default function AttachmentNameLink (props: Props) {
    const { attachmentId, attachmentName } = props;
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const { showPopup } = usePopupContext();
    const { isIOS } = useCordovaSystemContext();
    const [ downloadingPreview, setDownloadingPreview ] = useState(false);

    const { actions } = useCmsApiClient();

    const confirmOpenAttachmentLink = () => {
        checkNetworkToConfirmDownload(startDownloadPreview, showPopup, intl);
    };

    const startDownloadPreview = async () => {
        if (downloadingPreview) return;
        setDownloadingPreview(true);
        try {
            const resourceBlob = await actions.getContentResourcePathById({
                resource_id: attachmentId,
            });
            const filePath = await saveDataBlobToFile(resourceBlob, getCacheDirectory(isIOS), convertFileNameToUnderscores(attachmentName));
            const previewAnyFile = (window as any).PreviewAnyFile;
            previewAnyFile.previewPath((result: string) => {
                console.log(`file preview finalized: `, result);
            }, (error: any) => {
                enqueueSnackbar(intl.formatMessage({
                    id: `scheduleDetails.error.downloadFail`,
                    defaultMessage: error.message,
                }), {
                    variant: `error`,
                    anchorOrigin: {
                        vertical: `bottom`,
                        horizontal: `center`,
                    },
                });
            }, filePath);
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
        setDownloadingPreview(false);
    };

    return (
        <Grid
            item
            xs={10}
            alignContent={`flex-start`}
        >
            <div className={classes.wrapper}>
                <Typography
                    noWrap
                    variant="body1"
                    className={classes.attachmentName}
                >
                    <Link
                        variant="body1"
                        href={`#`}
                        color={downloadingPreview ? `textSecondary` : `primary`}
                        aria-disabled={downloadingPreview}
                        onClick={() => confirmOpenAttachmentLink()}
                    >
                        {attachmentName}
                    </Link>
                </Typography>
                {downloadingPreview && (
                    <CircularProgress
                        size={24}
                        className={classes.progress}
                    />
                )}
            </div>
        </Grid>
    );
}
