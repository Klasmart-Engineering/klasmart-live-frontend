
import ScheduleListItem,
{ Props } from "@/app/components/Schedule/ListItem";
import {
    fireEvent,
    screen,
} from '@testing-library/react';
import { render } from "@tests/utils/render";
import React from "react";

describe(`ScheduleListItem`, () => {
    const mockedLeading = `leading`;
    const mockedTitle = `title`;

    const defaultProps: Props = {
        leading: <div>{mockedLeading}</div>,
        title: mockedTitle,
    };

    describe(`Render`, () => {
        test(`default props`, () => {
            render(<ScheduleListItem {...defaultProps} />);

            expect(screen.getByText(mockedLeading)).toBeInTheDocument();
            expect(screen.getByText(mockedTitle)).toBeInTheDocument();
        });

        test(`subtitle prop`, () => {
            const mockedSubtitle = `subtitle`;

            render(<ScheduleListItem
                subtitle={mockedSubtitle}
                {...defaultProps}
            />);

            expect(screen.getByText(mockedSubtitle)).toBeInTheDocument();
        });

        test(`trailing prop as string`, () => {
            const mockedTrailing = `trailing`;

            render(<ScheduleListItem
                trailing={mockedTrailing}
                {...defaultProps}
            />);

            expect(screen.getByText(mockedTrailing)).toBeInTheDocument();
        });

        test(`trailing prop as html element`, () => {
            const text = `trailing`;
            const mockedTrailing = <div>{text}</div>;

            render(<ScheduleListItem
                trailing={mockedTrailing}
                {...defaultProps}
            />);

            expect(screen.getByText(text)).toBeInTheDocument();
        });
    });

    describe(`Interact`, () => {
        test(`onClick`, () => {
            const mockedOnClick = jest.fn();

            render(<ScheduleListItem
                onClick={mockedOnClick}
                {...defaultProps}
            />);

            fireEvent.click(screen.getByRole(`button`));

            expect(mockedOnClick).toHaveBeenCalledTimes(1);
        });
    });
});
