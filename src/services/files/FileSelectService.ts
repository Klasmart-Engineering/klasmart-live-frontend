import { IFileSelectService } from "./IFileSelectService";

const DESTINATION_FILE_URI = 1;
const SOURCE_PHOTOLIBRARY = 0;
const SOURCE_CAMERA = 1;

export class FileSelectService implements IFileSelectService {
    async selectFile(): Promise<File> {
        const input: HTMLInputElement = document.createElement(`input`);
        input.type = `file`;

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

    selectFromGallery(): Promise<string> {
        const camera = (navigator as any).camera;
        if (!camera) return Promise.reject(`No camera available.`);

        const options = {
            sourceType: SOURCE_PHOTOLIBRARY,
            destinationType: DESTINATION_FILE_URI
        };

        var selectGalleryProcedure = new Promise<string>((resolve, reject) => {
            camera.getPicture((uri: string) => {
                resolve(uri);
            }, (message: string) => {
                reject(message);
            }, options)
        });

        return selectGalleryProcedure;
    }

    async selectFromCamera(): Promise<string> {
        const camera = (navigator as any).camera;
        if (!camera) return Promise.reject(`No camera available.`);

        const options = {
            sourceType: SOURCE_CAMERA,
            destinationType: DESTINATION_FILE_URI
        };

        var selectGalleryProcedure = new Promise<string>((resolve, reject) => {
            camera.getPicture((uri: string) => {
                resolve(uri);
            }, (message: string) => {
                reject(message);
            }, options)
        });

        return selectGalleryProcedure;
    }
}
