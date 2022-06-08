import MosaicSlider from "./mosaicSlider";
import SidebarMenuItem from "./sidebarMenuItem";
import TabMosaic from "./tabMosaic/tabMosaic";
import TabParticipants from "./tabParticipants/tabParticipants";
import { useDeviceOrientationValue } from "@/app/model/appModel";
import { CLASS_DRAWER_ZINDEX } from "@/config";
import { useSessionContext } from "@/providers/session-context";
import { activeTabState } from "@/store/layoutAtoms";
import { NoItemList } from "@/utils/utils";
import {
    Box,
    Drawer,
    Grid,
    makeStyles,
    Theme,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { Grid as MosaicIcon } from "@styled-icons/bootstrap/Grid";
import { PeopleOutline as ParticipantsIcon } from "@styled-icons/evaicons-outline/PeopleOutline";
import { UserTimes as PreviewIcon } from "@styled-icons/fa-solid/UserTimes";
import clsx from "clsx";
import React from "react";
import { useIntl } from "react-intl";
import { useRecoilValue } from "recoil";

export const SMALL_DRAWER_WIDTH = 240;
export const LARGE_DRAWER_WIDTH = 440;
export const SMALL_DRAWER_WIDTH_ST = 190;
export const LARGE_DRAWER_WIDTH_ST = 390;
export const FULL_DRAWER_WIDTH = `100%`;

const useStyles = makeStyles((theme: Theme) => ({
    drawer: {
        flexBasis: LARGE_DRAWER_WIDTH,
        [theme.breakpoints.down(`sm`)]: {
            flexBasis: SMALL_DRAWER_WIDTH,
        },
    },
    drawerStudent: {
        flexBasis: LARGE_DRAWER_WIDTH_ST,
        [theme.breakpoints.down(`sm`)]: {
            flexBasis: SMALL_DRAWER_WIDTH_ST,
        },
    },
    drawerPaper: {
        border: 0,
        width: LARGE_DRAWER_WIDTH,
        [theme.breakpoints.down(`sm`)]: {
            width: SMALL_DRAWER_WIDTH,
        },
    },
    drawerPaperStudent: {
        border: 0,
        width: LARGE_DRAWER_WIDTH_ST,
        [theme.breakpoints.down(`sm`)]: {
            width: SMALL_DRAWER_WIDTH_ST,
        },
    },
    drawerPaperFull: {
        width: FULL_DRAWER_WIDTH,
    },
    fullheight: {
        height: `100%`,
        flexWrap: `nowrap`,
    },
    tabInner: {
        backgroundColor: theme.palette.background.default,
        padding: 10,
        overflowY: `hidden`,
        [theme.breakpoints.down(`xs`)]: {
            flexBasis: `300px`,
        },
    },
    tabInnerSafeArea:{
        paddingRight: `env(safe-area-inset-right)`, // iPhone Notch
    },
    sliderIconButton:{
        color: theme.palette.text.primary,
        boxShadow: `0 2px 6px 0px rgba(0,0,0,0.3)`,
        transform: `scale(0.8)`,
    },
    slider:{
        minHeight: 150,
        margin: `10px 3px`,
    },
}));

function Sidebar () {
    const classes = useStyles();
    const intl = useIntl();

    const activeTab = useRecoilValue(activeTabState);
    const deviceOrientation = useDeviceOrientationValue();
    const { isTeacher, type } = useSessionContext();

    const theme = useTheme();
    const isXsDown = useMediaQuery(theme.breakpoints.down(`xs`));

    const sidebarTabs = type === `preview` ? [
        {
            id: 1,
            name: `participants`,
            label: intl.formatMessage({
                id: `title_participants`,
            }),
            icon: <ParticipantsIcon />,
            content: (
                <NoItemList
                    icon={<PreviewIcon />}
                    text={intl.formatMessage({
                        id: `preview_guide_text_3`,
                    })}
                />
            ),
        },
    ] : [
        {
            id: 1,
            name: `participants`,
            label: intl.formatMessage({
                id: `title_participants`,
            }),
            icon: <ParticipantsIcon />,
            content: <TabParticipants />,
        },
        {
            id: 2,
            name: `mosaic`,
            label: intl.formatMessage({
                id: `title_mosaic`,
            }),
            icon: <MosaicIcon />,
            content: <TabMosaic />,
            role: `teacher`,
        },
    ];

    const activeTabContent = sidebarTabs.find(item => item.name === activeTab)?.content;

    if (isXsDown) return (
        <div className={classes.tabInner}>
            {sidebarTabs[0].content}
        </div>
    );

    return (
        <Drawer
            open
            variant={activeTab === `participants` ? `persistent` : `temporary`}
            anchor="right"
            style={{
                zIndex: CLASS_DRAWER_ZINDEX,
            }}
            classes={{
                root: clsx(classes.drawer, {
                    [classes.drawerStudent]: !isTeacher,
                }),
                paper: clsx(classes.drawerPaper, {
                    [classes.drawerPaperFull]: activeTab !== `participants`,
                    [classes.drawerPaperStudent]: !isTeacher,
                }),
            }}
            transitionDuration={0}
        >
            <Grid
                container
                className={classes.fullheight}
            >
                {isTeacher && (
                    <Grid item>
                        <Grid
                            container
                            direction="column"
                            justifyContent="space-between"
                            alignItems="center"
                            className={classes.fullheight}
                        >
                            <Grid item>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    overflow="hidden"
                                    paddingBottom={2}
                                >
                                    {sidebarTabs.map((sidebarTab) => {
                                        const permission = sidebarTab.role === undefined || (sidebarTab.role === `teacher` && isTeacher);
                                        if(!permission) return;
                                        return (
                                            <SidebarMenuItem
                                                key={sidebarTab.id}
                                                name={sidebarTab.name}
                                                label={sidebarTab.label}
                                                icon={sidebarTab.icon}
                                                active={activeTab === sidebarTab.name}
                                            />
                                        );
                                    })}
                                </Box>
                            </Grid>
                            {activeTab === `mosaic` && (
                                <Grid item>
                                    <Box py={3}>
                                        <MosaicSlider />
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                )}
                <Grid
                    item
                    xs
                    className={clsx(classes.tabInner, {
                        [classes.tabInnerSafeArea] : deviceOrientation === `landscape-secondary`,
                    })}
                >
                    {activeTabContent}
                </Grid>
            </Grid>
        </Drawer>
    );
}

export default Sidebar;
