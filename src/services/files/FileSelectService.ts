import { IFileSelectService } from "./IFileSelectService";

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

    async selectFromGallery(): Promise<File> {
        const input: HTMLInputElement = document.createElement(`input`);
        input.type = `file`;
        input.accept = `image/*`;

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

    async selectFromCamera(): Promise<File> {
        const input: HTMLInputElement = document.createElement(`input`);
        input.type = `file`;
        input.accept = `image/*;capture=camera`;

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
}
