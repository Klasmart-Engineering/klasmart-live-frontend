import Fab from "@material-ui/core/Fab";
import Hidden from "@material-ui/core/Hidden";
import { withStyles } from "@material-ui/core/styles";
import React from "react";

interface Props {
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    type?: "button" | "reset" | "submit" | undefined;
    extendedOnly?: boolean;
}

const StyledFab = withStyles({
    root: {
        "&:hover": {
            "-webkit-transition": "all .4s ease",
            "background": "#1B365D",
            "box-shadow": "0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)",
            "transform": "translateY(-2px)",
            "transition": "all .4s ease",
        },
        "background": "#0E78D5",
        "color": "white",

    },
})(Fab);

export default function StyledFAB(props: Props) {
    const {children, className, extendedOnly, type, ...other } = props;

    let sibling: React.ReactNode;
    React.Children.map(children, (child, index) => (
        typeof child !== "string" ? sibling = child : {}
    ));

    return (
        extendedOnly ?
            <StyledFab variant="extended" style={{ minWidth: 120 }} {...other}>
                { children || "class names"}
            </StyledFab> :
            <>
                <Hidden smDown>
                    <StyledFab variant="extended" style={{ minWidth: 120 }} {...other}>
                        { children || "class names"}
                    </StyledFab>
                </Hidden>
                <Hidden mdUp>
                    <StyledFab variant="round" size="small" {...other}>
                        { sibling || "class names" }
                    </StyledFab>
                </Hidden>
            </>
    );
}
