import React, { useEffect, useState } from "react";
import { makeStyles, Box, Grid, Drawer, Theme, IconButton, Menu } from "@material-ui/core";

import { useRecoilState } from "recoil";
import { activeTabState, mosaicViewSizeState } from "../../states/layoutAtoms";

import { PeopleOutline as ParticipantsIcon } from "@styled-icons/evaicons-outline/PeopleOutline";
import { Grid as MosaicIcon } from "@styled-icons/bootstrap/Grid";
import { UserSettings as SettingsIcon } from "@styled-icons/remix-line/UserSettings";
import { SmartDisplay as SliderIcon } from "@styled-icons/material-twotone/SmartDisplay";


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
	tabNavMore: {
		margin: '20px 0'
	},
	tabInner: {
		backgroundColor: theme.palette.background.default,
		padding: 10,
	},
	sliderIconButton:{
		color: theme.palette.text.primary,
		boxShadow: '0 2px 6px 0px rgba(0,0,0,0.3)',
		transform: 'scale(0.8)',
	},
	slider:{
		
	}
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
	const [mosaicViewSize, setMosaicViewSize] = useRecoilState(mosaicViewSizeState);
	const [drawerWidth, setDrawerWidth] = useState<any>(440);
	const classes = useStyles();

	const [mosaicGridSettingsEl, setMosaicGridSettingsEl] = useState<null | HTMLElement>(null);
	const handleSliderGridOpen = (event: React.SyntheticEvent<HTMLAnchorElement>) => { console.log('open'); setMosaicGridSettingsEl(event.currentTarget); };
    const handleSliderGridClose = () => { setMosaicGridSettingsEl(null); };

	const [transitionEnded, setTransitionEnded] = useState(false);

	const handleSliderChange = (event:any) => {
        const sliderHelperCalc = Number(event.target.min) + Number(event.target.max);
		setMosaicViewSize(event.target.value / -1 + sliderHelperCalc)
   }

   /*
    useEffect(()=> {
        setTransitionEnded(false); 
        setTimeout(function(){ setTransitionEnded(true) }, 350)
    }, [activeTab]);
*/

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
					<Grid container direction="column" justify="space-between" alignItems="center" className={classes.fullheight}>
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
						<Grid item className={classes.tabNavMore}>

						<Menu
							id="grid-settings-menu"
							anchorEl={mosaicGridSettingsEl}
							getContentAnchorEl={null}
							anchorOrigin={{
								vertical: "top",
								horizontal: "center"
							}}
							transformOrigin={{
								vertical: "bottom",
								horizontal: "center"
							}}
							open={Boolean(mosaicGridSettingsEl)}
							onClose={handleSliderGridClose}
							MenuListProps={{ onPointerLeave: handleSliderGridClose, disablePadding: true }}
						>

							<div className="value-slider">
								<div className="label">Grid size</div>
								<input type="range" min="3" max="8" step="1" value={mosaicViewSize / -1 + 11} className={classes.slider} id="myRange"  onChange={handleSliderChange} />
							</div>
						</Menu>


							<IconButton 
								component="a"
								aria-label="Grid slider button"
								aria-controls="grid-sldier-popover"
								aria-haspopup="true"
								size="small" 
								className={classes.sliderIconButton} 
								onClick={handleSliderGridOpen}
							 >
								<SliderIcon size="1.6rem"/>
							</IconButton>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs className={classes.tabInner}>
					{sidebarTabs.map(
						(sidebarTab) =>
							activeTab == sidebarTab.name && (
								<div key={sidebarTab.id} className={classes.fullheight}>
									{sidebarTab.content}
								</div>
							)
					)}
				</Grid>
			</Grid>
		</Drawer>
	);
}

export default Sidebar;
