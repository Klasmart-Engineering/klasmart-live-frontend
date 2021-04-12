import React, { useEffect, useState } from "react";
import { makeStyles, Box, Grid, Drawer, Theme } from "@material-ui/core";

import { useRecoilState } from "recoil";
import { activeTabState } from "../../states/layoutAtoms";

import { PeopleOutline as ParticipantsIcon } from "@styled-icons/evaicons-outline/PeopleOutline";
import { Grid as MosaicIcon } from "@styled-icons/bootstrap/Grid";
import { UserSettings as SettingsIcon } from "@styled-icons/remix-line/UserSettings";

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
	fullheight: {
		height: "100%",
	},
	tabNav: {
		display: "flex",
		flexDirection: "column",
		overflow: 'hidden'
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
		icon: <ParticipantsIcon />,
		content: <TabParticipants />,
	},
	{
		id: 2,
		name: "mosaic",
		icon: <MosaicIcon />,
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
	const [drawerWidth, setDrawerWidth] = useState<any>(440);
	const classes = useStyles();

	const [transitionEnded, setTransitionEnded] = useState(false);
    useEffect(()=> {
        setTransitionEnded(false); 
        setTimeout(function(){ setTransitionEnded(true) }, 350)
    }, [activeTab]);


	useEffect(() => {
		activeTab !== "participants" ? setDrawerWidth("100%") : setDrawerWidth(440);
	}, [activeTab]);

	return (
		<Drawer
			variant="persistent"
			anchor="right"
			open={true}
			classes={{ root: classes.drawer, paper: classes.drawerPaper }}
			style={{ width: drawerWidth }}
			transitionDuration={0}
			PaperProps={{
				style: {
					width: drawerWidth,
				},
			}}
		>
			<Grid container className={classes.fullheight}>
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
								<div key={sidebarTab.id} className={classes.fullheight}>
									{transitionEnded && sidebarTab.content}
								</div>
							)
					)}
				</Grid>
			</Grid>
		</Drawer>
	);
}

export default Sidebar;
