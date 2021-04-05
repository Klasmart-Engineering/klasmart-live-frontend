import React from "react";

import {
	makeStyles,
	Theme,
	Paper,
	Box,
	Typography,
	Tabs,
	Tab,
} from "@material-ui/core";


import { useRecoilState } from "recoil";
import { isClassDetailsOpenState } from "../../../states/layoutAtoms";

import { StyledPopper } from "../../utils";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		padding: 10,
		justifyContent: "space-between",
	},
	iconGroup: {
		display: "flex",
		alignItems: "center",
	}, 
	detailsLabel:{
		color: theme.palette.text.primary,
		paddingRight: 30,
		paddingBottom: 10,
	}, 
	detailsValue:{
		color: theme.palette.grey[500],
		paddingBottom: 10,
	}
}));

interface GlobaActionsMenuProps {
	anchor?: any;
}

function ClassDetailsMenu(props: GlobaActionsMenuProps) {
	const { anchor } = props;
	const classes = useStyles();

	const [isClassDetailsOpen, setIsClassDetailsOpen] = useRecoilState(
		isClassDetailsOpenState
	);

	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<StyledPopper open={isClassDetailsOpen} anchorEl={anchor}>
			<Tabs
				value={value}
				onChange={handleChange}
				aria-label="simple tabs example"
			>
				<Tab label="Class details" disableRipple />
				<Tab label="Item Two" disableRipple />
			</Tabs>
			<TabPanel value={value} index={0}>
				<table>
					<tr>
						<td className={classes.detailsLabel}><Typography>Class Name</Typography></td>
						<td className={classes.detailsValue}><Typography>Class Name</Typography></td>
					</tr>
					<tr>
					<td className={classes.detailsLabel}><Typography>Lesson Name</Typography></td>
						<td className={classes.detailsValue}><Typography>Animals</Typography></td>
					</tr>
					<tr>
					<td className={classes.detailsLabel}><Typography>Room ID</Typography></td>
						<td className={classes.detailsValue}><Typography>AD01</Typography></td>
					</tr>
				</table>
			</TabPanel>
			<TabPanel value={value} index={1}>
				Item Two
			</TabPanel>
		</StyledPopper>
	);
}

export default ClassDetailsMenu;

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					{children}
				</Box>
			)}
		</div>
	);
}
