module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        `eslint:recommended`,
        `plugin:react/recommended`,
        `plugin:@typescript-eslint/eslint-recommended`,
        `plugin:@typescript-eslint/recommended`,
    ],
    parser: `@typescript-eslint/parser`,
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: `module`,
    },
    plugins: [
        `react`,
        `@typescript-eslint`,
        `simple-import-sort`,
        `import`,
    ],
    rules: {
        indent: [ `error`, 4 ],
        "linebreak-style": [ `error`, `unix` ],
        semi: [ `error`, `always` ],
        "array-bracket-newline": [
            `error`,
            {
                multiline: true,
                minItems: 3,
            },
        ],
        "array-element-newline": [
            `error`,
            {
                multiline: true,
                minItems: 3,
            },
        ],
        "array-bracket-spacing": [ `error`, `always` ],
        "comma-dangle": [
            `error`,
            {
                arrays: `always-multiline`,
                exports: `always-multiline`,
                functions: `always-multiline`,
                imports: `always-multiline`,
                objects: `always-multiline`,
            },
        ],
        "comma-spacing": `off`, // turned off b/c '@typescript-eslint/comma-spacing' is enabled
        "eol-last": [ `error`, `always` ],
        "function-call-argument-newline": [ `error`, `never` ],
        "function-paren-newline": [ `error`, `never` ],
        "no-trailing-spaces": `error`,
        "no-multiple-empty-lines": [
            `error`,
            {
                max: 1,
                maxEOF: 0,
            },
        ],
        "object-curly-spacing": [ `error`, `always` ],
        "object-curly-newline": [
            `error`,
            {
                ObjectExpression: { // eslint-disable-line @typescript-eslint/naming-convention
                    multiline: true,
                    minProperties: 1,
                },
                ObjectPattern: { // eslint-disable-line @typescript-eslint/naming-convention
                    multiline: true,
                    minProperties: 3,
                },
                ImportDeclaration: { // eslint-disable-line @typescript-eslint/naming-convention
                    multiline: true,
                    minProperties: 3,
                },
                ExportDeclaration: { // eslint-disable-line @typescript-eslint/naming-convention
                    multiline: true,
                    minProperties: 3,
                },
            },
        ],
        "object-property-newline": `error`,
        "quote-props": [ `error`, `as-needed` ],
        "no-warning-comments": 1,
        "react/react-in-jsx-scope": `off`,
        "react/jsx-max-props-per-line": 2,
        "react/jsx-first-prop-new-line": 2,
        "react/display-name": `off`,
        "react/jsx-sort-props": [
            2,
            {
                callbacksLast: true,
                shorthandFirst: true,
                ignoreCase: true,
                noSortAlphabetically: true,
                reservedFirst: [ `key`, `ref` ],
            },
        ],
        "space-before-function-paren": [ `error`, `always` ],
        "@typescript-eslint/ban-types": [
            `error`,
            {
                extendDefaults: true,
                types: {
                    "{}": false,
                },
            },
        ],
        "@typescript-eslint/comma-spacing": [ `error` ], // turned on b/c 'comma-spacing' is disabled
        "@typescript-eslint/explicit-module-boundary-types": `off`,
        "@typescript-eslint/no-empty-interface": `warn`,
        "@typescript-eslint/no-unused-vars": 1,
        "@typescript-eslint/no-var-requires": `off`,
        "@typescript-eslint/quotes": [ `error`, `backtick` ],
        "@typescript-eslint/member-delimiter-style": [
            2,
            {
                multiline: {
                    delimiter: `semi`,
                    requireLast: true,
                },
                singleline: {
                    delimiter: `semi`,
                    requireLast: false,
                },
            },
        ],
        "@typescript-eslint/no-explicit-any": [
            `off`,
            {
                fixToUnknown: false,
                ignoreRestArgs: false,
            },
        ],
        "modules-newline/import-declaration-newline": `error`,
        "modules-newline/export-declaration-newline": `error`,
        "simple-import-sort/imports": [
            `error`,
            {
                groups: [],
            },
        ],
        "simple-import-sort/exports": `error`,
        "import/first": `error`,
        "import/newline-after-import": `error`,
        "import/no-duplicates": `error`,
        'react/jsx-filename-extension': [
            2,
            {
                extensions: [
                    `.js`,
                    `.jsx`,
                    `.ts`,
                    `.tsx`,
                ],
            },
        ],
    },
};
