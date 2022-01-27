import { TEXT_COLOR_PRIMARY_DEFAULT } from "@/config";
import {
    createStyles,
    Switch as MUISwitch,
    Theme,
    withStyles,
} from "@material-ui/core";

export const Switch = withStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(1),
            width: 64,
        },
        switchBase: {
            '&$checked': {
                transform: `translateX(26px)`,
                color: theme.palette.common.white,
                '& + $track': {
                    backgroundColor: TEXT_COLOR_PRIMARY_DEFAULT,
                    opacity: 1,
                    '&:before': {
                        opacity: 1,
                    },
                    '&:after': {
                        opacity: 0,
                    },
                },
            },
        },
        thumb: {
            boxShadow: `none`,
            width: 16,
            height: 16,
            margin: 2,
        },
        track: {
            borderRadius: 22 / 2,
            '&:before, &:after': {
                content: `""`,
                position: `absolute`,
                top: `50%`,
                transform: `translateY(-50%)`,
                opacity: 0,
                color: theme.palette.common.white,
                fontSize: 10,
                fontFamily: theme.typography.fontFamily,
                fontWeight: theme.typography.fontWeightBold as number,
            },
            '&:before': {
                content: `'ON'`,
                left: 16,
            },
            '&:after': {
                content: `'OFF'`,
                right: 14,
                opacity: 1,
            },
        },
        checked: {},
    }))(MUISwitch);
