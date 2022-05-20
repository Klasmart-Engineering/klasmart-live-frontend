import { useCordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import StudyLeaveIcon from "@/assets/img/study_leave_icon.svg";
import StudyStartAgainIcon from "@/assets/img/study_start_again_icon.svg";
import RoundButton from "@/components/common/roundButton/RoundButton";
import { useEndClassMutation } from "@/data/live/mutations/useEndClassMutation";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import {
    classEndedState,
    classLeftState,
    hasJoinedClassroomState,
    materialActiveIndexState,
    showEndStudyState,
} from "@/store/layoutAtoms";
import { useWebrtcCloseCallback } from "@kl-engineering/live-state/ui";
import { Box } from "@mui/material";
import React,
{ useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSetRecoilState } from "recoil";

export default function ExitStudy (){

    const HUB_ENDPOINT = process.env.ENDPOINT_HUB;
    const setClassEnded = useSetRecoilState(classEndedState);
    const setClassLeft = useSetRecoilState(classLeftState);
    const setMaterialActiveIndex = useSetRecoilState(materialActiveIndexState);
    const setShowEndStudy = useSetRecoilState(showEndStudyState);
    const setHasJoinedClassroom = useSetRecoilState(hasJoinedClassroomState);
    const history = useHistory();
    const { addOnBack } = useCordovaSystemContext();
    const { isReview, classType } = useSessionContext();
    const closeConference = useWebrtcCloseCallback();
    const [ endClass ] = useEndClassMutation();

    const onCloseButtonClick = async () => {
        if(classType === ClassType.CLASSES){
            await Promise.allSettled([ endClass(), closeConference.execute() ]);
        }

        if (process.env.IS_CORDOVA_BUILD) {
            history.goBack();
            setClassEnded(false);
            setClassLeft(false);
            setHasJoinedClassroom(false);
            onTryAgainClick();
        } else {
            window.location.href = `${HUB_ENDPOINT}`;
        }
    };

    const onTryAgainClick = () => {
        setMaterialActiveIndex(0);
        setShowEndStudy(false);
    };

    useEffect(() => {
        const CLASS_CONTENT_BACK_ID = `classContentBackID`;

        addOnBack?.({
            id: CLASS_CONTENT_BACK_ID,
            onBack: onCloseButtonClick,
        });
    }, []);

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="flex-end"
            height="60%"
        >
            {!isReview && classType === ClassType.STUDY && (
                <RoundButton
                    id="study.exit.startAgain"
                    alt="start again Icon"
                    src={StudyStartAgainIcon}
                    onClick={onTryAgainClick}
                />
            )}
            <RoundButton
                id="study.exit.leave"
                alt="study leave Icon"
                src={StudyLeaveIcon}
                onClick={onCloseButtonClick}
            />
        </Box>
    );
}
