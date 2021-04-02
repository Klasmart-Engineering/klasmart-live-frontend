import React, { useEffect } from "react";

import { makeStyles, Grid, Theme } from "@material-ui/core";

import HelpIcon from "@material-ui/icons/Help";
import CreateIcon from "@material-ui/icons/Create";
import PhoneInTalkIcon from "@material-ui/icons/PhoneInTalk";
import ChatRoundedIcon from "@material-ui/icons/ChatRounded";
import LibraryBooksRoundedIcon from "@material-ui/icons/LibraryBooksRounded";

import ToolbarItem from "./toolbarItem";
import ToolbarItemCall from "./toolbarItemCall";
import ToolbarItemMicrophone from "./toolbarItemMicrophone";
import ToolbarItemCamera from "./toolbarItemCamera";
import GlobalActionsMenu from "./toolbarMenus/globalActionsMenu";
import CanvasMenu from "./toolbarMenus/canvasMenu";
import ClassDetailsMenu from "./toolbarMenus/classDetailsMenu";

import { useRecoilState } from "recoil";
import {
	activeMicrophoneState,
	activeCameraState,
	isChatOpenState,
	isPinUserOpenState,
	isLessonMaterialOpenState,
	isGlobalActionsOpenState,
	isCanvasOpenState,
	isClassDetailsOpenState,
} from "../../states/layoutAtoms";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		padding: 10,
		justifyContent: "space-between",
	},
	iconGroup: {
		display: "flex",
		alignItems: "center",
	},
}));

function Toolbar() {
	const classes = useStyles();

	const [activeMicrophone, setActiveMicrophone] = useRecoilState(
		activeMicrophoneState
	);
	const [activeCamera, setActiveCamera] = useRecoilState(activeCameraState);

	const [isGlobalActionsOpen, setIsGlobalActionsOpen] = useRecoilState(
		isGlobalActionsOpenState
	);
	const [isLessonMaterialOpen, setIsLessonMaterialOpen] = useRecoilState(
		isLessonMaterialOpenState
	);
	const [isPinUserOpen, setIsPinUserOpen] = useRecoilState(isPinUserOpenState);
	const [isChatOpen, setIsChatOpen] = useRecoilState(isChatOpenState);
	const [isClassDetailsOpen, setIsClassDetailsOpen] = useRecoilState(
		isClassDetailsOpenState
	);
	const [isCanvasOpen, setIsCanvasOpen] = useRecoilState(isCanvasOpenState);

	const [
		globalActionsEl,
		setGlobalActionsEl,
	] = React.useState<HTMLButtonElement | null>(null);
	const [canvasEl, setCanvasEl] = React.useState<HTMLButtonElement | null>(
		null
	);
	const [
		classDetailsEl,
		setClassDetailsEl,
	] = React.useState<HTMLButtonElement | null>(null);

	const resetDrawers = () => {
		setIsGlobalActionsOpen(false);
		setIsLessonMaterialOpen(false);
		setIsPinUserOpen(false);
		setIsChatOpen(false);
		setIsClassDetailsOpen(false);
		setIsCanvasOpen(false);
		setIsGlobalActionsOpen(false);
	};

	return (
		<>
			<Grid container className={classes.root}>
				<Grid item className={classes.iconGroup}>
					<ToolbarItem
						icon={<HelpIcon />}
						label="Class Name"
						active={isClassDetailsOpen}
						onClick={(e) => {
							resetDrawers();
							setClassDetailsEl(e.currentTarget);
							setIsClassDetailsOpen(!isClassDetailsOpen);
						}}
					/>
					<ToolbarItem
						icon={<CreateIcon />}
						label="Canvas"
						active={isCanvasOpen}
						onClick={(e) => {
							resetDrawers();
							setCanvasEl(e.currentTarget);
							setIsCanvasOpen(!isCanvasOpen);
						}}
					/>
				</Grid>
				<Grid item className={classes.iconGroup}>
					<ToolbarItemMicrophone
						active={activeMicrophone}
						onClick={() => setActiveMicrophone(!activeMicrophone)}
					/>
					<ToolbarItemCall locked icon={<PhoneInTalkIcon />} />
					<ToolbarItemCamera
						active={activeCamera}
						onClick={() => setActiveCamera(!activeCamera)}
					/>
				</Grid>
				<Grid item className={classes.iconGroup}>
					<ToolbarItem
						icon={<LibraryBooksRoundedIcon />}
						label="Global actions"
						active={isGlobalActionsOpen}
						onClick={(e) => {
							resetDrawers();
							setGlobalActionsEl(e.currentTarget);
							setIsGlobalActionsOpen(!isGlobalActionsOpen);
						}}
					/>
					<ToolbarItem
						icon={<LibraryBooksRoundedIcon />}
						label="Lesson Material"
						active={isLessonMaterialOpen}
						onClick={() => {
							resetDrawers();
							setIsLessonMaterialOpen(!isLessonMaterialOpen);
						}}
					/>
					<ToolbarItem
						icon={<ChatRoundedIcon />}
						label="Pin User"
						active={isPinUserOpen}
						onClick={() => {
							resetDrawers();
							setIsPinUserOpen(!isPinUserOpen);
						}}
					/>
					<ToolbarItem
						icon={<ChatRoundedIcon />}
						label="Chat"
						active={isChatOpen}
						onClick={() => {
							resetDrawers();
							setIsChatOpen(!isChatOpen);
						}}
					/>
				</Grid>
			</Grid>

			<ClassDetailsMenu anchor={classDetailsEl} />
			<CanvasMenu anchor={canvasEl} />
			<GlobalActionsMenu anchor={globalActionsEl} />
		</>
	);
}

export default Toolbar;
