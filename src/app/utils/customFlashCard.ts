import {
    PermissionType,
    useCordovaSystemContext,
} from "@/app/context-provider/cordova-system-context";
import { injectIframeScript } from "@/app/utils/injectIframeScript";
import { useEffect } from "react";

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
    iframe: HTMLIFrameElement | null;
}

export function useCustomFlashCard ({ iframe } : CustomFlashCardProps) {
    const { requestPermissions } = useCordovaSystemContext();

    useEffect(() => {
        if (!process.env.IS_CORDOVA_BUILD) return;
        if (!iframe) return;

        function checkIfFlashCardContent () {
            const flashCardElement = iframe?.contentDocument?.querySelector(`.${H5PClassName.H5P_FLASH_CARDS}`);
            return !!flashCardElement;
        }

        function onIFrameLoad () {
            if (!iframe) return;
            if(checkIfFlashCardContent()){
                injectIframeScript(iframe, `flashcard`);
            }
        }

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

        iframe.onload = onIFrameLoad;
        window.addEventListener(`message`, onMessage);
        return () => {
            window.removeEventListener(`message`, onMessage);
        };
    }, [ iframe ]);

}
