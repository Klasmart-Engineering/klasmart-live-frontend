import { useCordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import StudyCongrats from "@/assets/img/end_study_congrats.svg";
import StudyLeaveIcon from "@/assets/img/study_leave_icon.svg";
import StudyStartAgainIcon from "@/assets/img/study_start_again_icon.svg";
import RoundButton,
{ Variant } from "@/components/common/roundButton/RoundButton";
import { TEXT_GREY_01 } from "@/config";
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
import {
    Box,
    makeStyles,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import React,
{ useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";
import { useSetRecoilState } from "recoil";

const useStyles = makeStyles((theme) => ({
    text: {
        fontWeight: theme.typography.fontWeightBold as number,
        margin: theme.spacing(2, 0, 4),
        color: TEXT_GREY_01,
    },
    button: {
        borderRadius: theme.spacing(5),
    },
    img: {
        maxHeight: `30vh`,
    },
}));

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

    const classes = useStyles();
    const theme = useTheme();
    const isSmUp = useMediaQuery(theme.breakpoints.up(`sm`));

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
        if (!process.env.IS_CORDOVA_BUILD) return;

        const CLASS_CONTENT_BACK_ID = `classContentBackID`;

        addOnBack?.({
            id: CLASS_CONTENT_BACK_ID,
            onBack: onCloseButtonClick,
        });
    }, []);

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100%"
        >
            <img
                src={StudyCongrats}
                alt="Congratulations"
                width={isSmUp ? 300 : 200}
                className={classes.img}
            />
            <Typography
                variant="h2"
                className={classes.text}
            >
                <FormattedMessage
                    id="study.exit.greatWork"
                    defaultMessage="Great Work!"
                />
            </Typography>
            <Box
                display="flex"
                alignItems="center"
            >
                {!isReview && classType === ClassType.STUDY && (
                    <RoundButton
                        variant={Variant.OUTLINED}
                        title="study.exit.startAgain"
                        icon={StudyStartAgainIcon}
                        onClick={onTryAgainClick}
                    />
                )}
                <RoundButton
                    title="study.exit.leave"
                    icon={StudyLeaveIcon}
                    onClick={onCloseButtonClick}
                />
            </Box>
        </Box>
    );
}
