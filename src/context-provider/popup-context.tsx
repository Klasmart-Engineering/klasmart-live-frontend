import React, {
    createContext,
    ReactNode,
    useContext, useEffect,
    useState,
} from "react";
import {ConfirmDialog} from "../components/dialogs/confirmDialog";
import {DetailConfirmDialog} from "../components/dialogs/detailConfirmDialog";
import {DetailErrorDialog} from "../components/dialogs/detailErrorDialog";
import {ErrorDialog} from "../components/dialogs/errorDialog";
import {InfoDialog} from "../components/dialogs/infoDialog";
import {CordovaSystemContext} from "./cordova-system-context";

type Props = {
    children: ReactNode
}

type VariantType = 'error' | 'detailError' | 'confirm' | 'detailConfirm' | 'info'

type PopupState = {
    variant: VariantType,
    open?: boolean,
    title: string,
    description: string[],
    closeLabel: string,
    onClose?: () => void,
    confirmLabel?: string,
    onConfirm?: () => void
}

const initState: PopupState = {
    variant: 'error',
    open: false,
    title: "",
    description: [],
    closeLabel: "",
    onClose: () => {},
    confirmLabel: "",
    onConfirm: () => {}
}

type PopupContext = {
    popupState: PopupState,
    showPopup: (popupState : PopupState) => void,
    closePopup: () => void
}
const PopupContext = createContext<PopupContext>({popupState: initState, showPopup: () => {}, closePopup: () => {}});

const POPUP_ON_BACK_ID = "popupOnBackID"

export function PopupElement(): JSX.Element {
    const {popupState, closePopup} = usePopupContext();
    const {addOnBack, removeOnBack} = useContext(CordovaSystemContext);

    useEffect(() => {
        function initOnBack(){
            if(popupState.open){
                if(addOnBack){
                    addOnBack({
                        id: POPUP_ON_BACK_ID,
                        onBack: handleClosePopup
                    })
                }
            }else{
                if(removeOnBack){
                    removeOnBack(POPUP_ON_BACK_ID)
                }
            }
        }
        initOnBack()
    }, [popupState])

    function handleClosePopup() {
        if(popupState.onClose){
            popupState.onClose();
        }
        closePopup();
    }

    function handleConfirmPopup() {
        if(popupState.onConfirm){
            popupState.onConfirm();
        }
        closePopup();
    }

    function renderDialog(popupState: PopupState){
        const key = Math.random().toString(36)
        switch (popupState.variant){
            case "error":
                return <ErrorDialog key={key} open={popupState.open ?? false} onClose={handleClosePopup} title={popupState.title} description={popupState.description} closeLabel={popupState.closeLabel}/>
            case 'detailError':
                return <DetailErrorDialog key={key} open={popupState.open ?? false} onClose={handleClosePopup} title={popupState.title} description={popupState.description} closeLabel={popupState.closeLabel}/>;
            case 'confirm':
                return <ConfirmDialog key={key} open={popupState.open ?? false} onClose={handleClosePopup} onConfirm={handleConfirmPopup} title={popupState.title} description={popupState.description} closeLabel={popupState.closeLabel} confirmLabel={popupState.confirmLabel ?? "Ok"}/>;
            case 'detailConfirm':
                return <DetailConfirmDialog key={key} open={popupState.open ?? false} onClose={handleClosePopup} onConfirm={handleConfirmPopup} title={popupState.title} description={popupState.description} closeLabel={popupState.closeLabel} confirmLabel={popupState.confirmLabel ?? "Ok"}/>;
            case 'info':
                return <InfoDialog key={key} open={popupState.open ?? false} onClose={handleClosePopup} description={popupState.description} title={popupState.title} closeLabel={popupState.closeLabel} />
            default:
                return <></>
        }
    }

    return renderDialog(popupState)

}
export function PopupProvider({children} : Props){
    const [popupState, setPopupState] = useState(initState)

    useEffect(() => {
        closePopup() //Reset state when started at the first render
    }, [])

    const showPopup = (popupState: PopupState) => {
        setPopupState({
            ...popupState,
            onClose : popupState.onClose ?? (() => {}),
            onConfirm : popupState.onConfirm ?? (() => {}),
            confirmLabel: popupState.confirmLabel ?? "",
            open: true
        })
    }
    const closePopup = () => {
        setPopupState({
            ...popupState,
            open: false
        })
    }

    const contextValue: PopupContext = {
        popupState: popupState,
        showPopup: showPopup,
        closePopup: closePopup
    }

    return (
        <PopupContext.Provider value={contextValue}>
            { children }
            <PopupElement />
        </PopupContext.Provider>
    )
}

export function usePopupContext(){
    return useContext(PopupContext);
}
