import {
    convertFileNameToUnderscores,
    generateUniqueFileName,
    getCacheDirectory,
    getDownloadDirectory,
    getFilesInDirectory,
    saveDataBlobToFile,
} from "./fileUtils";
import { PopupState } from "@/app/context-provider/popup-context";
import { IntlShape } from "react-intl";

export const checkNetworkToConfirmDownload = (onConfirm: () => void, showPopup: (popupState: PopupState) => void, intl: IntlShape) => {
    // reference: https://cordova.apache.org/docs/en/10.x/reference/cordova-plugin-network-information/
    const connectionType = (navigator as any).connection.type;
    const isCellularConnection = connectionType == `2g` ||
      connectionType == `3g` ||
      connectionType == `4g` ||
      connectionType == `5g` || // NOTE: Not sure if plugin supports 5g yet, adding it for future safery.
      connectionType == `cellular`;

    if (isCellularConnection) {
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
    } else {
        onConfirm();
    }
};

export const handleDownloadForIOS = async (downloadedData: Blob, fileName: string, shareFile: (fileName: string, filePath: string) => void) => {
    const isIOS = true;
    const filePath = await saveDataBlobToFile(downloadedData, getCacheDirectory(isIOS), convertFileNameToUnderscores(fileName));
    shareFile(fileName, filePath);
};

export const handleDownloadForAndroid = async (downloadedData: Blob, fileName: string) => {
    const isIOS = false;
    const downloadDirectory = getDownloadDirectory(isIOS);
    const fileNames = await getFilesInDirectory(downloadDirectory);
    const targetFileName = generateUniqueFileName(fileNames, convertFileNameToUnderscores(fileName));
    return saveDataBlobToFile(downloadedData, downloadDirectory, targetFileName);
};
