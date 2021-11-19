
import ScheduleListSectionHeader from "@/app/components/Schedule/ListSectionHeader";
import { screen } from '@testing-library/react';
import { render } from "@tests/utils/render";
import React from "react";

describe(`ScheduleListSectionHeader`, () => {
    describe(`Render`, () => {
        test(`default props`, () => {
            const mockedTitle = `Test title`;
            render(<ScheduleListSectionHeader title={mockedTitle} />);
            expect(screen.getByText(mockedTitle)).toBeInTheDocument();
        });
    });
});
