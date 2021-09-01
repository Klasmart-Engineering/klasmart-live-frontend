module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [ `@kidsloop/eslint-config/react`, `@kidsloop/eslint-config/jest/react` ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: `module`,
        project: `tsconfig.eslint.json`,
    },
};
