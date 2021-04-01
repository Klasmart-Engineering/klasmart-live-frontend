import React from "react";
import { makeStyles, Button, Theme } from "@material-ui/core";
import clsx from "clsx";

import { useRecoilState} from 'recoil';
import { activeTabState } from "../../states/layoutAtoms"

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		padding: "14px 0",
		border: 0,
		// borderRadius: "10px 0 0 10px",
		color: theme.palette.grey[500],
	},
	active: {
		backgroundColor: "#d4e1ff",
		color: "#000",
	},
}));

interface SidebarItemMenuProps {
	icon?: any;
	name?: string;
	active?: boolean;
}

function SidebarMenuItem(props: SidebarItemMenuProps) {
	const classes = useStyles();
	const { name, icon, active } = props;
	const [activeTab, setActiveTab] = useRecoilState(activeTabState);
	
	const handleChangeTab = (e) => {
		setActiveTab(e)
	};

	return (
		<Button
			className={clsx(classes.root, active && classes.active)}
			onClick={(e) => handleChangeTab(name)}
		>
			{icon}
		</Button>
	);
}

export default SidebarMenuItem;
