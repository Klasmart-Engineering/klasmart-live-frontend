
export function getFileExtensionFromName(fileName: string): string {
    const fileExtension = fileName.split('.').pop();
    return fileExtension ? fileExtension : "";
}

export function validateFileExtension(extension: string): boolean {
    const validExtensions = ["avi", "mov", "mp4", "mp3", "wav", "jpg", "jpeg",
        "png", "gif", "bmp", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "pdf"];
    return validExtensions.includes(getFileExtensionFromName(extension));
}

export function validateFileType(file: File): boolean {
    return validateFileExtension(getFileExtensionFromName(file.name));
}

export function validateFileSize(file: File): boolean {
    return bytesToMegaBytes(file.size) <= 100;
}

export function bytesToMegaBytes(bytes: number): number {
    return bytes / (1024 * 1024);
}
