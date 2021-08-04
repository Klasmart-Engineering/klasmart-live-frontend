import { IFileSelectService } from "./IFileSelectService";
/// <reference types="cordova-plugin-file" />

const DESTINATION_FILE_URI = 1;
const SOURCE_PHOTOLIBRARY = 0;
const SOURCE_CAMERA = 1;
const SOURCE_CAMERAROLL = 2;
const MEDIA_TYPE_ALL = 2;

export const ACCEPT_MIME_TYPES = 
    `application/pdf,` + 
    `application/vnd.ms-powerpoint,` + 
    `application/vnd.openxmlformats-officedocument.presentationml.presentation,` + 
    `application/msword,` + 
    `application/vnd.openxmlformats-officedocument.wordprocessingml.document,` +
    `application/rtf,` + 
    `application/vnd.ms-excel,` +
    `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,` +
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
