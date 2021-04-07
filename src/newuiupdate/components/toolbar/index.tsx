import React from "react";

import { makeStyles, Grid, Theme } from "@material-ui/core";

import { Info as InfoIcon } from "@styled-icons/evaicons-solid/Info";
import { PencilFill as CanvasIcon } from "@styled-icons/bootstrap/PencilFill";
import { Globe as GlobalActionsIcon } from "@styled-icons/entypo/Globe";
import { FilePaper as LessonPlanIcon } from "@styled-icons/remix-fill/FilePaper";
import { ChevronBottom as ViewModesIcon } from "@styled-icons/open-iconic/ChevronBottom";
import { UserPin as PinUserIcon } from "@styled-icons/boxicons-regular/UserPin";
import { ChatSquareDotsFill as ChatIcon } from "@styled-icons/bootstrap/ChatSquareDotsFill";
import { UserVoice as OnStageIcon } from "@styled-icons/boxicons-solid/UserVoice";
import { Eye as ObserveIcon } from "@styled-icons/fa-regular/Eye";
import { PresentationChartBar as PresentIcon } from "@styled-icons/heroicons-solid/PresentationChartBar";
import PhoneInTalkIcon from "@material-ui/icons/PhoneInTalk";

import ToolbarItem from "./toolbarItem";
import ToolbarItemCall from "./toolbarItemCall";
import ToolbarItemMicrophone from "./toolbarItemMicrophone";
import ToolbarItemCamera from "./toolbarItemCamera";
import CanvasMenu from "./toolbarMenus/canvasMenu";
import GlobalActionsMenu from "./toolbarMenus/globalActionsMenu";
import ClassDetailsMenu from "./toolbarMenus/classDetailsMenu/index";
import ViewModesMenu from "./toolbarMenus/viewModesMenu";

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
	viewModeState,
} from "../../states/layoutAtoms";


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
	const [viewMode, setViewModeState] = useRecoilState(viewModeState);

	const [
		globalActionsEl,
		setGlobalActionsEl,
	] = React.useState<any | null>(null);
	const [canvasEl, setCanvasEl] = React.useState<any | null>(
		null
	);
	const [
		classDetailsEl,
		setClassDetailsEl,
	] = React.useState<any | null>(null);
	const [
		viewModesEl,
		setViewModesEl,
	] = React.useState<any | null>(null);

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

	let viewModesBadge = <OnStageIcon />;
	switch (viewMode) {
		case 'onstage':
			viewModesBadge = <OnStageIcon />;
			break;
		case 'observer':
			viewModesBadge = <ObserveIcon />;
			break;
		case 'present':
			viewModesBadge = <PresentIcon />;
			break;
	}

	return (
		<>
			<Grid container className={classes.root}>
				<Grid item className={classes.iconGroup}>
					<ToolbarItem
						icon={<InfoIcon />}
						label="Class Name"
						active={isClassDetailsOpen}
						onClick={(e: Event) => {
							resetDrawers();
							setClassDetailsEl(e.currentTarget);
							setIsClassDetailsOpen(!isClassDetailsOpen);
						}}
					/>
					<ToolbarItem
						icon={<CanvasIcon />}
						label="Canvas"
						active={isCanvasOpen}
						onClick={(e: Event) => {
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
					<ToolbarItemCall 
						locked 
						tooltip="Ask permission to leave the class"
						icon={<PhoneInTalkIcon />} 
					/>
					<ToolbarItemCamera
						active={activeCamera}
						locked
						tooltip="The teacher has disabled your camera"
						onClick={() => setActiveCamera(!activeCamera)}
					/>
				</Grid>
				<Grid item className={classes.iconGroup}>
					<ToolbarItem
						icon={<GlobalActionsIcon />}
						label="Global actions"
						active={isGlobalActionsOpen}
						onClick={(e: Event) => {
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
						badge={viewModesBadge}
						onClick={(e: Event) => {
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
						badge={2}
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
