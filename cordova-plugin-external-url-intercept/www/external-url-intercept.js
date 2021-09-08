var exec = cordova.require(`cordova/exec`); // eslint-disable-line no-undef

var externalUrlIntercept = {
    initializeCallback: function (callback) {
        const onSuccessfulCallback = function ({ action, url }) {
            if (action === `blockedNavigation`) {
                callback(url);
            }
        };

        exec(onSuccessfulCallback, undefined, `ExternalUrlIntercept`, `initializeCallback`, []);
    },
    allowNavigationToUrl: function (url) {
        exec(undefined, undefined, `ExternalUrlIntercept`, `addAllowedNavigationUrl`, [ url ]);
    },
};

module.exports = externalUrlIntercept;
