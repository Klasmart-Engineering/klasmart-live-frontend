import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import React, { useState } from "react";

// import { useSelector, useStore } from "react-redux";
// import { ActionTypes } from "../store/actions";
// import { State } from "../store/store";

interface Props {
    children?: React.ReactNode;
    className?: string;
    iconOnly?: boolean;
}

const StyledSwitch = withStyles({
    checked: {
        "& $thumb": {
            backgroundColor: "#fff",
        },
        "& + $track": {
            "&:after": {
                opacity: 0,
            },
            "&:before": {
                opacity: 1,
            },
            "background": "linear-gradient(to right, #fafafa, #eee)",
        },
        "&$switchBase": {
            "&:hover": {
                backgroundColor: "rgba(24,90,257,0.08)",
            },
            "color": "#185a9d",
            "transform": "translateX(32px)",
        },
    },
    root: {
        fontSize: "0.8em",
        height: 36,
        padding: 4,
        width: 80,
    },
    switchBase: {
        color: "#ff6a00",
        padding: 8,
    },
    thumb: {
        backgroundColor: "#fff",
        height: 20,
        width: 20,
    },
    track: {
        "&:after": {
            color: "white",
            content: "\"dark\"",
            right: 4,
        },
        "&:before": {
            color: "black",
            content: "\"light\"",
            left: 4,
            opacity: 0,
        },
        "&:before, &:after": {
            display: "inline-block",
            position: "absolute",
            textAlign: "center",
            top: "50%",
            transform: "translateY(-50%)",
            width: "50%",
        },
        "background": "linear-gradient(to right, #030d1c, #185a9d)",
        "borderRadius": 20,
        "opacity": "1 !important",
        "position": "relative",
    },
})(Switch);

export default function Lightswitch(props: Props) {
    const store = useStore();
    const darkMode = useSelector((state: State) => state.ui.darkMode);

    function setDarkMode(toggle: boolean) {
        const mode = toggle ? "light" : "dark";
        store.dispatch({ type: ActionTypes.DARK_MODE, payload: mode });
    }

    const [toggled, setToggled] = useState(darkMode === "light" ? true : false);
    const {children, className, iconOnly, ...other } = props;

    let sibling: React.ReactNode;
    React.Children.map(children, (child) => (
        typeof child !== "string" ? sibling = child : {}
    ));

    return (
        iconOnly ?
            <IconButton
                aria-label="set dark mode"
                style={{ color: "inherit", fontSize: "inherit" }}
                onClick={() => {
                    setToggled(!toggled);
                    setDarkMode(!toggled);
                }}
                {...other}
            >
                { toggled ?
                    <Brightness4Icon style={{ fontSize: "inherit" }} /> :
                    <Brightness7Icon style={{ fontSize: "inherit" }} />
                }
            </IconButton>
            :
            <StyledSwitch
                checked={toggled}
                className={className}
                onChange={(e) => {
                    setToggled(e.target.checked);
                    setDarkMode(e.target.checked);
                }}
                {...other}
            />
    );
}
