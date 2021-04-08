import React from "react";

import { makeStyles, Grid, Theme } from "@material-ui/core";

import { TvFill as ScreenShareIcon } from "@styled-icons/bootstrap/TvFill";
import { PencilFill as CanvasIcon } from "@styled-icons/bootstrap/PencilFill";
import { MicFill as MicFillIcon } from "@styled-icons/bootstrap/MicFill";
import { CameraVideoFill as CameraVideoFillIcon } from "@styled-icons/bootstrap/CameraVideoFill";
import { TrophyFill as TrophyFillIcon } from "@styled-icons/bootstrap/TrophyFill";
import { HandThumbsUpFill as HandThumbsUpFillIcon } from "@styled-icons/bootstrap/HandThumbsUpFill";
import { StarFill as StarFillIcon } from "@styled-icons/bootstrap/StarFill";
import { HeartFill as HeartFillIcon } from "@styled-icons/bootstrap/HeartFill";

import { useRecoilState } from "recoil";

import GlobalActionsMenuItem from "./item";

import { StyledPopper } from "../../../utils";

import {
	isActiveGlobalScreenshareState,
	isActiveGlobalCanvasState,
	isActiveGlobalMuteAudioState,
	isActiveGlobalMuteVideoState,
	isGlobalActionsOpenState,
} from "../../../../states/layoutAtoms";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		padding: 4,
	},
}));

interface GlobaActionsMenuProps {
	anchor?: any;
}

function GlobalActionsMenu(props: GlobaActionsMenuProps) {
	const { anchor } = props;
	const classes = useStyles();

	const [isGlobalActionsOpen, setIsGlobalActionsOpen] = useRecoilState(
		isGlobalActionsOpenState
	);

	const [activeGlobalScreenshare, setActiveGlobalScreenshare] = useRecoilState(
		isActiveGlobalScreenshareState
	);
	const [activeGlobalCanvas, setActiveGlobalCanvas] = useRecoilState(
		isActiveGlobalCanvasState
	);
	const [activeGlobalMuteAudio, setActiveGlobalMuteAudio] = useRecoilState(
		isActiveGlobalMuteAudioState
	);
	const [activeGlobalMuteVideo, setActiveGlobalMuteVideo] = useRecoilState(
		isActiveGlobalMuteVideoState
	);

	const items = [
		{
			id: "1",
			title: "Screenshare",
			icon: <ScreenShareIcon size="1.7rem" />,
			variant: 'blue',
			isActive: activeGlobalScreenshare,
			onClick: () => setActiveGlobalScreenshare(!activeGlobalScreenshare),
		},
		{
			id: "3",
			type: "divider",
		},
		{
			id: "4",
			title: "Mute All",
			icon: <MicFillIcon size="1.4rem" />,
			variant: 'blue',
			isActive: activeGlobalMuteAudio,
			onClick: () => setActiveGlobalMuteAudio(!activeGlobalMuteAudio),
		},
		{
			id: "5",
			title: "Hide all cameras",
			icon: <CameraVideoFillIcon size="1.4rem" />,
			variant: 'blue',
			isActive: activeGlobalMuteVideo,
			onClick: () => setActiveGlobalMuteVideo(!activeGlobalMuteVideo),
		},
		{
			id: "6",
			type: "divider",
		},
		{
			id: "7",
			title: "Send trophy",
			icon: <TrophyFillIcon size="1.4rem" />,
		},
		{
			id: "8",
			title: "Send thumbs up",
			icon: <HandThumbsUpFillIcon size="1.4rem" />,
		},
		{
			id: "9",
			title: "Send star",
			icon: <StarFillIcon size="1.4rem" />,
		},
		{
			id: "10",
			title: "Send heart",
			icon: <HeartFillIcon size="1.4rem" />,
			variant: 'red',
		},
	];

	return (
		<StyledPopper open={isGlobalActionsOpen} anchorEl={anchor}>
			<Grid container alignItems="stretch" className={classes.root}>
				{items.map((item) => (
					<GlobalActionsMenuItem
						key={item.id}
						title={item.title}
						icon={item.icon}
						type={item.type}
						variant={item.variant}
						active={item.isActive}
						onClick={item.onClick}
					/>
				))}
			</Grid>
		</StyledPopper>
	);
}

export default GlobalActionsMenu;
