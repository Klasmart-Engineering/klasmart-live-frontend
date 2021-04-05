import React, { useEffect } from "react";

import { makeStyles, Grid, Theme } from "@material-ui/core";

import { Info as InfoIcon } from "@styled-icons/evaicons-solid/Info";
import { PencilFill as CanvasIcon } from "@styled-icons/bootstrap/PencilFill";
import { Globe as GlobalActionsIcon } from "@styled-icons/entypo/Globe";
import { FilePaper as LessonPlanIcon } from "@styled-icons/remix-fill/FilePaper";
import { ChevronBottom as ViewModesIcon } from "@styled-icons/open-iconic/ChevronBottom";
import { UserPin as PinUserIcon } from "@styled-icons/boxicons-regular/UserPin";
import { ChatSquareDotsFill as ChatIcon } from "@styled-icons/bootstrap/ChatSquareDotsFill";





// import HelpIcon from "@material-ui/icons/Help";
import CreateIcon from "@material-ui/icons/Create";
import PhoneInTalkIcon from "@material-ui/icons/PhoneInTalk";
import ChatRoundedIcon from "@material-ui/icons/ChatRounded";
import LibraryBooksRoundedIcon from "@material-ui/icons/LibraryBooksRounded";

import ToolbarItem from "./toolbarItem";
import ToolbarItemCall from "./toolbarItemCall";
import ToolbarItemMicrophone from "./toolbarItemMicrophone";
import ToolbarItemCamera from "./toolbarItemCamera";
import GlobalActionsMenu from "./toolbarMenus/globalActionsMenu/index";
import CanvasMenu from "./toolbarMenus/canvasMenu";
import ClassDetailsMenu from "./toolbarMenus/classDetailsMenu";

import { useRecoilState } from "recoil";
import {
	activeMicrophoneState,
	activeCameraState,
	isChatOpenState,
	isPinUserOpenState,
	isLessonPlanOpenState,
	isGlobalActionsOpenState,
	isViewModesOpenState,
	isCanvasOpenState,
	isClassDetailsOpenState,
} from "../../states/layoutAtoms";
import ViewModesMenu from "./toolbarMenus/viewModesMenu";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		padding: 10,
		paddingTop: 0,
		justifyContent: "space-between",
	},
	iconGroup: {
		display: "flex",
		alignItems: "center",
		margin: "0 -4px",
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
	const [isLessonPlanOpen, setIsLessonPlanOpen] = useRecoilState(
		isLessonPlanOpenState
	);
	const [isViewModesOpen, setIsViewModesOpen] = useRecoilState(
		isViewModesOpenState
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
	const [
		viewModesEl,
		setViewModesEl,
	] = React.useState<HTMLButtonElement | null>(null);

	const resetDrawers = () => {
		setIsGlobalActionsOpen(false);
		setIsLessonPlanOpen(false);
		setIsPinUserOpen(false);
		setIsChatOpen(false);
		setIsClassDetailsOpen(false);
		setIsCanvasOpen(false);
		setIsGlobalActionsOpen(false);
		setIsViewModesOpen(false);
	};

	return (
		<>
			<Grid container className={classes.root}>
				<Grid item className={classes.iconGroup}>
					<ToolbarItem
						icon={<InfoIcon />}
						label="Class Name"
						active={isClassDetailsOpen}
						onClick={(e) => {
							resetDrawers();
							setClassDetailsEl(e.currentTarget);
							setIsClassDetailsOpen(!isClassDetailsOpen);
						}}
					/>
					<ToolbarItem
						icon={<CanvasIcon />}
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
						locked
						onClick={() => setActiveCamera(!activeCamera)}
					/>
				</Grid>
				<Grid item className={classes.iconGroup}>
					<ToolbarItem
						icon={<GlobalActionsIcon />}
						label="Global actions"
						active={isGlobalActionsOpen}
						onClick={(e) => {
							resetDrawers();
							setGlobalActionsEl(e.currentTarget);
							setIsGlobalActionsOpen(!isGlobalActionsOpen);
						}}
					/>
					<ToolbarItem
						icon={<LessonPlanIcon />}
						label="Lesson Plan"
						active={isLessonPlanOpen}
						onClick={() => {
							resetDrawers();
							setIsLessonPlanOpen(!isLessonPlanOpen);
						}}
					/>
					<ToolbarItem
						icon={<ViewModesIcon />}
						label="View modes"
						active={isViewModesOpen}
						onClick={(e) => {
							resetDrawers();
							setViewModesEl(e.currentTarget);
							setIsViewModesOpen(!isViewModesOpen);
						}}
					/>
					<ToolbarItem
						icon={<PinUserIcon />}
						label="Pin User"
						active={isPinUserOpen}
						onClick={() => {
							resetDrawers();
							setIsPinUserOpen(!isPinUserOpen);
						}}
					/>
					<ToolbarItem
						icon={<ChatIcon />}
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
			<ViewModesMenu anchor={viewModesEl} />
		</>
	);
}

export default Toolbar;
