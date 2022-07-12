
import { ACTIVE_TOOLBAR_ICON_BACKGROUND } from "@/config";
import {
    Grid,
    makeStyles,
    Theme,
    Tooltip,
} from "@material-ui/core";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
    item: {
        padding: `0.4em 0.6em`,
        margin: `0 1px`,
        cursor: `pointer`,
        position: `relative`,
        display: `flex`,
        borderRadius: 7,
        transition: `100ms all ease-in-out`,
    },
    active: {
        backgroundColor: ACTIVE_TOOLBAR_ICON_BACKGROUND,
    },
    disabled: {
        pointerEvents: `none`,
        opacity: 0.4,
    },
    hasSubmenu: {
        "&:after": {
            content: `''`,
            position: `absolute`,
            top: 3,
            left: `calc(50% - 4px)`,
            borderBottom: `4px solid black`,
            borderBottomColor: `inherit`,
            borderRight: `4px solid transparent`,
            borderLeft: `4px solid transparent`,
        },
    },
}));

interface Props {
	onClick: any;
    icon: any;
    title?: string;
    active?: boolean;
    activeStyles?: CSSProperties;
    disabled?: boolean;
    hasSubmenu?: boolean;
}

export const CanvasMenuItemStudy = React.forwardRef((props: Props, ref: React.Ref<any>) => {
    const classes = useStyles();
    const {
        onClick,
        active,
        icon,
        activeStyles,
        title,
        disabled,
        hasSubmenu,
    } = props;

    return(
        <Grid
            ref={ref}
            item
        >
            <Tooltip
                title={title ?? ``}
                placement="top"
            >
                <div
                    className={clsx(classes.item, {
                        [classes.active]: active,
                        [classes.disabled]: disabled,
                        [classes.hasSubmenu]: hasSubmenu,
                    })}
                    style={active ? activeStyles : {}}
                    onClick={onClick}
                >
                    {icon}
                </div>
            </Tooltip>
        </Grid>
    );
});
