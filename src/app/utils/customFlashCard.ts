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
    H5P_VOLUME_BUTTON = `h5p-audio-minimal-button`,
    H5P_CARD = `h5p-card`
}

export enum FlashCardAction {
    FLASH_CARD_LOADED = `FlashCardLoaded`,
    START_LISTEN = `StartListen`,
    STOP_LISTEN = `StopListen`,
    OFF_RECORD_BUTTON = `OffRecordButton`,
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

    function sendMessageToIframe(action: FlashCardAction, data: string) {
        iframe?.contentWindow?.postMessage({
            action: action,
            data: data
        }, `*`);
    }

    useEffect(() => {
        if (!process.env.IS_CORDOVA_BUILD) return;

        function startListen () {
            let options = {
                partialResultRequired: true,
            };

            (window as any).Speech.startRecognition(
                (success: { isFinal: boolean, text: string}) => {
                    sendMessageToIframe(FlashCardAction.ANSWER, success.text);
                    sendMessageToIframe(FlashCardAction.STOP_LISTEN, ``);
                }, (err: string) => {
                    console.log(err);
                    sendMessageToIframe(FlashCardAction.OFF_RECORD_BUTTON, ``);
                    if(!err || err === `0`) return;
                    enqueueSnackbar(err, {
                        variant: `error`,
                        anchorOrigin: {
                            horizontal: `center`,
                            vertical: `bottom`,
                        },
                    });
                }, options);
        }

        function stopListen () {
            (window as any).Speech.stopRecognition(
                (success: any) => {
                    console.log(success);
                }, (err: any) => {
                    console.log(err);
                })
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
                        (window as any).Speech.initRecognition((success: any) => {
                            sendMessageToIframe(FlashCardAction.GRANTED_SPEECH_RECOGNITION_PERMISSION, ``);
                        }, (err: string) => {
                            console.log(err);
                        }, {
                            language: data.data
                        });
                    },
                    onError: () => {
                        sendMessageToIframe(FlashCardAction.DENY_SPEECH_RECOGNITION_PERMISSION, ``);
                    },
                });
                break;
            }
        }

        window.addEventListener(`message`, onMessage);
        return () => {
            stopListen();
            window.removeEventListener(`message`, onMessage);
        };
    }, [ iframe ]);

}
