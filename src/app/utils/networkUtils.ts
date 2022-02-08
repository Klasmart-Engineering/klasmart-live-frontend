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

export const isCellularConnection = () => {
    switch (navigator.connection.type) {
    case Connection.CELL:
    case Connection.CELL_2G:
    case Connection.CELL_3G:
    case Connection.CELL_4G:
        return true;
    default: return false;
    }
};

export const checkNetworkToConfirmDownload = (onConfirm: () => void, showPopup: (popupState: PopupState) => void, intl: IntlShape) => {
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
