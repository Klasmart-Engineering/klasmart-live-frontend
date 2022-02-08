// PreviewAnyFile for cordova-plugin-preview-any-file
interface Window {
    PreviewAnyFile: PreviewAnyFile;
}

interface PreviewOptions {
    name?: string;
    mimeType?: string;
}

interface PreviewAnyFile {
    preview( path: string, successCallback: () => void, errorCallback: (error: Error) => void ): void;
    previewBase64( successCallback: () => void, errorCallback: (error: Error) => void, base64: string, opt: PreviewOptions = {}): void;
    previewPath(successCallback: () => void, errorCallback: (error: Error) => void, path: string, opt: PreviewOptions = {} ): void;
    previewAsset(successCallback: () => void, errorCallback: (error: Error) => void, path: string, opt: PreviewOptions = {} ): void;
}

//declare let window: Window;
