import {
    ContentType,
    InteractiveMode,
} from "@/pages/utils";
import { activeTabState } from "@/store/layoutAtoms";
import {
    LessonMaterial,
    MaterialTypename,
} from "@/types/lessonMaterial";
import {
    Drawer,
    Fade,
    makeStyles,
    Paper,
    Popper,
    PopperPlacementType,
    Theme,
    Tooltip,
    Typography,
} from "@material-ui/core";
import clsx from "clsx";
import React,
{ ReactElement } from "react";
import { useIntl } from "react-intl";
import { useRecoilValue } from "recoil";

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
        display: `flex`,
        maxHeight: `calc(100vh - 95px)`,
        borderRadius: 12,
        overflow: `hidden`,
        overflowY: `auto`,
        boxShadow: `0 1px 2px 0 rgba(0, 0, 0, 0.075), 0 2px 12px 0px rgba(0, 0, 0, 0.065)`,
    },
    popperPapperNoScrollbar: {
        '&::-webkit-scrollbar': {
            width: `0em`,
        },
    },
    popperPapperKeyboard: {
        maxHeight: `none`,
    },
}));

function StyledDrawer (props: StyledDrawerProps) {
    const classes = useStyles();

    const DRAWER_WIDTH = 340;
    const { children, active } = props;

    const activeTab = useRecoilValue(activeTabState);

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
                    width: DRAWER_WIDTH,
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
                width: active ? DRAWER_WIDTH : 0,
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
    anchorEl?: HTMLElement | null;
    placement?: PopperPlacementType;
    height?: number | string;
    showScrollbar?: boolean;
    modifiers?: Record<string, unknown>;
    isKeyboardVisible?: boolean;
}

function StyledPopper (props: StyledPopperProps) {
    const classes = useStyles();
    const {
        children,
        open = false,
        anchorEl,
        placement = `top`,
        height,
        showScrollbar = false,
        modifiers = {
            preventOverflow: {
                boundariesElement: document.getElementById(`main-content`),
            },
        },
        isKeyboardVisible = false,
    } = props;

    return (
        <Popper
            transition
            open={open}
            anchorEl={anchorEl}
            disablePortal={false}
            placement={placement}
            modifiers={modifiers}
            className={classes.popperRoot}
        >
            <Fade in={open}>
                <Paper
                    className={clsx(classes.popperPapper, {
                        [classes.popperPapperNoScrollbar]: showScrollbar,
                        [classes.popperPapperKeyboard]: isKeyboardVisible,
                    })}
                    style={{
                        height,
                    }}>{children}</Paper>
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
        textAlign: `center`,
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

declare global {
    interface Document {
        mozCancelFullScreen?: () => Promise<void>;
        msExitFullscreen?: () => Promise<void>;
        webkitExitFullscreen?: () => Promise<void>;
        mozFullScreenElement?: Element;
        msFullscreenElement?: Element;
        webkitFullscreenElement?: Element;
      }

      interface HTMLElement {
        msRequestFullscreen?: () => Promise<void>;
        mozRequestFullscreen?: () => Promise<void>;
        webkitRequestFullscreen?: () => Promise<void>;
      }
}

export function toggleFullScreenById (id: string) {
    const doc = window.document;
    const docEl = doc.getElementById(id);
    if (!docEl) return;

    const requestFullScreen = docEl.requestFullscreen ?? docEl?.mozRequestFullscreen ?? docEl?.webkitRequestFullscreen ?? docEl.msRequestFullscreen;
    const cancelFullScreen = doc.exitFullscreen ?? doc.mozCancelFullScreen ?? doc.webkitExitFullscreen ?? doc.msExitFullscreen;
    const fullScreenElement = doc.fullscreenElement ?? doc.mozFullScreenElement ?? doc.webkitFullscreenElement ?? doc.msFullscreenElement;

    if (!fullScreenElement) {
        requestFullScreen.call(docEl);
    } else {
        cancelFullScreen.call(doc);
    }
}

export const sleep = (m:number) => new Promise(r => setTimeout(r, m));

export const defineContentType = (material: LessonMaterial | undefined, interactiveMode: InteractiveMode) => {
    switch (interactiveMode) {
    case InteractiveMode.ONSTAGE: return ContentType.Blank;
    case InteractiveMode.OBSERVE: return ContentType.Activity;
    case InteractiveMode.SCREENSHARE: return ContentType.Stream;
    default:
        if (material?.__typename === MaterialTypename.VIDEO || (material?.__typename === undefined && material?.video)) {
            return ContentType.Video;
        } else if (material?.__typename === MaterialTypename.AUDIO) {
            return ContentType.Audio;
        } else {
            return ContentType.Stream;
        }
    }

};

export const defineContentId = (material: LessonMaterial | undefined, interactiveMode: InteractiveMode, streamId: string, sessionId: string) => {
    switch (interactiveMode) {
    case InteractiveMode.ONSTAGE: return sessionId;
    case InteractiveMode.OBSERVE: return material?.url;
    default:
        if (material?.__typename === MaterialTypename.VIDEO || (material?.__typename === undefined && material?.video) || material?.__typename === MaterialTypename.AUDIO) {
            return sessionId;
        } else {
            return streamId;
        }
    }
};

export const fromSecondsToMilliseconds = (duration: number) => duration * 1000;
export interface BrandingType {
    iconImageURL: string;
    primaryColor: string;
}

export async function getOrganizationBranding (organizationId: string, endpoint: string): Promise<BrandingType> {
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
    const response = await fetch(`${endpoint}`, {
        method: `POST`,
        headers,
        body: JSON.stringify({
            query: GET_ORGANIZATION_BRANDING,
            variables: {
                organization_id: organizationId,
            },
        }),
        credentials: `include`,
    });
    const { data } = await response.json();
    return data.organization.branding;
}

export async function classGetInformation (scheduleId: any, orgId: any, endpoint: string) {
    let data:any = {};

    async function classAPI () {
        const headers = new Headers();
        headers.append(`Accept`, `application/json`);
        headers.append(`Content-Type`, `application/json`);
        const ENDPOINT_CMS_URL = window.location.href.indexOf(`localhost`) > 0 ? `https://run.mocky.io/v3/a6b4aed5-a341-4d45-9a63-842d6ff1d53e` : `${endpoint}/v1/schedules/${scheduleId}?org_id=${orgId}`;

        const response = await fetch(`${ENDPOINT_CMS_URL}`, {
            headers,
            method: `GET`,
            credentials: `include`,
        });

        if (response.status === 200) return response.clone().json();
    }

    try { data = await Promise.all([ classAPI() ]); }
    catch (err) { console.error(`Fail to classGetInformation in Live: ${err}`); }
    return data[0];
}

interface TooltipIntlProps {
    id: string;
    children: ReactElement;
}

function TooltipIntl ({ id, children }: TooltipIntlProps) {
    const intl = useIntl();

    return(
        <Tooltip title={intl.formatMessage({
            id: id,
        })}>
            { children }
        </Tooltip>
    );
}

export { TooltipIntl };
