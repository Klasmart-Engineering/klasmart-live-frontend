import { ConfirmDialog } from "../dialogs/confirmDialog";
import { DetailConfirmDialog } from "../dialogs/detailConfirmDialog";
import { DetailErrorDialog } from "../dialogs/detailErrorDialog";
import { ErrorDialog } from "../dialogs/errorDialog";
import { InfoDialog } from "../dialogs/infoDialog";
import { CordovaSystemContext } from "./cordova-system-context";
import React,
{
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

type Props = {
    children: ReactNode;
}

type VariantType = 'error' | 'detailError' | 'confirm' | 'detailConfirm' | 'info'

export type PopupState = {
    variant: VariantType;
    open?: boolean;
    title: string;
    description: string[];
    closeLabel: string;
    onClose?: () => void;
    confirmLabel?: string;
    onConfirm?: () => void;
    showCloseIcon?: boolean;
}

const initState: PopupState = {
    variant: `error`,
    open: false,
    title: ``,
    description: [],
    closeLabel: ``,
    onClose: () => undefined,
    confirmLabel: ``,
    onConfirm: () => undefined,
};

type PopupContext = {
    popupState: PopupState;
    showPopup: (popupState : PopupState) => void;
    closePopup: () => void;
}
const PopupContext = createContext<PopupContext>({
    popupState: initState,
    showPopup: () => undefined,
    closePopup: () => undefined,
});

const POPUP_ON_BACK_ID = `popupOnBackID`;

export function PopupElement (): JSX.Element {
    const { popupState, closePopup } = usePopupContext();
    const { addOnBack, removeOnBack } = useContext(CordovaSystemContext);

    useEffect(() => {
        function initOnBack (){
            if(popupState.open){
                if(addOnBack){
                    addOnBack({
                        id: POPUP_ON_BACK_ID,
                        onBack: handleClosePopup,
                    });
                }
            }else{
                if(removeOnBack){
                    removeOnBack(POPUP_ON_BACK_ID);
                }
            }
        }
        initOnBack();
    }, [ popupState ]);

    function handleClosePopup (reason?: "backdropClick" | "escapeKeyDown") {
        if (popupState.onClose && reason !== `backdropClick`) {
            popupState.onClose();
        }
        closePopup();
    }

    function handleConfirmPopup () {
        if(popupState.onConfirm){
            popupState.onConfirm();
        }
        closePopup();
    }

    function renderDialog (popupState: PopupState){
        const key = Math.random().toString(36);
        switch (popupState.variant){
        case `error`:
            return <ErrorDialog
                key={key}
                open={popupState.open ?? false}
                title={popupState.title}
                description={popupState.description}
                closeLabel={popupState.closeLabel}
                onClose={handleClosePopup}/>;
        case `detailError`:
            return <DetailErrorDialog
                key={key}
                open={popupState.open ?? false}
                title={popupState.title}
                description={popupState.description}
                closeLabel={popupState.closeLabel}
                onClose={handleClosePopup}/>;
        case `confirm`:
            return <ConfirmDialog
                key={key}
                open={popupState.open ?? false}
                title={popupState.title}
                description={popupState.description}
                closeLabel={popupState.closeLabel}
                confirmLabel={popupState.confirmLabel ?? `Ok`}
                onClose={handleClosePopup}
                onConfirm={handleConfirmPopup}/>;
        case `detailConfirm`:
            return <DetailConfirmDialog
                key={key}
                open={popupState.open ?? false}
                title={popupState.title}
                description={popupState.description}
                closeLabel={popupState.closeLabel}
                confirmLabel={popupState.confirmLabel ?? `Ok`}
                onClose={handleClosePopup}
                onConfirm={handleConfirmPopup}/>;
        case `info`:
            return <InfoDialog
                key={key}
                open={popupState.open ?? false}
                description={popupState.description}
                title={popupState.title}
                closeLabel={popupState.closeLabel}
                showCloseIcon={popupState.showCloseIcon ?? false}
                onClose={handleClosePopup} />;
        default:
            return <></>;
        }
    }

    return renderDialog(popupState);

}
export function PopupProvider ({ children } : Props){
    const [ popupState, setPopupState ] = useState(initState);

    useEffect(() => {
        closePopup(); //Reset state when started at the first render
    }, []);

    const showPopup = (popupState: PopupState) => {
        setPopupState({
            ...popupState,
            onClose : popupState.onClose ?? (() => undefined),
            onConfirm : popupState.onConfirm ?? (() => undefined),
            confirmLabel: popupState.confirmLabel ?? ``,
            open: true,
        });
    };
    const closePopup = () => {
        setPopupState({
            ...popupState,
            open: false,
        });
    };

    const contextValue: PopupContext = {
        popupState: popupState,
        showPopup: showPopup,
        closePopup: closePopup,
    };

    return (
        <PopupContext.Provider value={contextValue}>
            { children }
            <PopupElement />
        </PopupContext.Provider>
    );
}

export function usePopupContext (){
    return useContext(PopupContext);
}
