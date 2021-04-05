import React from "react";

import PinUser from "./pinUser/pinUser";
import Chat from "./chat/chat";
import LessonPlan from "./lessonPlan/lessonPlan";
import { useRecoilState } from "recoil";
import {
	isChatOpenState,
	isLessonPlanOpenState,
	isPinUserOpenState,
} from "../../states/layoutAtoms";
import { StyledDrawer } from "../utils";

function MainDrawer() {
	const [isPinUserOpen, setIsPinUserOpen] = useRecoilState(isPinUserOpenState);
	const [isChatOpen, setIsChatOpen] = useRecoilState(isChatOpenState);
	const [isLessonPlanOpen, setIsLessonPlanOpen] = useRecoilState(
		isLessonPlanOpenState
	);

	return (
		<>
			<StyledDrawer active={isPinUserOpen}>
				<PinUser />
			</StyledDrawer>

			<StyledDrawer active={isChatOpen}>
				<Chat />
			</StyledDrawer>

			<StyledDrawer active={isLessonPlanOpen}>
				<LessonPlan />
			</StyledDrawer>
		</>
	);
}

export default MainDrawer;
