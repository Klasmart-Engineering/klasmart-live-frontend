import {
    useSelectedOrganizationValue,
    useSelectedUserValue,
} from "../data/user/atom";
import useCordovaInitialize from "../platform/cordova-initialize";
import {
    enableFullScreen,
    enableKeepAwake,
    lockOrientation,
} from "../utils/screenUtils";
import {
    dialogsState,
    isAuthenticatedStorage,
    isSelectOrgParentDialogOpenState,
    LayoutMode,
    menuOpenState,
    OrientationType,
    selectOrgAfterSwitchingProfile,
    useLayoutModeValue,
    useSetDeviceOrientation,
    useSetLayoutMode,
} from "@/app/model/appModel";
import { Device } from "@/app/types/device";
import {
    PARENT_ROUTES,
    THEME_COLOR_BACKGROUND_ON_BOARDING,
    THEME_COLOR_ORG_MENU_DRAWER,
} from "@/config";
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
    useRef,
    useState,
} from "react";
import {
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from "recoil";
import semver from "semver";

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
    deviceInfo: Device | undefined;
    shouldUpgradeDevice: boolean;
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
    deviceInfo: undefined,
    shouldUpgradeDevice: false,
    requestPermissions: () => undefined,
});

export function CordovaSystemProvider ({ children, history }: Props) {
    const onBackQueue = useRef<OnBackItem[]>([]); //useState is not enough fast for backPressed behaviour
    const [ permissions, setPermissions ] = useState(false);
    const layoutMode = useLayoutModeValue();
    const setLayoutMode = useSetLayoutMode();
    const setDeviceOrientation = useSetDeviceOrientation();
    const selectedUser = useSelectedUserValue();
    const selectedOrganization = useSelectedOrganizationValue();
    const setSelectOrgAfterSwitchingProfile = useSetRecoilState(selectOrgAfterSwitchingProfile);
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const [ isMenuOpen, setMenuOpen ] = useRecoilState(menuOpenState);
    const [ isSelectOrgParentDialogOpen, setIsSelectOrgParentDialogOpen ] = useRecoilState(isSelectOrgParentDialogOpenState);
    const isAnyDialogOpen = Object.values(dialogs)
        .includes(true) && !dialogs.isShowNoStudentRole && !dialogs.isShowNoOrgProfile;
    const isBackToPreviousScreen = selectedUser && selectedOrganization && (isAnyDialogOpen || isMenuOpen || isSelectOrgParentDialogOpen);
    const [ shouldUpgradeDevice, setShouldUpgradeDevice ] = useState(false);
    const isAuthenticated = useRecoilValue(isAuthenticatedStorage);

    function addOnBack (onBackItem: OnBackItem) {
        onBackQueue.current.push(onBackItem);
    }

    function removeOnBack (id: string) {
        onBackQueue.current = onBackQueue.current.filter(item => item.id !== id);
    }

    useEffect(() => {
        history.listen((location) => {
            const { pathname } = location;
            if (PARENT_ROUTES.some((route) => pathname.includes(route))) {
                setLayoutMode(LayoutMode.PARENT);
            } else{
                setLayoutMode(LayoutMode.DEFAULT);
            }
        });
    }, []);

    useEffect(()=>{
        (async function () {
            try {
                const statusBarColor: string = isAuthenticated && !dialogs.isShowNoOrgProfile && !dialogs.isShowNoStudentRole
                    ? THEME_COLOR_ORG_MENU_DRAWER : THEME_COLOR_BACKGROUND_ON_BOARDING;
                if(layoutMode === LayoutMode.DEFAULT){
                    lockOrientation(OrientationType.LANDSCAPE);
                    await sleep(1000);
                    enableFullScreen(true);
                    enableKeepAwake(true);
                    await sleep(700);
                }else{
                    // Add some time delay before locking to make sure the system fully loaded
                    lockOrientation(OrientationType.PORTRAIT);
                    await sleep(700);
                    enableFullScreen(false, statusBarColor);
                    enableKeepAwake(false);
                    await sleep(700);
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [
        layoutMode,
        isAuthenticated,
        dialogs.isShowNoOrgProfile,
        dialogs.isShowNoStudentRole,
    ]);

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

    const restart = useCallback(() => {
        const app = (navigator as any).app;
        if (app) {
            app.loadUrl(initialHref, {
                wait: 0,
                loadingDialog: `Wait, Loading App`,
                loadUrlTimeoutValue: 60000,
            });
        } else {
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
        deviceInfo,
    } = useCordovaInitialize(false, () => {
        const isRootPage = window.location.hash === `#/` || window.location.hash === `#/select-user-role`;
        const isRoomPage = window.location.hash.startsWith(`#/room`);
        const isScheduleListPage = window.location.hash.startsWith(`#/schedule/category`);
        const isParentDashboardPage = window.location.hash === `#/parent-dashboard`;

        if (dialogs.isParentalLockOpen){
            setDialogs({
                ...dialogs,
                isParentalLockOpen: false,
            });
            return;
        }

        if((dialogs.isSelectUserOpen || isParentDashboardPage) && !(selectedUser && selectedOrganization)){
            setDialogs({
                ...dialogs,
                isSelectUserOpen: false,
            });
            history.push(`/select-user-role`);
            return;
        }

        if(dialogs.isSelectOrganizationOpen){
            if(!selectedOrganization){
                setDialogs({
                    ...dialogs,
                    isSelectUserOpen: true,
                    isSelectOrganizationOpen: false,
                });
            } else {
                setSelectOrgAfterSwitchingProfile(false);
            }
            return;
        }

        if (isBackToPreviousScreen) {
            setDialogs({
                isSelectOrganizationOpen: false,
                isSelectUserOpen: false,
                isParentalLockOpen: false,
                isShowNoOrgProfile: false,
                isShowNoStudentRole: false,
                isLiveClassDetailOpen: false,
                isStudyDetailOpen: false,
                isExternalNavigationOpen: false,
            });
            setMenuOpen(false);
            setIsSelectOrgParentDialogOpen(false);
            return;
        }

        if(isScheduleListPage){
            history.push(`/`);
            return;
        }

        if (isRootPage || isRoomPage || dialogs.isShowNoOrgProfile || dialogs.isShowNoStudentRole) {
            if (onBackQueue.current.length > 0) {
                const latestOnBackItem = onBackQueue.current[onBackQueue.current.length - 1];
                latestOnBackItem.onBack();
                if (latestOnBackItem.isAutoRemove === undefined || latestOnBackItem.isAutoRemove) {
                    removeOnBack(latestOnBackItem.id);
                }
                return;
            }
            quit();
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

    useEffect(() => {
        if(!deviceInfo) return;

        // use semver.coerce to parse 15.1 to 15.1.0
        if(isIOS && !semver.satisfies(semver.coerce(deviceInfo.version)?.version ?? deviceInfo.version, `14.3.0 - 14.8.0 || >=15.1.0`)) {
            setShouldUpgradeDevice(true);
        }
        else if(isAndroid) {
            // TODO: Implement for Android if needed
        }
    }, [
        isIOS,
        isAndroid,
        deviceInfo,
    ]);

    return (
        <CordovaSystemContext.Provider value={{
            ready: cordovaReady,
            devicePermissions: permissions,
            restart,
            quit,
            isIOS,
            isAndroid,
            deviceInfo,
            shouldUpgradeDevice,
            addOnBack: addOnBack,
            removeOnBack: removeOnBack,
            requestPermissions: requestPermissions,
        }}
        >
            {cordovaReady && children}
        </CordovaSystemContext.Provider>
    );
}

export function useCordovaSystemContext () {
    return useContext(CordovaSystemContext);
}
