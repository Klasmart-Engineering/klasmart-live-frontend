import HealthPage from "./index";
import { screen } from "@testing-library/react";
import { render } from "@tests/utils/render";
import React from "react";

describe(`VersionPage`, () => {
    describe(`Render`, () => {
        test(`OK text`, () => {
            render(<HealthPage />);
            expect(screen.getByText(`OK`)).toBeInTheDocument();
        });
    });
});
