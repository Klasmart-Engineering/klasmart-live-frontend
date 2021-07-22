
export interface IFileSelectService {
    // TODO: Change the `File` or `string` to be uniform across all the functions. So that UI using
    // this service can handle all of them the same way.
    selectFile(): Promise<File>;
    selectFromGallery(): Promise<File>;
    selectFromCamera(): Promise<File>;
}
