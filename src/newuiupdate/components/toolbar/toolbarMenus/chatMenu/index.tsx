import React from "react";

import { makeStyles,  Theme, Grid  } from "@material-ui/core";

import { Pencil as PencilIcon } from "@styled-icons/entypo/Pencil";
import { Eraser as EraserIcon } from "@styled-icons/boxicons-solid/Eraser";
import { PeopleCommunity as PeopleCommunityIcon } from "@styled-icons/fluentui-system-filled/PeopleCommunity";

import { useRecoilState } from "recoil";
import { isChatOpenState } from "../../../../states/layoutAtoms";

import { StyledPopper } from "../../../utils";

import clsx from "clsx";
import Chat from "../../../main/chat/chat";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		padding: 4,
	},
	item:{
		padding: "8px 16px",
		margin: "0 4px",
		cursor: "pointer",
		borderRadius: 10,
		transition: "100ms all ease-in-out",
		"&:hover": {
			backgroundColor: theme.palette.grey[200],
		},
	},
	itemClear:{},
	itemToggleCanvas:{}
}));


interface ChatMenuProps {
	anchor?: any;
}

function ChatMenu(props: ChatMenuProps) {
	const { anchor } = props;
	const classes = useStyles();

	const [isChatOpen, setIsChatOpen] = useRecoilState(isChatOpenState);
	
	return (
		<StyledPopper open={isChatOpen} anchorEl={anchor}>
			<Grid container alignItems="stretch" className={classes.root}>
				<Grid item xs>
					<Chat />
				</Grid>
			</Grid>
		</StyledPopper>
	);
}

export default ChatMenu;
