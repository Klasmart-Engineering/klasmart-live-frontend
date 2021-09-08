import {
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tooltip from "@material-ui/core/Tooltip";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        tabRoot: {
            minWidth: `auto`,
            padding: 0,
            "&:hover": {
                color: `#0E78D5`,
                opacity: 1,
                transform: `translateX(-2px)`,
            },
            "&$tabSelected": {
                color: `#0E78D5`,
                opacity: 1,
            },
            "&:focus": {
                color: `#0E78D5`,
            },
            "-webkit-transition": `all .4s ease`,
            transition: `all .4s ease`,
        },
        tabSelected: {
            color: `#0E78D5`,
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
                title={<FormattedMessage id={title} />}>{children}</Tooltip>}
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
