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

export const MIME_TO_EXTENSION = new Map<string, string>([
    ["audio/wave", "wav"],
    ["audio/wav", "wav"],
    ["audio/x-wav", "wav"],
    ["audio/x-pn-wav", "wav"],
    ["audio/mpeg", "mp3"],
    ["video/mp4", "mp4"],
    ["video/x-msvideo", "avi"],
    ["video/quicktime", "mov"],
    ["image/jpeg", "jpg"],
    ["image/png", "png"],
    ["image/gif", "gif"],
    ["image/bmp", "bmp"],
    ["application/msword", "doc"],
    ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx"],
    ["application/vnd.ms-powerpoint", "ppt"],
    ["application/vnd.openxmlformats-officedocument.presentationml.presentation", "pptx"],
    ["application/vnd.ms-excel", "xls"],
    ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "xlsx"],
    ["application/pdf", "pdf"]
]);

// https://github.com/cyph/cordova-plugin-chooser
declare var chooser: any;

declare var FilePath: any;

export class FileSelectService implements IFileSelectService {
    async selectFile(): Promise<File> {
        var { uri, name } = await chooser.getFileMetadata(ACCEPT_MIME_TYPES);

        if (!uri) {
            throw new Error('No suitable file selected');
        }

        return new Promise<File>(async (resolve, reject) => {
            console.log(`selected file with uri: ${uri}`);

            if (!uri.startsWith("file://") && !uri.startsWith("content://")) {
                uri = "file://" + uri;
            }

            /* TODO: It seems after converting to native path from content:// path the file can't be read because of FILE_NOT_FOUND error from FileReader.
            // I'll comment this code out for now so the file upload feature can be tested on Android, and we can reimplement this once we have more time to
            // investigate what's wrong.
            if(uri.startsWith("content://")){
                //The file get from chooser on Android has not a correct full path.
                //Ex: content://com.android.providers.media.documents/document/image%3A15970
                //It need to convert to native path
                uri = await FilePath.resolveNativePath(uri)
            }
            */

            console.log(`corrected uri: ${uri}`);

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
