import {
    FlashCardAction,
    H5PClassName,
} from "@/app/utils/customFlashCard";

window.addEventListener(`message`, ({ data }) => {
    switch (data.action) {
    case FlashCardAction.START_CUSTOM_FLASHCARDS:
        customRecordButtons();
        askSpeechRecognitionPermission();
        break;
    case FlashCardAction.ANSWER:
        onAnswer(data.data);
        break;
    case FlashCardAction.GRANTED_SPEECH_RECOGNITION_PERMISSION:
        enableRecordButtons();
        break;
    case FlashCardAction.DENY_SPEECH_RECOGNITION_PERMISSION:
        disableRecordButtons();
        break;
    }
});

function sendMessageToParent (action: string, data: string | undefined = undefined) {
    window.parent.postMessage({
        action: action,
        ...data ? {
            data: data,
        } : {},
    }, `*`);
}

function getCurrentFlashCard () {
    const flashCardsElements = document.getElementsByClassName(H5PClassName.H5P_FLASH_CARDS);
    for(let i = 0 ; i < flashCardsElements.length; i++) {
        const currentCards = flashCardsElements[i].getElementsByClassName(H5PClassName.H5P_CURRENT);
        if(currentCards)
            return currentCards[0];
    }
    return undefined;
}

function getCurrentRecordButton () {
    return getCurrentFlashCard()?.querySelector(`.${H5PClassName.H5P_SPEECH_RECOGNITION_BUTTON}`);
}

function getCurrentAnswerInput () {
    return getCurrentFlashCard()?.querySelector(`.${H5PClassName.H5P_SPEECH_RECOGNITION_INPUT}`);
}

function getVolumeButton () {
    return  getCurrentFlashCard()?.querySelector<HTMLButtonElement>(`.${H5PClassName.H5P_VOLUME_BUTTON}`);
}

function getAllRecordButtons () : Element[]{
    const flashCardElement = document.querySelector(`.${H5PClassName.H5P_FLASH_CARDS}`);
    if(!flashCardElement) return [];
    const recordButtons: HTMLCollectionOf<Element> = flashCardElement.getElementsByClassName(H5PClassName.H5P_SPEECH_RECOGNITION_BUTTON);
    return Array.from(recordButtons);
}

function customRecordButtons () {
    const buttons = getAllRecordButtons();
    for(let i = 0 ; i < buttons.length; i++) {
        const newButtonNode = buttons[i].cloneNode(true);
        buttons[i].replaceWith(newButtonNode);
        buttons[i].classList.add(H5PClassName.H5P_SPEECH_RECOGNITION_DISABLED);
        buttons[i].setAttribute(`disabled`, ``);
    }
}

function enableRecordButtons () {
    const buttons = getAllRecordButtons();
    for(let i = 0 ; i < buttons.length; i++) {
        buttons[i].classList.remove(H5PClassName.H5P_SPEECH_RECOGNITION_DISABLED);
        buttons[i].removeAttribute(`disabled`);
        buttons[i].addEventListener(`click`, onSpeechRecognitionButtonClick);
    }
}

function disableRecordButtons () {
    const buttons = getAllRecordButtons();
    for(let i = 0 ; i < buttons.length; i++) {
        buttons[i].classList.add(H5PClassName.H5P_SPEECH_RECOGNITION_DISABLED);
        buttons[i].setAttribute(`disabled`, ``);
    }
}
function startListen () {
    const volumeButton = getVolumeButton();
    if(volumeButton)
        volumeButton.style.visibility = `hidden`;
    getCurrentRecordButton()?.classList.add(H5PClassName.H5P_SPEECH_RECOGNITION_LISTENING);
    sendMessageToParent(FlashCardAction.START_LISTEN);
}

function stopListen () {
    const volumeButton = getVolumeButton();
    if(volumeButton)
        volumeButton.style.visibility = `visible`;
    getCurrentRecordButton()?.classList.remove(H5PClassName.H5P_SPEECH_RECOGNITION_LISTENING);
    sendMessageToParent(FlashCardAction.STOP_LISTEN);
}

function checkIsListening () {
    return getCurrentRecordButton()?.classList.contains(H5PClassName.H5P_SPEECH_RECOGNITION_LISTENING);
}

function onSpeechRecognitionButtonClick () {
    if(checkIsListening()){
        stopListen();
    }else{
        startListen();
    }
}

function onAnswer (answer: string) {
    getCurrentAnswerInput()?.setAttribute(`value`, answer);
    stopListen();
}

function askSpeechRecognitionPermission () {
    sendMessageToParent(FlashCardAction.ASK_SPEECH_RECOGNITION_PERMISSION);
}

sendMessageToParent(FlashCardAction.FLASH_CARD_LOADED);
