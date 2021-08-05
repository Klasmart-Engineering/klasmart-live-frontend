import { MaterialTypename } from "../../../lessonMaterialContext";
import { ContentType } from "../../../pages/utils";
import { LocalSessionContext } from "../../providers/providers";
import {
    activeTabState,
    classInfoState,
    InteractiveMode,
} from "../../states/layoutAtoms";
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
{
    useContext,
    useState,
} from "react";
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
        overflowY: `auto`,
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
    const doc: any = window.document;
    const docEl = doc.getElementById(id) as any;

    const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
    } else {
        cancelFullScreen.call(doc);
    }
}

export const sleep = (m:number) => new Promise(r => setTimeout(r, m));

export const defineContentType = (material:any, interactiveMode:InteractiveMode) => {
    if(interactiveMode === InteractiveMode.OnStage) return ContentType.Blank;
    if(interactiveMode === InteractiveMode.Observe) return ContentType.Activity;

    if(material.__typename === MaterialTypename.Video || (material.__typename === undefined && material.video)){
        return ContentType.Video;
    }else if (material.__typename === MaterialTypename.Audio) {
        return ContentType.Audio;
    }else if (material.__typename === MaterialTypename.Image) {
        return ContentType.Image;
    }else{
        return ContentType.Stream;
    }
};

export const defineContentId = (material:any, interactiveMode:InteractiveMode, streamId:any, sessionId:any) => {
    if(interactiveMode === InteractiveMode.OnStage) return sessionId;
    if(interactiveMode === InteractiveMode.Observe) return material.url;

    if(material.__typename === MaterialTypename.Video || (material.__typename === undefined && material.video) || material.__typename === MaterialTypename.Audio){
        return sessionId;
    }else if (material.__typename === MaterialTypename.Image) {
        return material.url;
    }else{
        return streamId;
    }
};

export interface BrandingType {
    iconImageURL: string;
    primaryColor: string;
}

export async function getOrganizationBranding (organization_id:any) {
    const GET_ORGANIZATION_BRANDING = `
        query organization($organization_id: ID!){
            organization(organization_id: $organization_id){
                branding{
                    iconImageURL
                    primaryColor
                }
            }
        }`
    ;

    const headers = new Headers();
    headers.append(`Accept`, `application/json`);
    headers.append(`Content-Type`, `application/json`);
    const response = await fetch(`${process.env.ENDPOINT_API}/user/`, {
        method: `POST`,
        headers,
        body: JSON.stringify({
            query: GET_ORGANIZATION_BRANDING,
            variables: {
                organization_id,
            },
        }),
        credentials: `include`,
    });
    const { data } = await response.json();
    return data.organization.branding;
}

export async function classGetInformation (schedule_id: any, org_id: any) {
    let data:any = {};

    async function classAPI () {
        const headers = new Headers();
        headers.append(`Accept`, `application/json`);
        headers.append(`Content-Type`, `application/json`);
        const ENDPOINT_CMS_URL = window.location.href.indexOf(`localhost`) > 0 ? `https://run.mocky.io/v3/a6b4aed5-a341-4d45-9a63-842d6ff1d53e` : `${process.env.ENDPOINT_CMS}/v1/schedules/${schedule_id}?org_id=${org_id}`;

        const response = await fetch(`${ENDPOINT_CMS_URL}`, {
            headers,
            method: `GET`,
            credentials: `include`,
        });

        if (response.status === 200) return response.clone().json();
    }

    try { data = await Promise.all([ classAPI() ]); }
    catch (err) { console.error(`Fail to classGetInformation in Live: ${err}`); }
    finally { return data[0]; }
}
