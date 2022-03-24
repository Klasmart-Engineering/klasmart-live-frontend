import { useCordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import StudyLeaveIcon from "@/assets/img/study_leave_icon.svg";
import StudyStartAgainIcon from "@/assets/img/study_start_again_icon.svg";
import RoundButton from "@/components/common/roundButton/RoundButton";
import { useSessionContext } from "@/providers/session-context";
import {
    classEndedState,
    classLeftState,
    materialActiveIndexState,
    showEndStudyState,
} from "@/store/layoutAtoms";
import { Box } from "@material-ui/core";
import React,
{ useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSetRecoilState } from "recoil";

export default function ExitStudy (){

    const HUB_ENDPOINT = process.env.ENDPOINT_HUB;
    const setClassEnded = useSetRecoilState(classLeftState);
    const setClassLeft = useSetRecoilState(classEndedState);
    const { restart } = useCordovaSystemContext();
    const history = useHistory();
    const { addOnBack } = useCordovaSystemContext();
    const setMaterialActiveIndex = useSetRecoilState(materialActiveIndexState);
    const setShowEndStudy = useSetRecoilState(showEndStudyState);
    const { isReview } = useSessionContext();

    const onCloseButtonClick = () => {
        if (process.env.IS_CORDOVA_BUILD) {
            setClassEnded(false);
            setClassLeft(false);

            if (restart) {
                restart();
            } else {
                history.push(`/schedule`);
            }
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
            {!isReview && <RoundButton
                id="study.exit.startAgain"
                alt="start again Icon"
                src={StudyStartAgainIcon}
                onClick={onTryAgainClick}
            />}
            <RoundButton
                id="study.exit.leave"
                alt="study leave Icon"
                src={StudyLeaveIcon}
                onClick={onCloseButtonClick}
            />
        </Box>
    );
}
