import React, { useContext, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createStyles, makeStyles, useTheme, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";

import { People as PeopleIcon } from "@styled-icons/material-twotone/People";
import { LibraryBooks as LessonPlanIcon } from "@styled-icons/material-twotone/LibraryBooks";
import { Forum as ChatIcon } from "@styled-icons/material-twotone/Forum";
import { Settings as SettingsIcon } from "@styled-icons/material-twotone/Settings";

import { TabPanel } from "./tabpanel";
import { LessonMaterial } from "../../lessonMaterialContext";
import StyledTab from "../styled/tab";
import { InteractiveModeState } from "../../pages/room/room";
import { State } from "../../store/store";
import { ClassType } from "../../store/actions";
import { setDrawerWidth, setDrawerOpen } from "../../store/reducers/control";
import { LocalSession } from "../../entry";

export const DRAWER_TOOLBAR_WIDTH = 64;

enum UserType {
    TeacherOnly = 0,
    StudentOnly = 1,
    Both = 2
}

const TABS = [
    { icon: <PeopleIcon role="img" size="1.5rem" />, title: "title_participants", userType: UserType.Both, cType: ClassType.LIVE },
    { icon: <LessonPlanIcon role="img" size="1.5rem" />, title: "title_lesson_plan", userType: UserType.TeacherOnly, cType: ClassType.CLASSES },
    { icon: <ChatIcon role="img" size="1.5rem" />, title: "title_chat", userType: UserType.Both, cType: ClassType.LIVE },
    { icon: <SettingsIcon role="img" size="1.5rem" />, title: "title_settings", userType: UserType.TeacherOnly, cType: ClassType.CLASSES },
];

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        tabIndicator: {
            backgroundColor: "#0E78D5",
            width: "0.25rem",
            borderRadius: "0.25rem 0 0 0.25rem",
            [theme.breakpoints.down("sm")]: {
                borderRadius: "0.25rem 0.25rem 0 0",
                height: "0.25rem",
            },
        },
        tabSelected: {
            color: "#0E78D5",
            opacity: 1,
        },
        tabs: {
            height: "100%",
        },
    }),
);

export function DrawerContainer({ interactiveModeState, streamId, material, tabIndex, setTabIndex, setMaterialKey }: {
    interactiveModeState: InteractiveModeState,
    streamId: string | undefined,
    material: LessonMaterial | undefined,
    tabIndex: number,
    setTabIndex: React.Dispatch<React.SetStateAction<number>>,
    setMaterialKey: React.Dispatch<React.SetStateAction<number>>,
}) {
    const dispatch = useDispatch();
    const drawerOpen = useSelector((state: State) => state.control.drawerOpen);

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!ref || !ref.current) { return; }
        dispatch(setDrawerWidth(ref.current.offsetWidth));
    }, [ref.current]);

    return (
        <Grid id="drawer-container" ref={ref} item xs={drawerOpen ? 3 : undefined} style={{ position: "relative" }}>
            {TABS.filter((t) => t.cType === ClassType.CLASSES).map((tab, index) => <TabPanel key={`tab-panel-${tab.title}`} index={index} tab={tab} value={tabIndex} />)}
            <DrawerToolbar interactiveModeState={interactiveModeState} streamId={streamId} material={material} tabIndex={tabIndex} setTabIndex={setTabIndex} setMaterialKey={setMaterialKey} />
        </Grid>
    )
}

function DrawerToolbar({ interactiveModeState, streamId, material, tabIndex, setTabIndex, setMaterialKey }: {
    interactiveModeState: InteractiveModeState,
    streamId: string | undefined,
    material: LessonMaterial | undefined,
    tabIndex: number,
    setTabIndex: React.Dispatch<React.SetStateAction<number>>,
    setMaterialKey: React.Dispatch<React.SetStateAction<number>>,
}) {
    const { classtype, isTeacher } = useContext(LocalSession);
    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch();

    const handleTabIndexChange = (event: React.ChangeEvent<unknown>, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <Grid
            id="drawer-toolbar"
            container
            direction="column"
            justify="space-between"
            style={{
                position: "absolute",
                top: 0,
                left: -DRAWER_TOOLBAR_WIDTH,
                width: DRAWER_TOOLBAR_WIDTH,
                height: "100%",
                backgroundColor: theme.palette.background.paper,
                borderLeft: `1px solid ${theme.palette.divider}`,
                borderRight: `1px solid ${theme.palette.divider}`,
            }}
        >
            <Grid item>
                <Tabs
                    aria-label="drawer vertical tabs"
                    orientation="vertical"
                    value={tabIndex}
                    onChange={handleTabIndexChange}
                    className={classes.tabs}
                    classes={{
                        indicator: classes.tabIndicator
                    }}
                >
                    {classtype === ClassType.CLASSES ? (
                        TABS.filter((t) => t.cType === ClassType.CLASSES).map((tab, index) => <StyledTab key={`tab-button-${tab.title}`} className={index === tabIndex ? classes.tabSelected : ""} title={tab.title} handlers={{ setDrawerOpen: (open: boolean) => dispatch(setDrawerOpen(open)), setTabIndex }} value={index}>{tab.icon}</StyledTab>)
                    ) : isTeacher ?
                            TABS.filter((t) => t.userType !== 1).map((tab, index) => <StyledTab key={`tab-button-${tab.title}`} className={index === tabIndex ? classes.tabSelected : ""} title={tab.title} handlers={{ setDrawerOpen: (open: boolean) => dispatch(setDrawerOpen(open)), setTabIndex }} value={index}>{tab.icon}</StyledTab>) :
                            TABS.filter((t) => t.userType !== 0).map((tab, index) => <StyledTab key={`tab-button-${tab.title}`} className={index === tabIndex ? classes.tabSelected : ""} title={tab.title} handlers={{ setDrawerOpen: (open: boolean) => dispatch(setDrawerOpen(open)), setTabIndex }} value={index}>{tab.icon}</StyledTab>)
                    }
                </Tabs>
            </Grid>
        </Grid>
    )
}
