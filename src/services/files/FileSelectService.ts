import { IFileSelectService } from "./IFileSelectService";
/// <reference types="cordova-plugin-file" />

const DESTINATION_FILE_URI = 1;
const SOURCE_PHOTOLIBRARY = 0;
const SOURCE_CAMERA = 1;
const SOURCE_CAMERAROLL = 2;
const MEDIA_TYPE_ALL = 2;

const ACCEPT_MIME_TYPES =
    `application/pdf,` +
    `application/vnd.ms-powerpoint,` +
    `application/vnd.openxmlformats-officedocument.presentationml.presentation,` +
    `application/msword,` +
    `application/vnd.openxmlformats-officedocument.wordprocessingml.document,` +
    `application/rtf,` +
    `text/plain,` +
    `text/csv,` + 
    `audio/*,` + 
    `video/*,` + 
    `image/*`;

// https://github.com/cyph/cordova-plugin-chooser
declare var chooser: any;

export class FileSelectService implements IFileSelectService {
    async selectFile(): Promise<File> {
        var { uri, name } = await chooser.getFileMetadata(ACCEPT_MIME_TYPES);

        if (!uri) {
            throw new Error('No suitable file selected');
        }

        return new Promise<File>((resolve, reject) => {
            if (!uri.startsWith("file://") && !uri.startsWith("content://")) {
                uri = "file://" + uri;
            }

            window.resolveLocalFileSystemURL(uri, (entry) => {
                (entry as FileEntry).file((file) => {
                    resolve(file);
                })
            }, (error) => {
                reject(error);
            });
        });

        const input: HTMLInputElement = document.createElement(`input`);
        input.type = `file`;
        input.accept = ACCEPT_MIME_TYPES;

        var selectFileProcedure = new Promise<File>((resolve, reject) => {
            input.onchange = (e: Event) => {
                const target = e.target as HTMLInputElement ?? undefined;

                if (target && target.files?.length) {
                    resolve(target.files[0]);
                } else {
                    reject("No file was selected.");
                }
            };

            input.click();
        });

        try {
            return await selectFileProcedure;
        } catch (error) {
            return Promise.reject(error);
        } finally {
            input.remove();
        }
    }

    selectFromGallery(): Promise<File> {
        const camera = (navigator as any).camera;
        if (!camera) return Promise.reject(`No camera available.`);

        const options = {
            sourceType: SOURCE_CAMERAROLL,
            destinationType: DESTINATION_FILE_URI,
            mediaType: MEDIA_TYPE_ALL,
        };

        var selectGalleryProcedure = new Promise<File>((resolve, reject) => {
            camera.getPicture((uri: string) => {
                if (!uri.startsWith("file://") && !uri.startsWith("content://")) {
                    uri = "file://" + uri;
                }

                window.resolveLocalFileSystemURL(uri, (entry) => {
                    (entry as FileEntry).file((file) => {
                        resolve(file);
                    })
                }, (error) => {
                    reject(error);
                });
            }, (message: string) => {
                reject(message);
            }, options)
        });

        return selectGalleryProcedure;
    }

    async selectFromCamera(): Promise<File> {
        const camera = (navigator as any).camera;
        if (!camera) return Promise.reject(`No camera available.`);

        const options = {
            sourceType: SOURCE_CAMERA,
            destinationType: DESTINATION_FILE_URI
        };

        var selectGalleryProcedure = new Promise<File>((resolve, reject) => {
            camera.getPicture((uri: string) => {
                console.log(uri);
                window.resolveLocalFileSystemURL(uri, (entry) => {
                    (entry as FileEntry).file((file) => {
                        resolve(file);
                    })
                }, (error) => {
                    reject(error);
                });
            }, (message: string) => {
                reject(message);
            }, options)
        });

        return selectGalleryProcedure;
    }
}
