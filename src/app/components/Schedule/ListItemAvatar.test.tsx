
import ScheduleListItemAvatar from "@/app/components/Schedule/ListItemAvatar";
import { screen } from '@testing-library/react';
import { render } from "@tests/utils/render";
import React from "react";

describe(`ScheduleListItemAvatar`, () => {
    describe(`Render`, () => {
        test(`default props`, () => {
            const mockedSrc = `woop.svg`;
            const mockedAlt = `image description`;

            render(<ScheduleListItemAvatar
                src={mockedSrc}
                alt={mockedAlt}
            />);

            const image = screen.getByAltText(mockedAlt);

            expect(image).toBeInTheDocument();
            expect(image).toHaveAttribute(`src`, mockedSrc);
        });
    });
});
