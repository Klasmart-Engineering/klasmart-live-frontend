import {
    FlashCardAction,
    H5PClassName,
} from "@/app/utils/customFlashCard";

declare const H5PIntegration: any; //This variable is get from H5P iframe,
// @ts-ignore
const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

let inputLanguage = `en-US`;

window.addEventListener(`message`, ({ data }) => {
    switch (data.action) {
    case FlashCardAction.START_CUSTOM_FLASHCARDS:
        initInputLanguage();
        customRecordButtons();
        askSpeechRecognitionPermission();
        break;
    case FlashCardAction.START_CUSTOM_FLASHCARDS_ANDROID_WEB:
        customRecordButtons();
        enableRecordButtons(true);
        break;
    case FlashCardAction.ANSWER:
        onAnswer(data.data);
        break;
    case FlashCardAction.GRANTED_SPEECH_RECOGNITION_PERMISSION:
        checkPermissionInIframeAndEnableButtons();
        break;
    case FlashCardAction.DENY_SPEECH_RECOGNITION_PERMISSION:
        disableRecordButtons();
        break;
    case FlashCardAction.OFF_RECORD_BUTTON:
        offRecordButton();
        break;
    }
});

function sendMessageToParent(action: string, data: string | undefined = undefined) {
    window.parent.postMessage({
        action: action,
        ...data ? {
            data: data,
        } : {},
    }, `*`);
}

function getH5PJsonContent() {
    const contents = H5PIntegration?.contents;
    if(!contents) return null;
    const contentsKeys = Object.keys(contents);
    if (contentsKeys.length === 0) return null;
    const cid = Object.keys(contents)[0];
    return JSON.parse(contents[cid].jsonContent);
}

function initInputLanguage() {
    inputLanguage = getH5PJsonContent()?.inputLanguage ?? `en-US`;
}

function getCurrentFlashCard() {
    const flashCardsElements = document.getElementsByClassName(H5PClassName.H5P_FLASH_CARDS);
    for (let i = 0; i < flashCardsElements.length; i++) {
        const currentCards = flashCardsElements[i].getElementsByClassName(H5PClassName.H5P_CURRENT);
        if (currentCards)
            return currentCards[0];
    }
    return undefined;
}

function getCurrentRecordButton() {
    return getCurrentFlashCard()?.querySelector(`.${H5PClassName.H5P_SPEECH_RECOGNITION_BUTTON}`);
}

function getCurrentAnswerInput() {
    return getCurrentFlashCard()?.querySelector(`.${H5PClassName.H5P_SPEECH_RECOGNITION_INPUT}`);
}

function getVolumeButton() {
    return getCurrentFlashCard()?.querySelector<HTMLButtonElement>(`.${H5PClassName.H5P_VOLUME_BUTTON}`);
}

function getAllRecordButtons(): Element[] {
    const flashCardElement = document.querySelector(`.${H5PClassName.H5P_FLASH_CARDS}`);
    if (!flashCardElement) return [];
    const recordButtons: HTMLCollectionOf<Element> = flashCardElement.getElementsByClassName(H5PClassName.H5P_SPEECH_RECOGNITION_BUTTON);
    return Array.from(recordButtons);
}

function customRecordButtons() {
    const buttons = getAllRecordButtons();
    for (let i = 0; i < buttons.length; i++) {
        const newButtonNode = buttons[i].cloneNode(true);
        buttons[i].replaceWith(newButtonNode);
        buttons[i].classList.add(H5PClassName.H5P_SPEECH_RECOGNITION_DISABLED);
        buttons[i].setAttribute(`disabled`, ``);
    }
}

function checkPermissionInIframeAndEnableButtons() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            enableRecordButtons();
        })
        .catch(function(err) {
            disableRecordButtons();
        });
}

function enableRecordButtons(isAndroidBrowser = false) {
    const buttons = getAllRecordButtons();
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove(H5PClassName.H5P_SPEECH_RECOGNITION_DISABLED);
        buttons[i].removeAttribute(`disabled`);
        buttons[i].addEventListener(`click`, !isAndroidBrowser ? onSpeechRecognitionButtonClick : onSpeechRecognitionAndroidBrowserButtonClick);
    }
}

function disableRecordButtons() {
    const buttons = getAllRecordButtons();
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.add(H5PClassName.H5P_SPEECH_RECOGNITION_DISABLED);
        buttons[i].setAttribute(`disabled`, ``);
    }
}

function startListen() {
    const volumeButton = getVolumeButton();
    if (volumeButton)
        volumeButton.style.visibility = `hidden`;
    getCurrentRecordButton()?.classList.add(H5PClassName.H5P_SPEECH_RECOGNITION_LISTENING);
    sendMessageToParent(FlashCardAction.START_LISTEN, ``);
}

function offRecordButton() {
    const volumeButton = getVolumeButton();
    if (volumeButton)
        volumeButton.style.visibility = `visible`;
    getCurrentRecordButton()?.classList.remove(H5PClassName.H5P_SPEECH_RECOGNITION_LISTENING);
}

function stopListen() {
    offRecordButton();
    sendMessageToParent(FlashCardAction.STOP_LISTEN);
}

function checkIsListening() {
    return getCurrentRecordButton()?.classList.contains(H5PClassName.H5P_SPEECH_RECOGNITION_LISTENING);
}

function onSpeechRecognitionButtonClick() {
    if (checkIsListening()) {
        stopListen();
    } else {
        startListen();
    }
}

function onSpeechRecognitionAndroidBrowserButtonClick() {
    sendMessageToParent(FlashCardAction.DISPLAY_NOT_SUPPORTED_MESSAGE);
}

function onAnswer(answer: string) {
    getCurrentAnswerInput()?.setAttribute(`value`, answer);
    stopListen();
}

function askSpeechRecognitionPermission() {
    sendMessageToParent(FlashCardAction.ASK_SPEECH_RECOGNITION_PERMISSION, inputLanguage);
}

const observer = new MutationObserver(function(mutations, observer) {
    // Observe the H5P content to detect if it's retried (renew the flashcards).
    const cards = getH5PJsonContent()?.cards ?? [];
    const cardElements = mutations.filter(item => item.type === `childList` && (item.target as Element).className.includes(H5PClassName.H5P_CARD));

    if(cards.length === cardElements.length) {
        sendMessageToParent(FlashCardAction.FLASH_CARD_LOADED);
    }
});

function startObserveH5PFlashCards() {
    observer.observe(document.querySelector(`.${H5PClassName.H5P_FLASH_CARDS}`) as Node, {
        childList: true,
        subtree: true
    });
}

startObserveH5PFlashCards();
sendMessageToParent(FlashCardAction.FLASH_CARD_LOADED);
