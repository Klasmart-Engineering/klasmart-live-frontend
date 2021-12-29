import { IFileSelectService } from "./IFileSelectService";
/// <reference types="cordova-plugin-file" />

const DESTINATION_FILE_URI = 1;
const SOURCE_CAMERA = 1;
const SOURCE_CAMERAROLL = 2;
const MEDIA_TYPE_ALL = 2;

export const ACCEPT_MIME_TYPES =
    `text/plain,` +
    `text/csv,` +
    `audio/*,` +
    `video/*,` +
    `image/*,` +
    `application/pdf,` +
    `application/vnd.ms-powerpoint,` +
    `application/vnd.openxmlformats-officedocument.presentationml.presentation,` +
    `application/msword,` +
    `application/vnd.openxmlformats-officedocument.wordprocessingml.document,` +
    `application/rtf,` +
    `application/vnd.ms-excel,` +
    `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,` +
    `application/msdoc,` +
    `application/msdocx,` +
    `application/vnd.google-apps.document,` +
    `application/vnd.google-apps.kix,` +
    `application/vnd.google-apps.spreadsheet,` +
    `application/vnd.google-apps.drawing,` +
    `application/vnd.google-apps.form,` +
    `application/vnd.google-apps.presentation,` +
    `audio/wave,` +
    `audio/x-wav,` +
    `audio/x-pn-wav,` +
    `audio/vnd.wave,` +
    `audio/wav,` +
    `audio/mpeg,` +
    `video/avi,` +
    `video/quicktime,` +
    `video/x-msvideo,` +
    `video/mp4,` +
    `image/x-ms-bmp,` +
    `image/x-windows-bmp,` +
    `image/x-windows-bmp,` +    
    `image/png,` +
    `image/gif,` +
    `image/jpeg,` +    
    `image/bmp,` +    
    `image/jpg`;

export const MIME_TO_EXTENSION = new Map<string, string>([
    [ `audio/wave`, `wav` ],
    [ `audio/wav`, `wav` ],
    [ `audio/x-wav`, `wav` ],
    [ `audio/x-pn-wav`, `wav` ],
    [ `audio/vnd.wave`, `wav` ],
    [ `audio/mpeg`, `mp3` ],
    [ `video/mp4`, `mp4` ],
    [ `video/x-msvideo`, `avi` ],
    [ `application/x-troff-msvideo`, `avi` ],
    [ `video/avi`, `avi` ],
    [ `video/msvideo`, `avi` ],
    [ `video/quicktime`, `mov` ],
    [ `image/jpeg`, `jpg` ],
    [ `image/png`, `png` ],
    [ `image/gif`, `gif` ],
    [ `image/bmp`, `bmp` ],
    [ `image/x-ms-bmp`, `bmp` ],
    [ `image/x-windows-bmp`, `bmp` ],
    [ `application/msword`, `doc` ],
    [ `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `docx` ],
    [ `application/vnd.ms-powerpoint`, `ppt` ],
    [ `application/vnd.openxmlformats-officedocument.presentationml.presentation`, `pptx` ],
    [ `application/vnd.ms-excel`, `xls` ],
    [ `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `xlsx` ],
    [ `application/pdf`, `pdf` ],
]);

// https://github.com/cyph/cordova-plugin-chooser
declare const chooser: any;

export class FileSelectService implements IFileSelectService {
    async selectFile (): Promise<File> {
        let { uri } = await chooser.getFileMetadata(ACCEPT_MIME_TYPES);

        if (!uri) {
            throw new Error(`No suitable file selected`);
        }

        return new Promise<File>((resolve, reject) => {
            console.log(`selected file with uri: ${uri}`);

            if (!uri.startsWith(`file://`) && !uri.startsWith(`content://`)) {
                uri = `file://` + uri;
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

            // TODO: Type information for resolveLocalFileSystemURL
            (window as any).resolveLocalFileSystemURL(uri, (entry: any) => {
                // TODO: type information for FileEntry
                // (entry as FileEntry).file((file) => {
                (entry as any).file((file: any) => {
                    resolve(file);
                });
            }, (error: any) => {
                reject(error);
            });
        });
    }

    selectFromGallery (): Promise<File> {
        const camera = (navigator as any).camera;
        if (!camera) return Promise.reject(`No camera available.`);

        const options = {
            sourceType: SOURCE_CAMERAROLL,
            destinationType: DESTINATION_FILE_URI,
            mediaType: MEDIA_TYPE_ALL,
        };

        const selectGalleryProcedure = new Promise<File>((resolve, reject) => {
            camera.getPicture((uri: string) => {
                if (!uri.startsWith(`file://`) && !uri.startsWith(`content://`)) {
                    uri = `file://` + uri;
                }

                // TODO: Type information for resolveLocalFileSystemURL
                (window as any).resolveLocalFileSystemURL(uri, (entry: any) => {
                    // TODO: type information for FileEntry
                    // (entry as FileEntry).file((file) => {
                    (entry as any).file((file: any) => {
                        resolve(file);
                    });
                }, (error: any) => {
                    reject(error);
                });
            }, (message: string) => {
                reject(message);
            }, options);
        });

        return selectGalleryProcedure;
    }

    selectFromCamera (): Promise<File> {
        const camera = (navigator as any).camera;
        if (!camera) return Promise.reject(`No camera available.`);

        const options = {
            sourceType: SOURCE_CAMERA,
            destinationType: DESTINATION_FILE_URI,
        };

        const selectGalleryProcedure = new Promise<File>((resolve, reject) => {
            camera.getPicture((uri: string) => {
                console.log(uri);
                // TODO: Type information for resolveLocalFileSystemURL
                (window as any).resolveLocalFileSystemURL(uri, (entry: any) => {
                    // TODO: type information for FileEntry
                    // (entry as FileEntry).file((file) => {
                    (entry as any).file((file: any) => {
                        resolve(file);
                    });
                }, (error: any) => {
                    reject(error);
                });
            }, (message: string) => {
                reject(message);
            }, options);
        });

        return selectGalleryProcedure;
    }
}
