import VersionPage from "./index";
import { screen } from "@testing-library/react";
import { render } from "@tests/utils/render";
import { escapeRegExp } from "lodash";
import React from "react";

const OLD_ENV = process.env;

const GIT_COMMIT = `abcd123`;
const VERSION = `69.420.1337`;

beforeAll(() => {
    process.env = {
        ...OLD_ENV,
        GIT_COMMIT,
        VERSION,
    };
});

afterAll(() => {
    process.env = OLD_ENV;
});

describe(`VersionPage`, () => {
    describe(`Render`, () => {
        test(`with process.env.GIT_COMMIT`, () => {
            render(<VersionPage />);
            expect(screen.getByText(new RegExp(GIT_COMMIT))).toBeInTheDocument();
        });

        test(`with process.env.VERSION`, () => {
            render(<VersionPage />);
            expect(screen.getByText(new RegExp(escapeRegExp(VERSION)))).toBeInTheDocument();
        });
    });
});
