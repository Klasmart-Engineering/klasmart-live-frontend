export function getFileExtensionFromName(fileName: string): string {
    const fileExtension = fileName.split('.').pop();
    return fileExtension ? fileExtension : "";
}

export function validateFileType(file: File): boolean {
    const validFileTypes = ["avi", "mov", "mp4", "mp3", "wav", "jpg", "jpeg",
        "png", "gif", "bmp", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "pdf"];
    return validFileTypes.includes(getFileExtensionFromName(file.name));

}

export function validateFileSize(file: File): boolean {
    return bytesToMegaBytes(file.size) <= 100;

}

export function bytesToMegaBytes(bytes: number): number {
    return bytes / (1024 * 1024);
}
