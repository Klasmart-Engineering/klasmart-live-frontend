import {
    ACCEPT_MIME_TYPES,
    MIME_TO_EXTENSION,
} from "../services/files/FileSelectService";

const MIME_TYPES_REGEX = ACCEPT_MIME_TYPES.split(`,`)
    .map(unescapedMime => unescapedMime.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`))
    .map(escapedMime => new RegExp(`^` + escapedMime.replace(/\*/g, `.*`)));

export function getFileExtensionFromName(fileName: string): string {
    const fileExtension = fileName.split(`.`).pop();
    return fileExtension ? fileExtension : ``;
}

export function getFileExtensionFromType(fileType: string): string {
    const fileExtension = MIME_TO_EXTENSION.get(fileType);
    return fileExtension ? fileExtension : ``;
}

export function validateFileExtension(extension: string): boolean {
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

export function validateFileMimeType(file: File): boolean {
    return MIME_TYPES_REGEX.some(mime => mime.test(file.type));
}

export function validateFileType(file: File): boolean {
    return validateFileMimeType(file);
}

export function validateFileSize(file: File): boolean {
    return bytesToMegaBytes(file.size) <= 100;
}

export function bytesToMegaBytes(bytes: number): number {
    return bytes / (1024 * 1024);
}

export function getNameWithoutExtension(fileName: string): string {
    return fileName.replace(/\.[^/.]+$/, "");
}

export function convertFileNameToUnderscores(fileName: string): string {
    return `${getNameWithoutExtension(fileName).replace(/([^a-z0-9])/gi, '_')}.${getFileExtensionFromName(fileName)}`
}

export function saveDataBlobToFile (blob: Blob, targetDirectory: string, fileName: string): Promise<string> {
    return new Promise((resolve, reject) => {
        (window as any).resolveLocalFileSystemURL(targetDirectory, (entry: any) => {
            const newFileName = convertFileNameToUnderscores(fileName);
            entry.getFile( newFileName, { create: true, exclusive: false }, (fileEntry: any) => {
                fileEntry.createWriter((writer: any) => {
                    writer.onwriteend = () => {
                        resolve(fileEntry.toURL());
                    };

                    writer.onerror = () => {
                        console.error('could not write file: ', writer.error);
                        reject(writer.error);
                    }

                    writer.write(blob);
                });
            }, (error: any) => {
                console.error('could not create file: ', error);
                reject(error);
            });
        }, (error: any) => {
            console.error('could not retrieve directory: ', error);
            reject(error);
        })
    });
}

