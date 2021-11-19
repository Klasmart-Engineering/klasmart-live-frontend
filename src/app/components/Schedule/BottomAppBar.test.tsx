import ScheduleBottomAppBar from "@/app/components/Schedule/BottomAppBar";
import { fallbackLocale } from "@/app/localization/localeCodes";
import { ScheduleAppBarItem } from "@/app/model/scheduleModel";
import {
    fireEvent,
    screen,
} from '@testing-library/react';
import { render } from "@tests/utils/render";
import React from "react";

describe(`ScheduleBottomAppBar`, () => {
    describe(`Render`, () => {
        test(`default`, () => {
            render(<ScheduleBottomAppBar />, {
                locale: fallbackLocale,
            });

            expect(screen.getByText(fallbackLocale.formatMessage({
                id: `schedule_liveTab`,
            }))).toBeInTheDocument();
            expect(screen.getByText(fallbackLocale.formatMessage({
                id: `schedule_studyTab`,
            }))).toBeInTheDocument();
        });
    });

    describe(`Interact`, () => {
        test.each([ ScheduleAppBarItem.LIVE, ScheduleAppBarItem.STUDY ])(`Click AppBarItem with ID = "%s"`, (stateId) => {
            render(<ScheduleBottomAppBar />, {
                locale: fallbackLocale,
            });

            fireEvent.click(screen.getByTestId(stateId));

            expect(screen.getByTestId(`${stateId}-container`)).toHaveClass(`selected`);
        });
    });
});
