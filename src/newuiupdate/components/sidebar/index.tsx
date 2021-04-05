import React, { useEffect, useState } from "react";
import { makeStyles, Box, Grid, Drawer, Theme } from "@material-ui/core";

import { useRecoilState } from "recoil";
import { activeTabState } from "../../states/layoutAtoms";

import PeopleIcon from "@material-ui/icons/People";
import ViewComfyIcon from "@material-ui/icons/ViewComfy";
import SettingsIcon from "@material-ui/icons/Settings";

import SidebarMenuItem from "./sidebarMenuItem";

import TabParticipants from "./tabParticipants";
import TabMosaic from "./tabMosaic";
import TabSettings from "./tabSettings";

const useStyles = makeStyles((theme: Theme) => ({
	drawer: {
		flexShrink: 0,
	},
	drawerPaper: {
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.shortest,
		}),
		border: 0,
	},
	tabContainer: {
		height: "100%",
	},
	tabNav: {
		display: "flex",
		flexDirection: "column",
	},
	tabInner: {
		backgroundColor: theme.palette.background.default,
		padding: 10,
	},
}));

const sidebarTabs = [
	{
		id: 1,
		name: "participants",
		icon: <PeopleIcon />,
		content: <TabParticipants />,
	},
	{
		id: 2,
		name: "mosaic",
		icon: <ViewComfyIcon />,
		content: <TabMosaic />,
	},
	{
		id: 3,
		name: "settings",
		icon: <SettingsIcon />,
		content: <TabSettings />,
	},
];

function Sidebar() {
	const [activeTab, setActiveTab] = useRecoilState(activeTabState);
	const [drawerWidth, setDrawerWidth] = useState<any>(340);
	const classes = useStyles();

	useEffect(() => {
		activeTab !== "participants" ? setDrawerWidth("100%") : setDrawerWidth(340);
	}, [activeTab]);

	return (
		<Drawer
			variant="persistent"
			anchor="right"
			open={true}
			classes={{ root: classes.drawer, paper: classes.drawerPaper }}
			style={{ width: drawerWidth }}
			PaperProps={{
				style: {
					width: drawerWidth,
				},
			}}
		>
			<Grid container className={classes.tabContainer}>
				<Grid item className={classes.tabNav}>
					{sidebarTabs.map((sidebarTab) => (
						<SidebarMenuItem
							key={sidebarTab.id}
							name={sidebarTab.name}
							icon={sidebarTab.icon}
							active={activeTab === sidebarTab.name}
						/>
					))}
				</Grid>
				<Grid item xs className={classes.tabInner}>
					{sidebarTabs.map(
						(sidebarTab) =>
							activeTab == sidebarTab.name && (
								<div key={sidebarTab.id}>{sidebarTab.content}</div>
							)
					)}
				</Grid>
			</Grid>
		</Drawer>
	);
}

export default Sidebar;
