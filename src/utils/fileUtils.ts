import { ACCEPT_MIME_TYPES } from "../services/files/FileSelectService";

const MIME_TYPES_REGEX = ACCEPT_MIME_TYPES.split(",")
    .map(unescaped_mime => unescaped_mime.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .map(escaped_mime => new RegExp('^' + escaped_mime.replace(/\*/g, '.*')));

export function getFileExtensionFromName(fileName: string): string {
    const fileExtension = fileName.split('.').pop();
    return fileExtension ? fileExtension : "";
}

export function validateFileExtension(extension: string): boolean {
    const validExtensions = ["avi", "mov", "mp4", "mp3", "wav", "jpg", "jpeg",
        "png", "gif", "bmp", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "pdf"];

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
