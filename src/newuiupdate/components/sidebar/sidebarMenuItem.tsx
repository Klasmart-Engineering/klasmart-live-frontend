import { activeTabState, isClassDetailsOpenState } from "../../states/layoutAtoms";
import {
    Button,
    makeStyles,
    Theme,
    Tooltip,
} from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: `12px 0`,
        border: 0,
        borderRadius: 0,
        color: theme.palette.grey[500],
        position: `relative`,
        minWidth: 50,
        "& svg":{
            height: 22,
            width: 22,
        },
        "&:after": {
            content: `''`,
            zIndex: 10,
            position: `absolute`,
            bottom: -20,
            right: 0,
            height: 20,
            width: `100%`,
            borderRadius: `0`,
            backgroundColor: `transparent`,
            boxShadow: `none`,
            transition: `border-radius 100ms ease-in-out`,
            pointerEvents: `none`,
        },
        "&:before": {
            content: `''`,
            zIndex: 10,
            position: `absolute`,
            top: -20,
            right: 0,
            height: 20,
            width: `100%`,
            borderRadius: `0`,
            backgroundColor: `transparent`,
            boxShadow: `none`,
            transition: `border-radius 100ms ease-in-out`,
            pointerEvents: `none`,
        },
    },
    active: {
        backgroundColor: theme.palette.background.default,
        color: `#000`,
        borderRadius: `12px 0 0 12px`,
        "&:hover": {
            backgroundColor: theme.palette.background.default,
        },
        "&:after": {
            borderRadius: `0 20px 0 0`,
            boxShadow: `30px 0 0 0 ${theme.palette.background.default}`,
        },
        "&:before": {
            borderRadius: `0 0 20px 0`,
            boxShadow: `30px 0 0 0 ${theme.palette.background.default}`,
        },
    },
}));

interface SidebarItemMenuProps {
	icon: any;
	name: string;
    label: string;
	active?: boolean;
}

function SidebarMenuItem (props: SidebarItemMenuProps) {
    const classes = useStyles();
    const {
        name,
        label,
        icon,
        active,
    } = props;
    const [ activeTab, setActiveTab ] = useRecoilState(activeTabState);
    const [ isClassDetailsOpen, setIsClassDetailsOpen ] = useRecoilState(isClassDetailsOpenState);

    const handleChangeTab = (e: string) => {
        setActiveTab(e);
        setIsClassDetailsOpen(false);
    };

    return (
        <Tooltip
            title={label}
            placement="left">
            <Button
                className={clsx(classes.root, active && classes.active)}
                onClick={(e) => handleChangeTab(name)}
            >
                {icon}
            </Button>
        </Tooltip>
    );
}

export default SidebarMenuItem;
