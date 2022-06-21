import { THEME_COLOR_SECONDARY_DEFAULT } from "@/config";
import { Theme } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tooltip from "@mui/material/Tooltip";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        tabRoot: {
            minWidth: `auto`,
            padding: 0,
            "&:hover": {
                color: THEME_COLOR_SECONDARY_DEFAULT,
                opacity: 1,
                transform: `translateX(-2px)`,
            },
            "&$tabSelected": {
                color: THEME_COLOR_SECONDARY_DEFAULT,
                opacity: 1,
            },
            "&:focus": {
                color:THEME_COLOR_SECONDARY_DEFAULT,
            },
            "-webkit-transition": `all .4s ease`,
            transition: `all .4s ease`,
        },
        tabSelected: {
            color: THEME_COLOR_SECONDARY_DEFAULT,
            opacity: 1,
        },
    }));

interface StyledTabProps {
    children: React.ReactElement;
    className: string;
    handlers: {
        setDrawerOpen: (open: boolean) => void;
        setTabIndex: React.Dispatch<React.SetStateAction<number>>;
    };
    mobile?: boolean;
    value: number;
    title: string;
}

export default function StyledTab (props: StyledTabProps) {
    const classes = useStyles();
    const {
        children,
        className,
        handlers,
        mobile,
        value,
        title,
    } = props;

    const a11yProps = () => {
        return {
            id: `vertical-tab-${title}`,
            "aria-controls": `vertical-tabpanel-${title}`,
        };
    };

    return (
        <Tab
            classes={{
                root: mobile ? `` : classes.tabRoot,
                selected: mobile ? `` : classes.tabSelected,
            }}
            className={className}
            label={mobile ? children : <Tooltip
                arrow
                placement="left"
                title={<FormattedMessage id={title} />}
                                       >{children}
                                       </Tooltip>}
            value={value}
            style={{
                backgroundColor: `#FFF`,
                opacity: 1,
            }}
            onClick={() => {
                handlers.setDrawerOpen(true);
                handlers.setTabIndex(value);
            }}
            {...a11yProps}
        />
    );
}
