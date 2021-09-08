import {
    activeSettingsStateTab,
    activeTabState,
} from "@/store/layoutAtoms";
import Settings from "./settings/settings";
import TabSettingsMenu from "./tabSettingsMenu";
import {
    Fade,
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import { Settings2Outline as SettingsIcon } from "@styled-icons/evaicons-outline/Settings2Outline";
import React,
{ useEffect } from "react";
import { useIntl } from "react-intl";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    fullheight: {
        height : `100%`,
    },
    tabContainer:{
        marginLeft: theme.spacing(1),
    },
    tabPaper:{
        height : `100%`,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 12,
    },
    tabInner:{
        padding: theme.spacing(2),
    },
}));

function TabSettings () {
    const classes = useStyles();
    const intl = useIntl();

    const [ activeTab, setActiveTab ] = useRecoilState(activeTabState);
    const [ activeSettingsTab, setActiveSettingsTab ] = useRecoilState(activeSettingsStateTab);

    const settingsTabs = [
        {
            id: 1,
            name: `settings`,
            label: intl.formatMessage({
                id: `settings_menu_settings`,
            }),
            icon: <SettingsIcon size="1.5rem" />,
            content: <Settings />,
            disabled : false,
        },
        /*
        {
            id: 2,
            name: `schedule`,
            label: intl.formatMessage({
                id: `settings_menu_schedule`,
            }),
            icon: <ScheduleIcon size="1.5rem" />,
            content: <div>Schedule</div>,
            disabled : true,
            tooltip : intl.formatMessage({
                id: `common_feature_not_available`,
            }),
        },
        {
            id: 3,
            name: `toolbar`,
            label: intl.formatMessage({
                id: `settings_menu_toolbar`,
            }),
            icon: <ToolbarIcon size="1.5rem" />,
            content: <div>Toolbar</div>,
            disabled : true,
            tooltip : intl.formatMessage({
                id: `common_feature_not_available`,
            }),
        },
        {
            id: 4,
            name: `record`,
            label: intl.formatMessage({
                id: `settings_menu_record`,
            }),
            icon: <RecordIcon size="1.5rem" />,
            content: <div>Record</div>,
            disabled : true,
            tooltip : intl.formatMessage({
                id: `common_feature_not_available`,
            }),
        },*/
    ];

    const activeTabContent = settingsTabs.find(item=> item.name === activeSettingsTab)?.content;

    useEffect(() => {
        const listener = (event:any) => {
            if (event.code === `27` || event.code === `Escape`) {
                setActiveTab(`participants`);
            }
        };
        window.addEventListener(`keydown`, listener);
        return () => window.removeEventListener(`keydown`, listener);
    }, []);

    return (
        <Fade in>
            <Grid
                container
                className={classes.fullheight}>
                <Grid item>
                    <TabSettingsMenu menu={settingsTabs} />
                </Grid>
                <Grid
                    item
                    xs
                    className={classes.tabContainer}>
                    {activeTabContent}
                </Grid>
            </Grid>
        </Fade>
    );
}

export default TabSettings;
