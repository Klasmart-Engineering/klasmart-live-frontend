import { compilerOptions } from "./tsconfig.json";
import type { Config } from '@jest/types';
import { pathsToModuleNameMapper } from "ts-jest/utils";

const config: Config.InitialOptions = {
    verbose: false,
    preset: `ts-jest`,
    testEnvironment: `jsdom`,
    testPathIgnorePatterns: [ `/node_modules/`, `/plugins` ],
    setupFilesAfterEnv: [ `<rootDir>/setupTests.ts` ],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: `<rootDir>/`,
    }),
    transform: {
        "^.+\\.svg$": `<rootDir>/tests/utils/svgTransform.ts`,
    },
};

export default config;
