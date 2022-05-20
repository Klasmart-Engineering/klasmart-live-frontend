import {
    activeTabState,
    ActiveTabStateType,
    isClassDetailsOpenState,
} from "@/store/layoutAtoms";
import { Button, Theme, Tooltip } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import clsx from "clsx";
import React from "react";
import { useSetRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: `12px 0`,
        border: 0,
        borderRadius: 0,
        color: theme.palette.grey[500],
        position: `relative`,
        minWidth: 50,
        "& svg": {
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
        "&:first-child": {
            borderRadius: `0 0 0 12px`,
        },
    },
}));

interface Props {
	icon: any;
	name: ActiveTabStateType;
    label: string;
	active?: boolean;
}

function SidebarMenuItem (props: Props) {
    const classes = useStyles();
    const {
        name,
        label,
        icon,
        active,
    } = props;
    const setActiveTab = useSetRecoilState(activeTabState);
    const setIsClassDetailsOpen = useSetRecoilState(isClassDetailsOpenState);

    const handleChangeTab = (name: ActiveTabStateType) => {
        setActiveTab(name);
        setIsClassDetailsOpen(false);
    };

    return (
        <Tooltip
            title={label}
            placement="left"
        >
            <Button
                className={clsx(classes.root, active && classes.active)}
                onClick={() => handleChangeTab(name)}
            >
                {icon}
            </Button>
        </Tooltip>
    );
}

export default SidebarMenuItem;
