
import BaseScheduleDialogContent,
{ DialogContentItem } from "@/app/components/Schedule/BaseDialogContent";
import { screen } from '@testing-library/react';
import { render } from "@tests/utils/render";
import React from "react";

describe(`BaseScheduleDialogContent`, () => {
    describe(`Render`, () => {
        test(`items with content strings`, () => {
            const mockedHeader = `Header`;
            const mockedContent = `Content`;

            const mockedItems: DialogContentItem[]  = [
                {
                    header: mockedHeader,
                    content: mockedContent,
                },
            ];

            render(<BaseScheduleDialogContent items={mockedItems} />);

            expect(screen.getByText(mockedHeader)).toBeInTheDocument();
            expect(screen.getByText(mockedContent)).toBeInTheDocument();
        });

        test(`items with content html elements`, () => {
            const mockedHeader = `Header`;
            const mockedContent1 = `Content 1`;
            const mockedContent2 = `Content 2`;

            const mockedItems: DialogContentItem[]  = [
                {
                    header: mockedHeader,
                    content: (
                        <>
                            <div>{mockedContent1}</div>
                            <div>{mockedContent2}</div>
                        </>
                    ),
                },
            ];

            render(<BaseScheduleDialogContent items={mockedItems} />);

            expect(screen.getByText(mockedHeader)).toBeInTheDocument();
            expect(screen.getByText(mockedContent1)).toBeInTheDocument();
            expect(screen.getByText(mockedContent2)).toBeInTheDocument();
        });
    });
});
