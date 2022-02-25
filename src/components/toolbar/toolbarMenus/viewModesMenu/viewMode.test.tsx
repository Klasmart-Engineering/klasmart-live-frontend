import ViewMode from "./viewMode";
import { Info as InfoIcon } from "@styled-icons/evaicons-solid/Info";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@tests/utils/render";
import React from "react";

beforeEach(() => {
    jest.clearAllMocks();
});

describe(`ViewMode`, () => {

    const mockedOnClick = jest.fn();

    const defaultProps = {
        display: true,
        icon: InfoIcon,
        title: `Test`,
        onClick: mockedOnClick,
    };

    describe(`Render`, () => {
        test(`default props`, () => {

            render(<ViewMode {...defaultProps} />);

            const viewMode = screen.getByRole(`button`, {
                name: defaultProps.title,
            });

            expect(viewMode).toBeInTheDocument();

        });
    });

    describe(`Interact`, () => {
        test(`onClick`, () => {

            render(<ViewMode {...defaultProps} />);

            const viewMode = screen.getByRole(`button`, {
                name: defaultProps.title,
            });

            userEvent.click(viewMode);

            expect(mockedOnClick).toHaveBeenCalledTimes(1);
        });
    });

});
