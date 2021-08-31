import  NewUIEntry  from "./pages/entry";
import { createDefaultStore } from "./store/store";
import { BrowserGuide } from "./utils/browserGuide";
import React from "react";
import {
    isChrome,
    isIOS,
    isIOS13,
    isMacOs,
    isSafari,
} from "react-device-detect";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

let renderComponent: JSX.Element;
if (
    isMacOs && (isSafari || isChrome) // Support Safari and Chrome in MacOS
    || (isIOS || isIOS13) && isSafari // Support only Safari in iOS
    || (!isIOS || !isIOS13) && isChrome // Support only Chrome in other OS
) {
    const { store, persistor } = createDefaultStore();
    renderComponent = (
        <Provider store={store}>
            <PersistGate
                loading={null}
                persistor={persistor}>
                <NewUIEntry />
            </PersistGate>
        </Provider>
    );
} else {
    renderComponent = <BrowserGuide />;
}
render(renderComponent, document.getElementById(`app`));
