import {
    ACCEPT_MIME_TYPES,
    MIME_TO_EXTENSION,
} from "@/app/services/files/FileSelectService";
import { generateRandomString } from "@/utils/StringUtils";
import { downloadDataBlob } from "./requestUtils";

const MIME_TYPES_REGEX = ACCEPT_MIME_TYPES.split(`,`)
    .map(unescapedMime => unescapedMime.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`))
    .map(escapedMime => new RegExp(`^` + escapedMime.replace(/\*/g, `.*`)));

export function getFileExtensionFromName (fileName: string): string {
    const fileExtension = fileName.split(`.`).pop();
    return fileExtension ?? ``;
}

export function getFileExtensionFromType (fileType: string): string {
    const fileExtension = MIME_TO_EXTENSION.get(fileType);
    return fileExtension ?? ``;
}

export function validateFileExtension (extension: string): boolean {
    const validExtensions = [
        `avi`,
        `mov`,
        `mp4`,
        `mp3`,
        `wav`,
        `jpg`,
        `jpeg`,
        `png`,
        `gif`,
        `bmp`,
        `doc`,
        `docx`,
        `ppt`,
        `pptx`,
        `xls`,
        `xlsx`,
        `pdf`,
    ];

    return validExtensions.includes(getFileExtensionFromName(extension).toLowerCase());
}

export function validateFileMimeType (file: File): boolean {
    return MIME_TYPES_REGEX.some(mime => mime.test(file.type));
}

export function validateFileType (file: File): boolean {
    return validateFileMimeType(file);
}

export function validateFileSize (file: File): boolean {
    return bytesToMegaBytes(file.size) <= 100;
}

export function bytesToMegaBytes (bytes: number): number {
    return bytes / (1024 * 1024);
}

export function getNameWithoutExtension (fileName: string): string {
    return fileName.replace(/\.[^/.]+$/, ``);
}

export function getFileNameInURI (uri: string): string | undefined {
    const decodedURI = decodeURIComponent(uri);
    const fileName = decodedURI.replace(/^.*[\\/]/, ``);
    if (validateFileExtension(getFileExtensionFromName(fileName ?? ``)))
        return fileName;
    return undefined;
}

export function detectFileName (file: File): string {
    if (file.name !== `content`) return file.name;
    const cordovaFileName = getFileNameInURI(file.localURL);
    if (cordovaFileName) return cordovaFileName;
    const extension = getFileExtensionFromType(file.type);
    if (!extension.length) return `attachment_${generateRandomString()}`;
    return `attachment_${generateRandomString()}.${extension}`;
}

export function convertFileNameToUnderscores (fileName: string): string {
    return `${getNameWithoutExtension(fileName).replace(/([^a-z0-9])/gi, `_`)}.${getFileExtensionFromName(fileName)}`;
}

export function saveDataBlobToFile (blob: Blob, targetDirectory: string, fileName: string): Promise<string> {
    return new Promise((resolve, reject) => {
        writeInChunk(blob, fileName, targetDirectory)
            .then(fileEntry => resolve(fileEntry.toURL()))
            .catch(error => reject(error));
    });
}

export function getFilesInDirectory (targetDirectory: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        (window as any).resolveLocalFileSystemURL(targetDirectory, (entry: any) => {
            const reader = entry.createReader();
            reader.readEntries((entries: any) => {
                resolve(entries.map((entry: any) => entry.name));
            }, (error: any) => {
                console.error(`could not create file: `, error);
                reject(error);
            });
        }, (error: any) => {
            console.error(`could not retrieve directory: `, error);
            reject(error);
        });
    });
}

export function generateUniqueFileName (fileNames: string[], targetFileName: string, increaseNumber = 0): string {
    let newFileName = targetFileName;
    if (increaseNumber !== 0)
        newFileName = `${getNameWithoutExtension(targetFileName)}(${increaseNumber}).${getFileExtensionFromName(targetFileName)}`;
    if (!fileNames.includes(newFileName)) {
        return newFileName;
    } else {
        return generateUniqueFileName(fileNames, targetFileName, increaseNumber + 1);
    }
}

export function getInternalStorageDirectory () {
    return cordova.file.dataDirectory;
}

export function getCacheDirectory (isIOS: boolean) {
    if (isIOS) return cordova.file.tempDirectory;
    return cordova.file.externalCacheDirectory;
}

export function getDownloadDirectory (isIOS: boolean) {
    if (isIOS) return cordova.file.documentsDirectory;
    return `${cordova.file.externalRootDirectory}Download/`;
}

export const createDirectory = (directoryName: string, rootDirectory = cordova.file.dataDirectory) => {
    return new Promise<string>((resolve, reject) => {
        const onError = (functionName: string) => (fileError: FileError) => {
            reject(`writeFileToStorage failed at ${functionName}: ${fileError.code}`);
        };
        const onCreateDirectory = (dirEntry: DirectoryEntry) => {
            resolve(dirEntry.nativeURL);
        };
        window.resolveLocalFileSystemURL(rootDirectory, entry => {
            const dirEntry = entry as unknown as DirectoryEntry;
            dirEntry.getDirectory(directoryName, {
                create: true,
                exclusive: false,
            }, onCreateDirectory, onError(`onCreateFile`));
        });
    });
};

export const writeInChunk = (blob: Blob, fileName: string, directory = cordova.file.dataDirectory) => {
    let offset = 0;
    const BLOCK_SIZE = 1 * 1024 * 1024; // write blocks of 1MB at a time
    return new Promise<FileEntry>((resolve, reject) => {
        const onError = (functionName: string) => (fileError: FileError) => {
            reject(`writeFileToStorage failed at ${functionName}: ${fileError.code}`);
        };
        const writeNext = (fileEntry: FileEntry, fileWriter: FileWriter) => {
            const blockSize = Math.min(BLOCK_SIZE, blob.size - offset);
            const block = blob.slice(offset, offset + blockSize);

            //append to the end
            fileWriter.seek(fileWriter.length);
            fileWriter.onwriteend = function () {
                if (offset < blob.size) {
                    offset += blockSize;
                    writeNext(fileEntry, fileWriter);
                } else {
                    resolve(fileEntry);
                }
            };
            fileWriter.write(block);
        };
        const onCreateFileWriter = (fileEntry: FileEntry) => (fileWriter: FileWriter) => {
            fileWriter.onerror = () => onError(`writeFile failed at write`);
            writeNext(fileEntry, fileWriter);
        };
        const onCreateFile = (fileEntry: FileEntry) => {
            fileEntry.createWriter(onCreateFileWriter(fileEntry), onError(`onCreateFileWriter`));
        };
        window.resolveLocalFileSystemURL(directory, (entry) => {
            const dirEntry = entry as unknown as DirectoryEntry;
            dirEntry.getFile(fileName, {
                create: true,
                exclusive: false,
            }, onCreateFile, onError(`onCreateFile`));
        });
    });
};

export const writeFileToStorage = (file: File,
    directory = cordova.file.dataDirectory) => {
    const fileName = detectFileName(file);

    return new Promise<File>((resolve, reject) => {
        writeInChunk(file, fileName, directory)
            .then(fileEntry => fileEntry.file(file => resolve({
                ...file,
                localURL: fileEntry.nativeURL,
            })))
            .catch(error => reject(error));
    });
};

export const readFileFromStorage = (filePath: string) => {
    return new Promise<File>((resolve, reject) => {
        const onError = (functionName: string) => (fileError: FileError) => {
            reject(`readFileFromStorage failed at ${functionName}: ${fileError.code}`);
        };
        const onLoadFile = (file: File) => {
            resolve(file);
        };
        const onGetFile = (entry: Entry) => {
            const fileEntry = entry as FileEntry;
            fileEntry.file(onLoadFile, onError(`onLoadFile`));
        };
        window.resolveLocalFileSystemURL(filePath, onGetFile, onError(`onResolveLocalFileSystemURL`));
    });
};

export const isDirectoryInStorage = (directoryPath: string) => {
    return new Promise<boolean>((resolve) => {
        const onError = () => {
            resolve(false);
        };
        const onGetFile = (entry: Entry) => {
            resolve(entry.isDirectory);
        };
        window.resolveLocalFileSystemURL(directoryPath, onGetFile, onError);
    });
};

export const isFileInStorage = (filePath: string) => {
    return new Promise<boolean>((resolve) => {
        const onError = () => {
            resolve(false);
        };
        const onGetFile = (entry: Entry) => {
            resolve(entry.isFile);
        };
        window.resolveLocalFileSystemURL(filePath, onGetFile, onError);
    });
};

export const removeDirectory = (directory: string) => {
    return new Promise<boolean>((resolve, reject) => {
        const onError = (functionName: string) => (fileError: FileError) => {
            reject(`removeDirectory failed at ${functionName}: ${fileError.code}`);
        };
        const onRemove = () => {
            resolve(true);
        };
        const onGetDirectory = (entry: Entry) => {
            const dirEntry = entry as DirectoryEntry;
            dirEntry.removeRecursively(onRemove, onError(`onRemove`));
        };
        window.resolveLocalFileSystemURL(directory, onGetDirectory, onError(`onResolveLocalFileSystemURL`));
    });
};

export const removeFileFromStorage = (filePath: string) => {
    return new Promise<boolean>((resolve, reject) => {
        const onError = (functionName: string) => (fileError: FileError) => {
            reject(`removeFileFromStorage failed at ${functionName}: ${fileError.code}`);
        };
        const onRemove = () => {
            resolve(true);
        };
        const onGetFile = (entry: Entry) => {
            const fileEntry = entry as FileEntry;
            fileEntry.remove(onRemove, onError(`onRemove`));
        };
        window.resolveLocalFileSystemURL(filePath, onGetFile, onError(`onResolveLocalFileSystemURL`));
    });
};

export const copyFileToDirectory = (filePath: string, targetDirectory: string) => {
    return new Promise<string>((resolve, reject) => {
        const onError = (functionName: string) => (fileError: FileError) => {
            reject(`copyFileToDirectory failed at ${functionName}: ${fileError.code}`);
        };
        const onCopyFile = (entry: Entry) => {
            resolve(entry.nativeURL);
        };
        const onGetDirectory = (dirEntry: DirectoryEntry) => {
            window.resolveLocalFileSystemURL(filePath, async entry => {
                const fileEntry = entry as FileEntry;
                const targetFilePath = `${dirEntry.nativeURL}/${fileEntry.name}`;
                if (await isFileInStorage(targetFilePath))
                    await removeFileFromStorage(`${dirEntry.nativeURL}/${fileEntry.name}`);
                fileEntry.copyTo(dirEntry, fileEntry.name, onCopyFile, onError(`onCopyFile`));
            });
        };
        window.resolveLocalFileSystemURL(targetDirectory, entry => onGetDirectory(entry as DirectoryEntry), onError(`onGetDiretory`));
    });
};

export const startDownloadPreview = async (
    attachmentId: string,
    attachmentName: string,
    url: string,
    cacheDirectory: string,
    onSuccess?: (attachmentId: string, savedFilePath: string) => void,
    onFailed?: (attachmentId: string) => void
) => {
    try {
        const downloadedBlob = await downloadDataBlob(url);
        const savedFilePath = await saveDataBlobToFile(
            downloadedBlob,
            cacheDirectory,
            attachmentName
        );
        if (onSuccess) {
            onSuccess(attachmentId, savedFilePath);
        }
    } catch (error) {
        console.error(error);
        if (onFailed) {
            onFailed(attachmentId);
        }
    }
};
