import React, { useState } from "react";

import {
	makeStyles,
	useTheme,
	Box,
	Grid,
	Theme,
	Drawer,
} from "@material-ui/core";
import { useRecoilState } from "recoil";
import { isChatOpenState } from "../../../states/layoutAtoms";

function Chat() {
	const [drawerWidth, setDrawerWidth] = useState<Number | String | any>(340);
	const [isChatOpen, setIsChatOpen] = useRecoilState(isChatOpenState);

	const useStyles = makeStyles((theme: Theme) => ({
		drawerPinUser: {
			width: isChatOpen ? drawerWidth : 0,
			flexShrink: 0,
			transition: theme.transitions.create("width", {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.shortest,
			}),

			paddingLeft: theme.spacing(2),
		},
		drawerPaper: {
			width: drawerWidth,
			transition: theme.transitions.create("width", {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.shortest,
			}),
			border: 0,
			backgroundColor: theme.palette.grey[200],
			borderRadius: 12,
		},
		inner: {
			padding: 10,
		},
	}));
	const classes = useStyles();

	return (
		<Drawer
			anchor="right"
			open={isChatOpen}
			classes={{ root: classes.drawerPinUser, paper: classes.drawerPaper }}
			PaperProps={{ style: { position: "absolute" } }}
			BackdropProps={{ style: { position: "absolute" } }}
			ModalProps={{
				container: document.getElementById("main-content"),
				style: { position: "absolute" },
			}}
			variant="persistent"
		>
			<Box className={classes.inner}>Chat, do stuff here </Box>
		</Drawer>
	);
}

export default Chat;
