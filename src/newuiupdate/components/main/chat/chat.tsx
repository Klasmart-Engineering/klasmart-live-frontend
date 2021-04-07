import React, { useState } from "react";

import {
	makeStyles,
	useTheme,
	Box,
	Grid,
	Theme,
	Drawer,
	Tabs, 
	Tab,
	Typography
} from "@material-ui/core";
import { useRecoilState } from "recoil";
import { isChatOpenState } from "../../../states/layoutAtoms";
import Messages from "./messages";
import Attachments from "./attachements";

const useStyles = makeStyles((theme: Theme) => ({
	fullHeight:{
		height: '100%',
	},
	tabsFlexContainer:{
		display: 'block',
		textAlign: 'right'
	},
	title:{
		position: 'absolute',
		fontSize: '1.25rem',
		top: 23,
		fontWeight: 600
	}
}));


function Chat() {
	const [drawerWidth, setDrawerWidth] = useState<Number | String | any>(340);
	const [isChatOpen, setIsChatOpen] = useRecoilState(isChatOpenState);

	const classes = useStyles();

	const [value, setValue] = React.useState(0);

	const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Grid container direction="column" className={classes.fullHeight}>
			<Grid item>
				
			</Grid>
			<Grid item xs>
				<Grid container direction="column" className={classes.fullHeight}>
					<Grid item>
						<Typography className={classes.title}>Class Chat</Typography>
						<Tabs
							value={value}
							onChange={handleChange}
							classes={{flexContainer: classes.tabsFlexContainer}}
						> 
							<Tab label="Messages" disableRipple />
							<Tab label="Attachements" disableRipple />
						</Tabs>
					</Grid>
					<Grid item xs>
						<TabPanel value={value} index={0}>
							<Messages />
						</TabPanel>
						<TabPanel value={value} index={1}>
							<Attachments />
						</TabPanel>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}

export default Chat;


interface TabPanelProps {
	children?: React.ReactNode;
	index: any;
	value: any;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;
	const classes = useStyles();

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			className={classes.fullHeight}
			{...other}
		>
			{value === index && children}
		</div>
	);
}
