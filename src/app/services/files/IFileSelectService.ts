
export interface IFileSelectService {
    selectFile(): Promise<File>;
    selectFromGallery(): Promise<File>;
    selectFromCamera(): Promise<File>;
}
