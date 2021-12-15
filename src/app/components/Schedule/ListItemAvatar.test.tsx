
import ScheduleListItemAvatar from "@/app/components/Schedule/ListItemAvatar";
import { THEME_COLOR_SECONDARY_DEFAULT } from "@/config";
import { Star as HomeFunStudyIcon } from "@styled-icons/fa-solid/Star";
import { screen } from '@testing-library/react';
import { render } from "@tests/utils/render";
import React from "react";

describe(`ScheduleListItemAvatar`, () => {
    describe(`Render`, () => {
        test(`default props`, () => {
            render(<ScheduleListItemAvatar
                src={<HomeFunStudyIcon />}
                color={THEME_COLOR_SECONDARY_DEFAULT}
            />);

            const image = screen.getByTestId(`schedule-list-item-avatar`);
            expect(image).toBeInTheDocument();
        });
    });
});
