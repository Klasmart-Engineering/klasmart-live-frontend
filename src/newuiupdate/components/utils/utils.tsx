import { activeTabState } from "../../states/layoutAtoms";
import {
    Drawer,
    Fade,
    makeStyles,
    Paper,
    Popper,
    Theme,
    Typography,
} from "@material-ui/core";
import React,
{ useState } from "react";
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
        zIndex: 1200,
    },
    popperPapper: {
        borderRadius: 12,
        overflow: `hidden`,
        maxHeight: `calc(100vh - 150px)`,
        overflowY: `scroll`,
        boxShadow: `0 1px 2px 0 rgba(0, 0, 0, 0.075), 0 2px 12px 0px rgba(0, 0, 0, 0.065)`,
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
            <div
                className={classes.styledDrawerInner}
                style={{
                    marginBottom: activeTab === `mosaic` ? 20 : ``,
                }}>{children}</div>
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
                <Paper className={classes.popperPapper}>{children}</Paper>
            </Fade>
        </Popper>
    );
}

export { StyledPopper };

interface TabPanelProps {
	children?: React.ReactNode;
	index: any;
	value: any;
}

function TabPanel (props: TabPanelProps) {
    const {
        children,
        value,
        index,
        ...other
    } = props;
    const classes = useStyles();

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            style={{
                height: `100%`,
            }}
            {...other}
        >
            {value === index && children}
        </div>
    );
}
export { TabPanel };

const useStylesNoItemList = makeStyles((theme: Theme) => ({
    root:{
        display: `flex`,
        justifyContent: `center`,
        alignItems: `center`,
        height: `100%`,
    },
    inner:{
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
    },
    icon:{
        marginBottom: 10,
        "& svg":{
            height: `4rem`,
            width: `4rem`,
            opacity: 0.1,
        },
    },
    text:{
        color: theme.palette.grey[700],
    },
}));

interface NoItemListProps {
	icon?: any;
	text?: string;
}

function NoItemList (props: NoItemListProps) {
    const classes = useStylesNoItemList();
    const {
        icon,
        text,
    } = props;

    return (
        <div className={classes.root}>
            <div className={classes.inner}>
                <div className={classes.icon}>{icon}</div>
                <Typography className={classes.text}>{text}</Typography>
            </div>
        </div>
    );
}

export { NoItemList };

export function fullScreenById (id:any) {
    const video = document.getElementById(id) as any;

    if (!video) return;

    if (video.requestFullscreen)
        video.requestFullscreen();
    else if (video.webkitRequestFullscreen)
        video.webkitRequestFullscreen(); // to support on Safari
    else if (video.msRequestFullScreen)
        video.msRequestFullScreen(); // to support on Edge
}
