import React, {createContext, ReactChild, ReactChildren, useContext, useState} from "react";
import {ConfirmDialog} from "../components/dialogs/confirmDialog";
import {DetailConfirmDialog} from "../components/dialogs/detailConfirmDialog";
import {DetailErrorDialog} from "../components/dialogs/detailErrorDialog";
import {ErrorDialog} from "../components/dialogs/errorDialog";

type Props = {
    children: ReactChild | ReactChildren | null
}

type PopupDetail = {
    title: string,
    description: string[],
    closeLabel: string,
    onClose?: () => void,
    confirmLabel?: string,
    onConfirm?: () => void
}

type VariantType = 'error' | 'detailError' | 'confirm' | 'detailConfirm'

type PopupContext = {
    showPopup: (variant: VariantType, popupDetail: PopupDetail) => void
}

const PopupContext = createContext<PopupContext>({showPopup: () => {}});

export function PopupProvider({children} : Props){
    const [title, setTitle] = useState("");
    const [open, setOpen] = useState(false);
    const [description, setDescription] = useState<string[]>([]);
    const [closeLabel, setCloseLabel] = useState("");
    const [confirmLabel, setConfirmLabel] = useState("");
    const [variant, setVariant] = useState<VariantType>();

    function handleClosePopup() {
        onClose();
        setOpen(false);
    }

    function handleConfirmPopup() {
        onConfirm();
        setOpen(false);
    }

    let onClose = () => {}
    let onConfirm = () => {}
    const showPopup = (variant: VariantType, popupDetail: PopupDetail) => {
        setVariant(variant);
        setTitle(popupDetail.title);
        setDescription(popupDetail.description);
        setCloseLabel(popupDetail.closeLabel);
        onClose = popupDetail.onClose ?? (() => {});
        setConfirmLabel(popupDetail.confirmLabel ?? "");
        onConfirm = popupDetail.onConfirm ?? (() => {});
        setOpen(true);
    }

    function PopupElement({variant}:{variant?: VariantType}): JSX.Element {
        switch (variant){
            case "error":
                return <ErrorDialog open={open} onClose={handleClosePopup} title={title} description={description} closeLabel={closeLabel}/>
            case 'detailError':
                return <DetailErrorDialog open={open} onClose={handleClosePopup} title={title} description={description} closeLabel={closeLabel}/>;
            case 'confirm':
                return <ConfirmDialog open={open} onClose={handleClosePopup} onConfirm={handleConfirmPopup} title={title} description={description} closeLabel={closeLabel} confirmLabel={confirmLabel}/>;
            case 'detailConfirm':
                return <DetailConfirmDialog open={open} onClose={handleClosePopup} onConfirm={handleConfirmPopup} title={title} description={description} closeLabel={closeLabel} confirmLabel={confirmLabel}/>;
            default:
                return <></>
        }
    }

    const Content = () => {
        return <>
            { children}
            <PopupElement variant={variant}/>
        </>
    }
    return (
        <PopupContext.Provider value={{showPopup: showPopup}}>
            <Content />
        </PopupContext.Provider>
    )
}

export function usePopup(){
    return useContext(PopupContext);
}
