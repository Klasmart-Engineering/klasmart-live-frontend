import {
    PermissionType,
    useCordovaSystemContext,
} from "@/app/context-provider/cordova-system-context";
import { injectIframeScript } from "@/app/utils/injectIframeScript";
import { LoadStatus } from "@/components/interactiveContent/InteractionRecorder";
import {
    isAndroidBrowser,
    isMobileBrowser,
} from "@/utils/userAgent";
import { useSnackbar } from "kidsloop-px";
import {
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

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
    DISPLAY_NOT_SUPPORTED_MESSAGE = `DisplayNotSupportedMessage`,
    STOP_LISTEN = `StopListen`,
    OFF_RECORD_BUTTON = `OffRecordButton`,
    START_CUSTOM_FLASHCARDS = `StartCustomFlashCards`,
    START_CUSTOM_FLASHCARDS_ANDROID_WEB = `StartCustomFlashCardsMobileWeb`,
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
    const intl = useIntl();
    const { isAndroid } = useCordovaSystemContext();

    useEffect(() => {
        if(shouldCustomFlashCard && !openLoadingDialog) {
            setOpenLoadingDialog(true);
        }
    }, [ shouldCustomFlashCard, openLoadingDialog ]);

    useEffect(() => {
        function checkIfFlashCardContent (iframe: HTMLIFrameElement) {
            const flashCardElement = iframe.contentDocument?.querySelector(`.${H5PClassName.H5P_FLASH_CARDS}`);
            return !!flashCardElement;
        }

        if(loadStatus === LoadStatus.Finished) {
            const iframe = window.document.getElementById(iframeID) as HTMLIFrameElement;
            setIframe(iframe);
            if (iframe && checkIfFlashCardContent(iframe)) {
                if (process.env.IS_CORDOVA_BUILD) {
                    setShouldCustomFlashCard(true);
                    injectIframeScript(iframe, `flashcard`);
                } else {
                    if (!iframe.contentDocument || !iframe.contentWindow) { return; }
                    if (!isAndroidBrowser) return;

                    setShouldCustomFlashCard(true);
                    const doc = iframe.contentDocument;
                    const script = doc.createElement(`script`);
                    script.setAttribute(`type`, `text/javascript`);
                    const matches = window.location.pathname.match(/^(.*\/+)([^/]*)$/);
                    const prefix = matches && matches.length >= 2 ? matches[1] : ``;
                    script.setAttribute(`src`, `${prefix}flashcard.js`);
                    doc.head.appendChild(script);
                }
            }
        }
    }, [ loadStatus ]);

    function sendMessageToIframe (action: FlashCardAction, data: string) {
        iframe?.contentWindow?.postMessage({
            action: action,
            data: data,
        }, `*`);
    }

    useEffect(() => {
        if (!isMobileBrowser && !process.env.IS_CORDOVA_BUILD) return;

        function startListen () {

            try {
                (window as any).Speech.startRecognition((success: { isFinal: boolean; text: string}) => {
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
                }, {
                    partialResultRequired: true,
                });
            } catch (error) {
                console.error(`couldn't start speech recognition: ${error}`);
            }
        }

        function stopListen () {
            try {
                (window as any).Speech.stopRecognition((success: any) => {
                    console.log(success);
                }, (err: any) => {
                    console.log(err);
                });
            } catch (error) {
                console.error(`couldn't stop speech recognition: ${error}`);
            }
        }

        let isFlashCards = false;
        function onMessage ({ data }: MessageEvent) {
            switch (data.action) {
            case FlashCardAction.FLASH_CARD_LOADED:
                isFlashCards = true;
                iframe?.contentWindow?.postMessage({
                    action: isAndroidBrowser && !isAndroid ? FlashCardAction.START_CUSTOM_FLASHCARDS_ANDROID_WEB : FlashCardAction.START_CUSTOM_FLASHCARDS,
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
            case FlashCardAction.DISPLAY_NOT_SUPPORTED_MESSAGE:
                enqueueSnackbar(intl.formatMessage({
                    id: `speechRecognition.error.notSupported`,
                    defaultMessage: `Speech Recognition feature not supported on mobile browsers`,
                }), {
                    variant: `error`,
                    anchorOrigin: {
                        horizontal: `center`,
                        vertical: `top`,
                    },
                });
                break;
            case FlashCardAction.ASK_SPEECH_RECOGNITION_PERMISSION:
                requestPermissions({
                    permissionTypes: [ PermissionType.MIC ],
                    onSuccess: () => {
                        try {
                            (window as any).Speech.initRecognition(() => {
                                sendMessageToIframe(FlashCardAction.GRANTED_SPEECH_RECOGNITION_PERMISSION, ``);
                            }, (err: string) => {
                                console.log(err);
                                enqueueSnackbar(intl.formatMessage({
                                    id: `live.speechRecognition.error.accessDisabled`,
                                    defaultMessage: `Access to speech recognition is disabled`,
                                }), {
                                    variant: `error`,
                                    anchorOrigin: {
                                        horizontal: `center`,
                                        vertical: `bottom`,
                                    },
                                });
                            }, {
                                language: data.data,
                            });
                        } catch (error) {
                            console.error(`couldn't initialize speech recognition: ${error}`);
                        }
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
            if (isFlashCards) {
                stopListen();
            }
            window.removeEventListener(`message`, onMessage);
        };
    }, [ iframe ]);

}
