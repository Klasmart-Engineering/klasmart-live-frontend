
const loadTextFromFile = (path: string) => new Promise<string>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', path);

    request.onreadystatechange = () => {
        // NOTE: readyState 4 == DONE (iOS)
        if (request.readyState === XMLHttpRequest.DONE ||
            request.readyState === 4) {
            resolve(request.responseText);
        }
    };

    request.onerror = () => {
        reject(request.statusText);
    }

    request.ontimeout = () => {
        reject(`timeout`);
    }

    request.send();
})

export function getAbsoluteScriptPath(scriptFile: string) {
    const matches = window.location.pathname.match(/^(.*\/+)([^/]*)$/);
    const prefix = matches && matches.length >= 2 ? matches[1] : "";

    return `file://${prefix}${scriptFile}.js`;
}

export function injectIframeScript(iframe: HTMLIFrameElement, scriptFile: string) {
    const document = iframe.contentDocument;
    if (!document) throw new Error(`can't inject script, iframe document null`);

    const script = document.createElement("script");
    script.setAttribute("type", "text/javascript");

    const scriptFilePath = getAbsoluteScriptPath(scriptFile);

    // HACK: In chromium (android) there's error when trying to load
    // set src to local file path. Instead the file text is loaded and
    // then set as the text content of script node.
    // script.setAttribute("src", recorderScript);

    loadTextFromFile(scriptFilePath).then((text) => {
        script.text = text;

        document.head.appendChild(script);

    }).catch(error => {
        console.error(error);
        throw error;
    });
}
