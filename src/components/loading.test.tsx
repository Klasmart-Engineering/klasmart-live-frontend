import { fallbackLocale } from "@/localization/localeCodes";
import Loading from "./loading";
import { screen } from "@testing-library/react";
import { render } from "@tests/utils/render";
import React from "react";

describe(`Loading`, () => {
    describe(`Render`, () => {
        test(`Default props`, () => {
            render(<Loading />);
            expect(screen.getByRole(`progressbar`)).toBeInTheDocument();
        });

        test(`messageId prop`, () => {
            const mockedMessageId = `loading`;
            render(<Loading messageId={mockedMessageId} />);
            const messageElement = screen.getByText(fallbackLocale.formatMessage({
                id: mockedMessageId,
            }));
            expect(messageElement).toBeInTheDocument();
        });
    });
});
