import Fab, { FabProps } from "@material-ui/core/Fab";
import Hidden from "@material-ui/core/Hidden";
import { withStyles } from "@material-ui/core/styles";
import SendIcon from "@material-ui/icons/Send";
import React from "react";

interface Props {
    children?: React.ReactNode;
    className?: string;
    extendedOnly?: boolean;
    flat?: boolean;
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

export default function StyledFAB(props: Props & FabProps) {
    const {children, extendedOnly, flat, ...other } = props;

    let sibling: React.ReactNode;
    React.Children.map(children, (child) => (
        typeof child !== "string" ? sibling = child : {}
    ));

    return (
        extendedOnly ?
            <StyledFab variant="extended" style={{ minWidth: 120, boxShadow: flat ? "none" : "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)" }} {...other}>
                { children || <SendIcon />}
            </StyledFab> :
            <>
                <Hidden smDown>
                    <StyledFab variant="extended" style={{ minWidth: 120, boxShadow: flat ? "none" : "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)" }} {...other}>
                        { children || <SendIcon />}
                    </StyledFab>
                </Hidden>
                <Hidden mdUp>
                    <StyledFab variant="round" size="small" {...other}>
                        { sibling || <SendIcon fontSize="small" /> }
                    </StyledFab>
                </Hidden>
            </>
    );
}
