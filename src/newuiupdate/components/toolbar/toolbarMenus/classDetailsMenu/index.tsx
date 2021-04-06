import React from "react";

import {
	makeStyles,
	Theme,
	Box,
	Tabs,
	Tab,
} from "@material-ui/core";


import { useRecoilState } from "recoil";
import { isClassDetailsOpenState } from "../../../../states/layoutAtoms";

import { StyledPopper } from "../../../utils";
import ClassDetails from "./classDetails";
import ClassRoster from "./classRoster";

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
		color: theme.palette.grey[600],
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

	const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
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
				<Tab label="Class roster" disableRipple />
			</Tabs>
			<TabPanel value={value} index={0}>
				<ClassDetails />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<ClassRoster />
			</TabPanel>
		</StyledPopper>
	);
}

export default ClassDetailsMenu;

interface TabPanelProps {
	children?: React.ReactNode;
	index: any;
	value: any;
}

function TabPanel(props: TabPanelProps) {
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
