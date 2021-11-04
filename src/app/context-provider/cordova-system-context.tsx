import Loading from "../../components/loading";
import { ExitDialog } from "../dialogs/exitDialog";
import useCordovaInitialize from "../platform/cordova-initialize";
import {
    enableFullScreen,
    enableKeepAwake,
    lockOrientation,
} from "../utils/screenUtils";
import {
    LayoutMode,
    OrientationType,
    useLayoutModeValue,
    useSetDeviceOrientation,
} from "@/app/model/appModel";
import { sleep } from "@/utils/utils";
import { History } from "history";
import React,
{
    createContext,
    ReactChild,
    ReactChildren,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

const initialHref = location.href;

type Props = {
    children: ReactChild | ReactChildren | null;
    history: History<unknown>;
}

export type OnBackItem = {
    id: string;
    onBack: () => void;
    isAutoRemove?: boolean;
}

type RequestPermissionsProps = {
    permissionTypes: PermissionType[]; onSuccess?: (hasPermission: boolean) => void; onError?: () => void;
}
type CordovaSystemContext = {
    ready: boolean;
    isIOS: boolean;
    isAndroid: boolean;
    devicePermissions: boolean;
    restart?: () => void;
    quit?: () => void;
    addOnBack?: (onBackItem: OnBackItem) => void;
    removeOnBack?: (id: string) => void;
    requestPermissions: (props: RequestPermissionsProps) => void;
}

export enum PermissionType {
    CAMERA, MIC, READ_STORAGE, WRITE_STORAGE
}

export const CordovaSystemContext = createContext<CordovaSystemContext>({
    ready: false,
    devicePermissions: false,
    isIOS: false,
    isAndroid: false,
    requestPermissions: () => undefined,
});

export function CordovaSystemProvider ({ children, history }: Props) {
    const [ displayExitDialogue, setDisplayExitDialogue ] = useState<boolean>(false);
    const [ onBackQueue, setOnBackQueue ] = useState<OnBackItem[]>([]);
    const [ permissions, setPermissions ] = useState(false);
    const layoutMode = useLayoutModeValue();
    const setDeviceOrientation = useSetDeviceOrientation();

    const addOnBack = (onBackItem: OnBackItem) => {
        console.log(onBackItem.id);
        const newOnBackQueue = onBackQueue.slice();
        newOnBackQueue.push(onBackItem);
        setOnBackQueue(newOnBackQueue);
    };

    useEffect(()=>{
        (async function () {
            try {
                if(layoutMode === LayoutMode.CLASSROOM){
                    lockOrientation(OrientationType.LANDSCAPE);
                    await sleep(1000);
                    enableFullScreen(true);
                    enableKeepAwake(true);
                }else{
                    lockOrientation(OrientationType.PORTRAIT);
                    await sleep(1000);
                    enableFullScreen(false);
                    enableKeepAwake(false);
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [ layoutMode ]);

    useEffect(() => {
        if(!screen.orientation) return;

        const orientationChangeListener = () => {
            setDeviceOrientation(screen.orientation.type);
        };
        window.addEventListener(`orientationchange`, orientationChangeListener);
        return () => {
            window.removeEventListener(`orientationchange`, orientationChangeListener);
        };
    }, []);

    const removeOnBack = (id: string) => {
        console.log(id);
        const newOnBackQueue = onBackQueue.filter(item => item.id !== id);
        setOnBackQueue(newOnBackQueue);
    };

    const restart = useCallback(() => {
        const app = (navigator as any).app;
        if (app) {
            app.loadUrl(initialHref, {
                wait: 0,
                loadingDialog: `Wait, Loading App`,
                loadUrlTimeoutValue: 60000,
            });
        } else {
            (navigator as any).splashscreen.show();
            location.href = initialHref;
        }
    }, []);

    const quit = useCallback(() => {
        (navigator as any).app.exitApp();
    }, []);

    const {
        cordovaReady,
        isIOS,
        isAndroid,
    } = useCordovaInitialize(false, () => {
        const isRootPage = window.location.hash.includes(`/schedule`) || window.location.hash === `#/`;
        if (window.location.hash.includes(`/room`)) {
            restart();
        } else if (isRootPage) {
            if(onBackQueue.length > 0){
                const latestOnBackItem = onBackQueue[onBackQueue.length - 1];
                latestOnBackItem.onBack();
                if(latestOnBackItem.isAutoRemove === undefined || latestOnBackItem.isAutoRemove){
                    removeOnBack(latestOnBackItem.id);
                }
                return;
            }
            if (displayExitDialogue) {
                quit();
            } else {
                setDisplayExitDialogue(true);
            }
        }
        else {
            history.goBack();
        }
    });

    const requestPermissions = ({
        permissionTypes, onSuccess, onError,
    }: RequestPermissionsProps) => {
        const cordova = (window as any).cordova;
        if (!cordova || !cordova.plugins) return;

        if(isAndroid){
            if (cordova.plugins.permissions) {
                console.log(`Requesting android permissions...`);
                const permissions = cordova.plugins.permissions;

                const permissionsList: string[] = [];
                if (permissionTypes.includes(PermissionType.CAMERA)) {
                    permissionsList.push(permissions.CAMERA);
                }

                if (permissionTypes.includes(PermissionType.MIC)) {
                    permissionsList.push(permissions.RECORD_AUDIO);
                    permissionsList.push(permissions.MODIFY_AUDIO_SETTINGS);
                }

                if (permissionTypes.includes(PermissionType.READ_STORAGE)) {
                    permissionsList.push(permissions.READ_EXTERNAL_STORAGE);
                }

                if (permissionTypes.includes(PermissionType.WRITE_STORAGE)) {
                    permissionsList.push(permissions.WRITE_EXTERNAL_STORAGE);
                }

                const onRequestError = () => {
                    console.error(`Couldn't request permissions: ${permissionsList}`);
                    onError ? onError() : ``;
                };

                const onRequestSuccess = (status: { hasPermission: boolean }) => {
                    console.log(`Successfully requested permissions: ${JSON.stringify(permissionsList)} ${status.hasPermission}`);
                    setPermissions(status.hasPermission);
                    onSuccess ? onSuccess(status.hasPermission) : ``;
                };
                permissions.checkPermission(permissionsList, (status: { hasPermission: boolean }) => {
                    if(!status.hasPermission){
                        permissions.requestPermissions(permissionsList, onRequestSuccess, onRequestError);
                    }else{
                        onRequestSuccess(status);
                    }
                }, onRequestError);

            }
        }
        if(isIOS){
            if (cordova.plugins.iosrtc) {
                console.log(`Requesting iosrtc permissions...`);
                const camera = permissionTypes.includes(PermissionType.CAMERA);
                const mic = permissionTypes.includes(PermissionType.MIC);
                if( camera || mic){
                    cordova.plugins.iosrtc.requestPermission(mic, camera, (approved: boolean) => {
                        console.log(`Permissions: `, approved ? `Granted` : `Rejected`);
                        setPermissions(approved);
                        onSuccess ? onSuccess(approved) : ``;
                    });
                }else{
                    //In iOS, the system will ask permissions it self, don't need to handle for iOS
                    setPermissions(true);
                    onSuccess ? onSuccess(true) : ``;
                }
            } else {
                //In iOS, the system will ask permissions it self, don't need to handle for iOS
                setPermissions(true);
                onSuccess ? onSuccess(true) : ``;
            }
        }

    };

    const LoadingCordova = () => {
        return <Loading messageId="cordova_loading" />;
    };

    return (
        <CordovaSystemContext.Provider value={{
            ready: cordovaReady,
            devicePermissions: permissions,
            restart,
            quit,
            isIOS,
            isAndroid,
            addOnBack: addOnBack,
            removeOnBack: removeOnBack,
            requestPermissions: requestPermissions,
        }}>
            { !cordovaReady ? <LoadingCordova /> : `` }
            {cordovaReady ? children : ``}
            {cordovaReady ? <ExitDialog
                visible={displayExitDialogue}
                onCancel={() => setDisplayExitDialogue(false)}
                onConfirm={() => quit()} /> : ``}
        </CordovaSystemContext.Provider>
    );
}

export function useCordovaSystemContext () {
    return useContext(CordovaSystemContext);
}
