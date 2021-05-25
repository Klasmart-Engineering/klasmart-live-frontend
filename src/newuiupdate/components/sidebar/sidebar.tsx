import { LocalSessionContext } from "../../providers/providers";
import { activeTabState } from "../../states/layoutAtoms";
import MosaicSlider from "./mosaicSlider";
import SidebarMenuItem from "./sidebarMenuItem";
import TabMosaic from "./tabMosaic/tabMosaic";
import TabParticipants from "./tabParticipants/tabParticipants";
import TabSettings from "./tabSettings/tabSettings";
import {
    Drawer,
    Grid,
    makeStyles,
    Theme,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { Grid as MosaicIcon } from "@styled-icons/bootstrap/Grid";
import { PeopleOutline as ParticipantsIcon } from "@styled-icons/evaicons-outline/PeopleOutline";
import { UserSettings as SettingsIcon } from "@styled-icons/remix-line/UserSettings";
import React,
{
    useContext,
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    drawer: {
        flexShrink: 0,
    },
    drawerPaper: {
        transition: theme.transitions.create(`width`, {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shortest,
        }),
        border: 0,
    },
    fullheight: {
        height: `100%`,
    },
    tabNav: {
        display: `flex`,
        flexDirection: `column`,
        overflow: `hidden`,
        paddingBottom: 20,
    },
    tabNavMore: {
        margin: `20px 0`,
    },
    tabInner: {
        backgroundColor: theme.palette.background.default,
        padding: 10,
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

    const [ activeTab, setActiveTab ] = useRecoilState(activeTabState);
    const { isTeacher } = useContext(LocalSessionContext);
    const [ drawerWidth, setDrawerWidth ] = useState<any>(440);

    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));

    const sidebarTabs = [
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
        {
            id: 3,
            name: `settings`,
            label: intl.formatMessage({
                id: `title_settings`,
            }),
            icon: <SettingsIcon />,
            content: <TabSettings />,
        },
    ];

    const activeTabContent = sidebarTabs.find(item => item.name === activeTab)?.content;

    useEffect(() => {
        activeTab !== `participants` ? setDrawerWidth(`100%`) : setDrawerWidth(440);
    }, [ activeTab ]);

    useEffect(()=>{
        setTimeout(function (){
            window.dispatchEvent(new Event(`resize`));
        }, 1000);
    }, [ isSmDown ]);

    if(isSmDown){
        return(sidebarTabs[0].content);
    }

    return (
        <Drawer
            variant="persistent"
            anchor="right"
            open={true}
            classes={{
                root: classes.drawer,
                paper: classes.drawerPaper,
            }}
            style={{
                width: drawerWidth,
            }}
            transitionDuration={0}
            PaperProps={{
                style: {
                    width: drawerWidth,
                },
            }}
        >
            <Grid
                container
                className={classes.fullheight}>
                <Grid
                    item
                    className={classes.tabNav}>
                    <Grid
                        container
                        direction="column"
                        justify="space-between"
                        alignItems="center"
                        className={classes.fullheight}>
                        <Grid
                            item
                            className={classes.tabNav}>
                            {sidebarTabs.map((sidebarTab) => {
                                const permission = sidebarTab.role === undefined || (sidebarTab.role === `teacher` && isTeacher);
                                if(permission){
                                    return (
                                        <SidebarMenuItem
                                            key={sidebarTab.id}
                                            name={sidebarTab.name}
                                            label={sidebarTab.label}
                                            icon={sidebarTab.icon}
                                            active={activeTab === sidebarTab.name}
                                        />
                                    );
                                }
                            })}
                        </Grid>
                        {activeTab === `mosaic` &&
                        <Grid
                            item
                            className={classes.tabNavMore}>
                            <MosaicSlider />
                        </Grid>
                        }
                    </Grid>
                </Grid>
                <Grid
                    item
                    xs
                    className={classes.tabInner}>
                    {activeTabContent}
                </Grid>
            </Grid>
        </Drawer>
    );
}

export default Sidebar;
