import { OrientationType } from "../model/appModel";

export function lockOrientation (orientationType: OrientationType) {
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock(orientationType)
            .catch((err) => {
                console.warn(`Since this platform is not Cordova, screen.orientation.lock() will not work.`, err);
            });
    }
}
