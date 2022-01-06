
export interface IFileSelectService {
    selectFile(): Promise<File>;
    selectFromGallery(isAndroid: boolean): Promise<File>;
    selectFromCamera(): Promise<File>;
}
