import React from "react";

import { Grid, makeStyles, Theme } from "@material-ui/core";

import InboxIcon from '@material-ui/icons/Inbox';

import { Calendar as ScheduleIcon } from "@styled-icons/boxicons-regular/Calendar";
import { Settings2Outline as SettingsIcon } from "@styled-icons/evaicons-outline/Settings2Outline";
import { Tool as ToolbarIcon } from "@styled-icons/feather/Tool";
import { RecordCircleFill as RecordIcon } from "@styled-icons/bootstrap/RecordCircleFill";


import TabSettingsMenu from "./menu";

import { activeSettingsStateTab } from "../../../states/layoutAtoms";
import { useRecoilState } from "recoil";

const settingsTabs = [
    {
        id: 1,
        name: `schedule`,
        label: `Schedule`,
        icon: <ScheduleIcon size="1.5rem" />,
		content: <div>Schedule</div>
    },
    {
        id: 2,
        name: `settings`,
        label: `Settings`,
        icon: <SettingsIcon size="1.5rem" />,
		content: <div>Settings</div>
    },{
        id: 3,
        name: `toolbar`,
        label: `Toolbar`,
        icon: <ToolbarIcon size="1.5rem" />,
		content: <div>Toolbar</div>
    },{
        id: 4,
        name: `record`,
        label: `Record`,
        icon: <RecordIcon size="1.5rem" />,
		content: <div>Record</div>
    }
];


const useStyles = makeStyles((theme: Theme) => ({
    fullheight: {
        height : '100%'
    },
	tabInner:{
		marginLeft: theme.spacing(1)
	}
}));

function TabSettings() {
	const classes = useStyles();
    const [ activeSettingsTab, setActiveSettingsTab ] = useRecoilState(activeSettingsStateTab);
	const activeTabContent = settingsTabs.find(item=> item.name === activeSettingsTab)?.content;

	return (
		<Grid container className={classes.fullheight}>
			<Grid item>
				<TabSettingsMenu menu={settingsTabs} />
			</Grid>
			<Grid item xs className={classes.tabInner}>
				{activeTabContent} 
			</Grid>
		</Grid>
	);
}

export default TabSettings;
