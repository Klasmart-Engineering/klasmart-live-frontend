import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";

import { Brightness4 as Brightness4Icon } from "@styled-icons/material/Brightness4";
import { Brightness7 as Brightness7Icon } from "@styled-icons/material/Brightness7";

import { useDispatch, useSelector } from "react-redux";
import { State } from "../store/store";
import { setThemeMode } from "../store/reducers/control";

interface Props {
    children?: React.ReactNode;
    className?: string;
    type?: "icon" | "text" | "switch" | "default" | undefined;
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
    const dispatch = useDispatch();
    const themeMode = useSelector((state: State) => state.control.themeMode);

    const [toggled, setToggled] = useState(themeMode === "light" ? true : false);
    const { children, className, type, ...other } = props;

    let sibling: React.ReactNode;
    React.Children.map(children, (child) => (
        typeof child !== "string" ? sibling = child : {}
    ));

    function handleClick(value: boolean) {
        setToggled(value);
        dispatch(setThemeMode(value ? "light" : "dark"));
    }

    switch (type) {
        case "icon":
            return (
                <IconButton
                    aria-label="set dark mode"
                    style={{ color: "inherit", fontSize: "inherit" }}
                    onClick={() => handleClick(!toggled)}
                    {...other}
                >
                    {toggled ?
                        <Brightness4Icon size="1rem" /> :
                        <Brightness7Icon size="1rem" />
                    }
                </IconButton>
            )
        case "text":
            return (
                <Grid
                    container
                    direction="row"
                    alignItems="center"
                >
                    <Grid item xs={10}>
                        <Typography variant="body2">
                            <FormattedMessage id="enable_dark_mode" />
                        </Typography>
                    </Grid>
                    <Grid container justify="flex-end" item xs={2}>
                        <Checkbox
                            checked={!toggled}
                            onClick={() => handleClick(!toggled)}
                            color="primary"
                            style={{ backgroundColor: "transparent" }}
                            inputProps={{ 'aria-label': 'set dark mode' }}
                        />
                    </Grid>
                </Grid>
            )
        default:
            return (
                <StyledSwitch
                    checked={toggled}
                    className={className}
                    onChange={(e) => handleClick(e.target.checked)}
                    {...other}
                />
            )
    }
}
