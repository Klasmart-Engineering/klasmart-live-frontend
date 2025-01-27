/* eslint-disable react/no-multi-comp */
import { CLASS_POPPER_ZINDEX } from "@/config";
import {
    ContentType,
    InteractiveMode,
} from "@/pages/utils";
import {
    activeTabState,
    ActiveTabStateType,
} from "@/store/layoutAtoms";
import { UserNode } from "@/types/attendee";
import {
    LessonMaterial,
    MaterialTypename,
} from "@/types/lessonMaterial";
import {
    Dialog,
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
{
    ReactElement,
    useEffect,
    useRef,
} from "react";
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
    popperRoot: {
        zIndex: CLASS_POPPER_ZINDEX,
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
                    marginBottom: activeTab === ActiveTabStateType.MOSAIC ? 20 : ``,
                }}
            >{children}
            </div>
        </Drawer>
    );
}

export { StyledDrawer };

interface StyledPopperProps {
	children: React.ReactNode;
	open?: boolean;
    anchorEl?: HTMLElement | null;
    placement?: PopperPlacementType;
    showScrollbar?: boolean;
    modifiers?: Record<string, unknown>;
    isKeyboardVisible?: boolean;
    dialog?: boolean;
    dialogClose?: () => void;
    style?: object;
}

function StyledPopper (props: StyledPopperProps) {
    const classes = useStyles();
    const {
        children,
        open = false,
        anchorEl,
        placement = `top`,
        showScrollbar = false,
        style = {},
        modifiers = {
            preventOverflow: {
                boundariesElement: document.getElementById(`main-content`),
            },
        },
        isKeyboardVisible = false,
        dialog = false,
        dialogClose,
    } = props;

    if(dialog){
        return(
            <Dialog
                open={open}
                onClose={dialogClose}
            >
                {children}
            </Dialog>
        );
    }

   
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
                    style={style}
                >{children}
                </Paper>
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

export const sleep = (m: number) => new Promise(r => setTimeout(r, m));

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
export const fromMillisecondsToSeconds = (duration: number) => duration / 1000;
export const fromDateToSeconds = (date: Date) => fromMillisecondsToSeconds(date.getTime());

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
    let data: any = {};

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

        if (response.status === 200) return response.clone()
            .json();
    }

    try { data = await Promise.all([ classAPI() ]); }
    catch (err) { console.error(`Fail to classGetInformation in Live: ${err}`); }
    return data[0];
}


export async function getClassAttendeesIds (scheduleId: string, endpoint: string) {
    let data: any = {};

    const headers = new Headers();
    headers.append(`Accept`, `application/json`);
    headers.append(`Content-Type`, `application/json`);

    const mockDataUrl = `https://run.mocky.io/v3/67a61b31-dedb-41b7-a6c9-557433ef2d6d`;
    const fetchUrl = window.location.href.indexOf(`localhost`) > 0 ? mockDataUrl : `${endpoint}/v1/internal/schedules/${scheduleId}/relation_ids`;

    try{
        const response = await fetch(fetchUrl, {
            headers,
            method: `GET`,
            credentials: `include`,
        });
        data = await response.json();
    } catch (err) {
        console.error(`Fail getClassAttendeesIds: ${err}`);
    }

    return data;
}

export const getAttendeesFullNames = async ( ids: string[], endpoint: string) => {
    let data: any={};
    const userIds = ids.map((id) => ({
        userId: {
            value: id,
            operator: `eq`,
        },
    }));

    const filter = {
        OR: userIds,
    };

    const graphqlQuery = {
        query: `query attendees($filter: UserFilter) {
            usersConnection (direction:FORWARD, filter:$filter) {
              edges {
                node {
                  id
                  givenName
                  familyName
                }
              }
            }
          }`,
        variables: {
            filter,
        },
    };

    const mockDataUrl = `https://run.mocky.io/v3/28cd39c1-debe-46f5-a35e-e9c1fa07a0c5`;
    const fetchUrl = window.location.href.indexOf(`localhost`) > 0 ? mockDataUrl : endpoint;

    const headers = new Headers();
    headers.append(`Accept`, `application/json`);
    headers.append(`Content-Type`, `application/json`);

    try{
        const response = await fetch(fetchUrl, {
            headers,
            method: `POST`,
            credentials: `include`,
            body: JSON.stringify(graphqlQuery),
        });
        data = await response.json();
    } catch (err) { console.error(`Fail getAttendeesFullNames: ${err}`); }

    return data.data.usersConnection.edges as UserNode[];
};

export async function getAttendeeFullName (userId: string, endpoint: string) {
    let data: any = {};

    const graphqlQuery = {
        query: `query organization($user_id: ID!) {user(user_id: $user_id) {full_name }}`,
        variables: {
            user_id: userId,
        },
    };

    const headers = new Headers();
    headers.append(`Accept`, `application/json`);
    headers.append(`Content-Type`, `application/json`);

    try{
        const response = await fetch(endpoint, {
            headers,
            method: `POST`,
            credentials: `include`,
            body: JSON.stringify(graphqlQuery),
        });
        data = await response.json();
    } catch (err) { console.error(`Fail getUserFullName: ${err}`); }

    return data.data.user.full_name;
}

export function removeKLLH5PStateStorage (){
    const search = `kll-h5p-state`;
    const keys = Object.keys(localStorage)
        .filter((key) => key.startsWith(search) );
    keys.forEach((key) => {
        localStorage.removeItem(key);
    });
}
export const usePrevious = <T,>(value: T): T | undefined => {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

export const changeStatusBarColor = (color: string) => {
    const StatusBar = (window as any).StatusBar;
    StatusBar.backgroundColorByHexString(color);
}
