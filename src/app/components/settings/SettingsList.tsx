import {
    SCHEDULE_BLACK_TEXT,
    THEME_COLOR_PRIMARY_SELECT_DIALOG,
} from "@/config";
import {
    Box,
    ListItem,
    ListItemText,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
    Theme,
} from '@material-ui/core/styles';
import clsx from "clsx";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) => createStyles({
    listItem: {
        backgroundColor: theme.palette.background.paper,
        "&:hover": {
            backgroundColor: theme.palette.background.paper,
        },
        height: theme.spacing(7),
    },
    divider: {
        marginBottom: 1,
    },
    listItemTextPrimary: {
        color: SCHEDULE_BLACK_TEXT,
        fontWeight: theme.typography.fontWeightMedium as number,
        fontSize: `1rem`,
    },
    fontWeightBold: {
        fontWeight: theme.typography.fontWeightBold as number,
    },
    listItemTextSecondary: {
        color: THEME_COLOR_PRIMARY_SELECT_DIALOG,
        paddingLeft: theme.spacing(2),
    },
    contentContainer: {
        width: `auto`,
        overflow: `hidden`,
        borderRadius: theme.spacing(1.25),
    },
}));

export interface SettingsItemData {
    title: string;
    description?: string;
    rightIconString?: string;
    hasDivider?: boolean;
    onClick?: () => void;
    titleValue?: string;
    values?: Record<string, any>;
    isHighlight?: boolean;
}

interface Props {
    settingArray: SettingsItemData[];
    containerStyle?: string;
}
export default function SettingsList (props: Props) {
    const { settingArray, containerStyle } = props;
    const classes = useStyles();

    return (
        <Box className={clsx(classes.contentContainer, containerStyle)}>
            {settingArray.map((item) => (
                <ListItem
                    key={item.title}
                    button
                    className={clsx(classes.listItem, {
                        [classes.divider]: item.hasDivider,
                    })}
                    onClick={item.onClick}
                >
                    <ListItemText
                        primaryTypographyProps={{
                            className: clsx(classes.listItemTextPrimary, {
                                [classes.fontWeightBold]: item.isHighlight,
                            }),
                        }}
                        primary={
                            <>
                                <FormattedMessage
                                    id={item.title}
                                    values={item.values}
                                />
                                <span className={classes.listItemTextSecondary}>
                                    {item.description}
                                </span>
                            </>
                        }
                    />
                    {item.rightIconString && (
                        <img
                            alt="right icon"
                            src={item.rightIconString}
                        />
                    )}
                </ListItem>
            ))}
        </Box>
    );
}
