import { Dispatch } from "redux";
import { OrientationType } from "../store/actions";
import { setDeviceOrientation } from "../store/reducers/location";

// Lock device orientation only in Cordova app
export function lockOrientation(orientationType: OrientationType, dispatch: Dispatch<any>) {
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock(orientationType)
            .then(() => { dispatch(setDeviceOrientation(orientationType)); })
            .catch((err) => {
                console.warn("Since this platform is not Cordova, screen.orientation.lock() will not work.");
            })
    }
}