import React, {
    createContext,
    ReactNode,
    useContext,
    useReducer,
} from "react";
import {ConfirmDialog} from "../components/dialogs/confirmDialog";
import {DetailConfirmDialog} from "../components/dialogs/detailConfirmDialog";
import {DetailErrorDialog} from "../components/dialogs/detailErrorDialog";
import {ErrorDialog} from "../components/dialogs/errorDialog";

type Props = {
    children: ReactNode
}

type VariantType = 'error' | 'detailError' | 'confirm' | 'detailConfirm'

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

type PopupAction = {type: 'show' | 'close', state: PopupState}


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

const popupReducer = (state: PopupState, action: PopupAction) => {
    switch (action.type){
        case 'show':
            return {...state, ...action.state}
        case 'close':
            return {...state, ...action.state}
        default:
            throw new Error("Unexpected popup action")
    }
}

export function PopupElement(): JSX.Element {
    const {popupState, closePopup } = usePopupContext();

    function handleClosePopup() {
        onClose();
        closePopup();
    }

    function handleConfirmPopup() {
        onConfirm();
        closePopup();
    }

    let onClose = () => {}
    let onConfirm = () => {}

    switch (popupState.variant){
        case "error":
            return <ErrorDialog open={popupState.open ?? false} onClose={handleClosePopup} title={popupState.title} description={popupState.description} closeLabel={popupState.closeLabel}/>
        case 'detailError':
            return <DetailErrorDialog open={popupState.open ?? false} onClose={handleClosePopup} title={popupState.title} description={popupState.description} closeLabel={popupState.closeLabel}/>;
        case 'confirm':
            return <ConfirmDialog open={popupState.open ?? false} onClose={handleClosePopup} onConfirm={handleConfirmPopup} title={popupState.title} description={popupState.description} closeLabel={popupState.closeLabel} confirmLabel={popupState.confirmLabel ?? "Ok"}/>;
        case 'detailConfirm':
            return <DetailConfirmDialog open={popupState.open ?? false} onClose={handleClosePopup} onConfirm={handleConfirmPopup} title={popupState.title} description={popupState.description} closeLabel={popupState.closeLabel} confirmLabel={popupState.confirmLabel ?? "Ok"}/>;
        default:
            return <></>
    }
}
export function PopupProvider({children} : Props){
    const [popupState, popupDispatch] = useReducer(popupReducer, initState);
    const showPopup = (popupState: PopupState) => {
        popupDispatch({type: 'show', state: {
            ...popupState,
            onClose : popupState.onClose ?? (() => {}),
            onConfirm : popupState.onConfirm ?? (() => {}),
            confirmLabel: popupState.confirmLabel ?? "",
            open: true
        }})
    }
    const closePopup = () => {
        popupDispatch({type: 'close', state: {
            ...popupState,
            open: false
        }})
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
