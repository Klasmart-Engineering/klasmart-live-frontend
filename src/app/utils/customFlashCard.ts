import {
    PermissionType,
    useCordovaSystemContext,
} from "@/app/context-provider/cordova-system-context";
import { injectIframeScript } from "@/app/utils/injectIframeScript";
import { LoadStatus } from "@/components/interactiveContent/recordediframe";
import { useSnackbar } from "kidsloop-px";
import {
    useEffect,
    useState,
} from "react";

export enum H5PClassName {
    H5P_FLASH_CARDS = `h5p-flashcards`,
    H5P_CURRENT = `h5p-current`,
    H5P_SPEECH_RECOGNITION_BUTTON = `h5p-speech-recognition-button`,
    H5P_SPEECH_RECOGNITION_DISABLED = `h5p-speech-recognition-disabled`,
    H5P_SPEECH_RECOGNITION_INPUT = `h5p-uses-speech-recognition`,
    H5P_SPEECH_RECOGNITION_LISTENING = `h5p-speech-recognition-listening`,
    H5P_VOLUME_BUTTON = `h5p-audio-minimal-button`
}

export enum FlashCardAction {
    FLASH_CARD_LOADED = `FlashCardLoaded`,
    START_LISTEN = `StartListen`,
    STOP_LISTEN = `StopListen`,
    START_CUSTOM_FLASHCARDS = `StartCustomFlashCards`,
    ANSWER = `Answer`,
    ASK_SPEECH_RECOGNITION_PERMISSION = `AskSpeechRecognitionPermission`,
    GRANTED_SPEECH_RECOGNITION_PERMISSION = `GrantedSpeechRecognitionPermission`,
    DENY_SPEECH_RECOGNITION_PERMISSION = `DenySpeechRecognitionPermission`
}

export interface CustomFlashCardProps {
    iframeID: string;
    loadStatus: LoadStatus;
    openLoadingDialog: boolean;
    setOpenLoadingDialog: (value: boolean) => void;
}

export function useCustomFlashCard ({
    iframeID, loadStatus, openLoadingDialog, setOpenLoadingDialog,
} : CustomFlashCardProps) {
    const { requestPermissions } = useCordovaSystemContext();
    const { enqueueSnackbar } = useSnackbar();
    const [ iframe, setIframe ] = useState<HTMLIFrameElement>();
    const [ shouldCustomFlashCard, setShouldCustomFlashCard ] = useState(false);

    useEffect(() => {
        if(shouldCustomFlashCard && !openLoadingDialog) {
            setOpenLoadingDialog(true);
        }
    }, [ shouldCustomFlashCard, openLoadingDialog ]);

    useEffect(() => {
        if (!process.env.IS_CORDOVA_BUILD) return;

        function checkIfFlashCardContent (iframe: HTMLIFrameElement) {
            const flashCardElement = iframe.contentDocument?.querySelector(`.${H5PClassName.H5P_FLASH_CARDS}`);
            return !!flashCardElement;
        }

        if(loadStatus === LoadStatus.Finished) {
            const iframe = window.document.getElementById(iframeID) as HTMLIFrameElement;
            setIframe(iframe);
            if(iframe && checkIfFlashCardContent(iframe)){
                setShouldCustomFlashCard(true);
                injectIframeScript(iframe, `flashcard`);
            }
        }
    }, [ loadStatus ]);

    useEffect(() => {
        if (!process.env.IS_CORDOVA_BUILD) return;

        function startListen () {
            const speechRecognitionOptions = {
                language: `en-US`, //Change the language if needed
                matches: 1,
                showPartial: true,
                showPopup: true, //Android only
            };
            (window as any).plugins.speechRecognition.startListening((result: any) => {
                iframe?.contentWindow?.postMessage({
                    action: FlashCardAction.ANSWER,
                    data: result[0],
                }, `*`);
            }, (err: any) => {
                console.error(err);
                enqueueSnackbar(err, {
                    variant: `error`,
                    anchorOrigin: {
                        horizontal: `center`,
                        vertical: `bottom`,
                    },
                });
            }, speechRecognitionOptions);
        }

        function stopListen () {
            (window as any).plugins.speechRecognition.stopListening();
        }

        function onMessage ({ data }: MessageEvent) {
            switch (data.action) {
            case FlashCardAction.FLASH_CARD_LOADED:
                iframe?.contentWindow?.postMessage({
                    action: FlashCardAction.START_CUSTOM_FLASHCARDS,
                }, `*`);
                setShouldCustomFlashCard(false);
                setOpenLoadingDialog(false);
                break;
            case FlashCardAction.START_LISTEN:
                startListen();
                break;
            case FlashCardAction.STOP_LISTEN:
                stopListen();
                break;
            case FlashCardAction.ASK_SPEECH_RECOGNITION_PERMISSION:
                requestPermissions({
                    permissionTypes: [ PermissionType.MIC ],
                    onSuccess: () => {
                        (window as any).plugins.speechRecognition.hasPermission(() => {
                            (window as any).plugins.speechRecognition.requestPermission(() => {
                                iframe?.contentWindow?.postMessage({
                                    action: FlashCardAction.GRANTED_SPEECH_RECOGNITION_PERMISSION,
                                }, `*`);
                            }, () => {
                                iframe?.contentWindow?.postMessage({
                                    action: FlashCardAction.DENY_SPEECH_RECOGNITION_PERMISSION,
                                }, `*`);
                            });
                        });
                    },
                    onError: () => {
                        iframe?.contentWindow?.postMessage({
                            action: FlashCardAction.DENY_SPEECH_RECOGNITION_PERMISSION,
                        }, `*`);
                    },
                });
                break;
            }
        }

        window.addEventListener(`message`, onMessage);
        return () => {
            window.removeEventListener(`message`, onMessage);
        };
    }, [ iframe ]);

}
