
export interface IFileSelectService {
    selectFile(): Promise<File>;
    selectFromGallery(): Promise<string>;
    selectFromCamera(): Promise<string>;
}
