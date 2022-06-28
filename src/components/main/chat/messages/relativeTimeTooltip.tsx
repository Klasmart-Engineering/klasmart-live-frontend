
import { fromMillisecondsToSeconds } from "@/utils/utils";
import {
    makeStyles,
    Tooltip,
} from "@material-ui/core";
import { TimeFive as TimestampIcon } from "@styled-icons/boxicons-regular/TimeFive";
import React,
{ useState } from "react";
import { FormattedRelativeTime } from "react-intl";

const TOOLTIP_UPDATE_INTERVAL = 60;
const useStyles = makeStyles((theme) => ({

    timeIcon: {
        marginLeft: 5,
        color: theme.palette.grey[500],
    },
}));

const getRelativeTime = (date: Date) => {
    const now = Date.now();
    return fromMillisecondsToSeconds(date.getTime() - now);
};

interface Props {
    date: Date;

}

function RelativeTimeTooltip ({ date }: Props) {
    const [ relativeTimeValue, setRelativeTimeValue ] = useState(getRelativeTime(date));

    const classes = useStyles();

    const refreshRelativeTime = () => {
        setRelativeTimeValue(getRelativeTime(date));
    };

    return (
        <Tooltip
            placement="top"
            title={(

                <FormattedRelativeTime
                    value={relativeTimeValue}
                    numeric="auto"
                    updateIntervalInSeconds={TOOLTIP_UPDATE_INTERVAL}
                />

            )}
            onOpen={refreshRelativeTime}
        >
            <TimestampIcon
                size="0.85rem"
                className={classes.timeIcon}

            />
        </Tooltip>
    );
}

export default RelativeTimeTooltip;
