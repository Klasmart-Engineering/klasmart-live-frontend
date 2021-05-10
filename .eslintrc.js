module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true,
        jest: true,
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
        ecmaVersion: 2018,
        sourceType: `module`,
        project: `tsconfig.eslint.json`,
    },
    plugins: [
        `react`,
        `@typescript-eslint`,
        `putout`,
        `modules-newline`,
        `jest`,
        `simple-import-sort`,
        `import`,
    ],
    rules: {
        indent: [`error`, 4],
        'linebreak-style': [`error`, `unix`],
        semi: [`error`, `always`],
        'array-bracket-newline': [
            `error`,
            {
                multiline: true,
                minItems: 3,
            },
        ],
        'array-element-newline': [
            `error`,
            {
                multiline: true,
                minItems: 3,
            },
        ],
        'array-bracket-spacing': [`error`, `always`],
        'comma-dangle': [
            `error`,
            {
                arrays: `always-multiline`,
                exports: `always-multiline`,
                functions: `always-multiline`,
                imports: `always-multiline`,
                objects: `always-multiline`,
            },
        ],
        'comma-spacing': `off`, // turned off b/c '@typescript-eslint/comma-spacing' is enabled
        'eol-last': [`error`, `always`],
        'no-trailing-spaces': `error`,
        'no-multiple-empty-lines': [
            `error`,
            {
                max: 1,
                maxEOF: 0,
            },
        ],
        'object-curly-spacing': [`error`, `always`],
        'object-curly-newline': [
            `error`,
            {
                ObjectExpression: {
                    multiline: true,
                    minProperties: 1,
                },
                ObjectPattern: {
                    multiline: true,
                    minProperties: 3,
                },
                ImportDeclaration: {
                    multiline: true,
                    minProperties: 3,
                },
                ExportDeclaration: {
                    multiline: true,
                    minProperties: 3,
                },
            },
        ],
        'object-property-newline': `error`,
        'quote-props': [`error`, `as-needed`],
        'no-warning-comments': 1,
        'no-console': process.env.NODE_ENV === `production` ? `error` : `off`,
        'react/react-in-jsx-scope': `off`,
        'react/jsx-max-props-per-line': 2,
        'react/jsx-first-prop-new-line': 2,
        'react/display-name': `off`,
        'react/jsx-sort-props': [
            2,
            {
                callbacksLast: true,
                shorthandFirst: true,
                ignoreCase: true,
                noSortAlphabetically: true,
                reservedFirst: [`key`, `ref`],
            },
        ],
        '@typescript-eslint/ban-ts-comment': `off`, // TODO (Henrik): remove when proper types in global dialogs' contexts are set
        '@typescript-eslint/ban-types': [
            `error`,
            {
                extendDefaults: true,
                types: {
                    '{}': false,
                },
            },
        ],
        '@typescript-eslint/comma-spacing': [`error`], // turned on b/c 'comma-spacing' is disabled
        '@typescript-eslint/explicit-module-boundary-types': `off`,
        '@typescript-eslint/naming-convention': [
            `error`,
            {
                selector: `default`,
                format: [`camelCase`],
            },
            {
                selector: `variable`,
                format: [
                    `camelCase`,
                    `UPPER_CASE`,
                    `PascalCase`,
                ],
                trailingUnderscore: `allow`,
            },
            {
                selector: `typeLike`,
                format: [`PascalCase`],
            },
            {
                selector: `function`,
                format: [`camelCase`, `PascalCase`],
            },
            {
                selector: `variable`,
                modifiers: [`destructured`],
                format: [
                    `camelCase`,
                    `snake_case`,
                    `PascalCase`,
                ],
            },
            {
                selector: `enumMember`,
                format: [`UPPER_CASE`],
            },
            {
                selector: `property`,
                format: [
                    `camelCase`,
                    `snake_case`,
                    `UPPER_CASE`,
                    `PascalCase`,
                ],
            },
            {
                selector: `memberLike`,
                format: [`camelCase`],
            },
        ],
        '@typescript-eslint/no-empty-interface': `warn`,
        '@typescript-eslint/no-unused-vars': 1,
        '@typescript-eslint/no-var-requires': `off`,
        '@typescript-eslint/quotes': [`error`, `backtick`],
        '@typescript-eslint/member-delimiter-style': [
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
        '@typescript-eslint/no-explicit-any': [
            `off`,
            {
                fixToUnknown: false,
                ignoreRestArgs: false,
            },
        ],
        'putout/multiple-properties-destructuring': [
            `error`,
            {
                minProperties: 2,
            },
        ],
        'modules-newline/import-declaration-newline': `error`,
        'modules-newline/export-declaration-newline': `error`,
        'simple-import-sort/imports': [
            `error`,
            {
                groups: [],
            },
        ],
        'simple-import-sort/exports': `error`,
        'import/first': `error`,
        'import/newline-after-import': `error`,
        'import/no-duplicates': `error`,
    },
};
