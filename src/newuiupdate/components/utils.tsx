import {
    Drawer,
    Fade,
    makeStyles,
    Paper,
    Popper,
    Theme,
} from "@material-ui/core";
import React,
{ useState } from "react";

import { activeTabState } from "../states/layoutAtoms";
import { useRecoilState } from "recoil";

interface StyledDrawerProps {
	children?: any;
	active?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
    styledDrawerRoot: {
        flexShrink: 0,
        transition: theme.transitions.create(`width`, {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shortest,
        }),

    },
    styledDrawerPaper: {
        transition: theme.transitions.create(`width`, {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shortest,
        }),
        border: 0,
        background: `transparent`,
    },
    styledDrawerInner: {
        borderRadius: 12,
        backgroundColor: theme.palette.grey[200],
        padding: 10,
        marginLeft: theme.spacing(2),
        height: `100%`,
    },
    popperRoot:{
        zIndex: 9999,
    },
    popperPapper: {
        borderRadius: 12,
        overflow: `hidden`,
        maxHeight: 'calc(100vh - 150px)',
        overflowY: 'scroll',
    },
}));

function StyledDrawer (props: StyledDrawerProps) {
    const classes = useStyles();

    const [ drawerWidth, setDrawerWidth ] = useState<any>(340);
    const { children, active } = props;

    const [ activeTab, setActiveTab ] = useRecoilState(activeTabState);

    return (
        <Drawer
            anchor="right"
            open={active}
            classes={{
                root: classes.styledDrawerRoot,
                paper: classes.styledDrawerPaper,
            }}
            PaperProps={{
                style: {
                    position: `absolute`,
                    width: drawerWidth,
                },
            }}
            BackdropProps={{
                style: {
                    position: `absolute`,
                },
            }}
            ModalProps={{
                style: {
                    position: `absolute`,
                },
            }}
            variant="persistent"
            style={{
                width: active ? drawerWidth : 0,
            }}
        >
            <div className={classes.styledDrawerInner} style={{marginBottom: activeTab === 'mosaic' ? 20 : ''}}>{children}</div>
        </Drawer>
    );
}

export { StyledDrawer };

interface StyledPopperProps {
	children: any;
	open?: boolean;
	anchorEl?: any;
}

function StyledPopper (props: StyledPopperProps) {
    const classes = useStyles();
    const {
        children,
        open,
        anchorEl,
    } = props;

    return (
        <Popper
            transition
            open={open ? true : false}
            anchorEl={anchorEl}
            disablePortal={false}
            placement="top"
            modifiers={{
                preventOverflow: {
                    boundariesElement: document.getElementById(`main-content`),
                },
            }}
            className={classes.popperRoot}
        >
            <Fade in={open}>
                <Paper
                    elevation={3}
                    className={classes.popperPapper}>{children}</Paper>
            </Fade>
        </Popper>
    );
}

export { StyledPopper };
