module.exports = function (api) {
    api.cache(true);
    const presets = [
        [
            "@babel/preset-env",
            {
                "targets": {
                    "edge": "17",
                    "firefox": "60",
                    "chrome": "67",
                    "safari": "11.1",
                    "ie": "11"
                }
            }
        ],
        "@babel/preset-react",
        "@babel/preset-typescript",
    ];

    const plugins = [
        "@babel/proposal-class-properties",
        "@babel/proposal-object-rest-spread",
        "@babel/plugin-transform-object-assign",
        "@babel/plugin-proposal-optional-chaining",
    ];

    return {
        presets,
        plugins,
    };
};