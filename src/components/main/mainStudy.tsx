import { WBToolbarContainer } from "../classContent/WBToolbarStudy";
import { ClassContent } from "./classContent";
import { usePopupContext } from "@/app/context-provider/popup-context";
import { BACKGROUND_PROCESS_GREY } from "@/config";
import {
    classEndedState,
    classLeftState,
    hasJoinedClassroomState,
    materialActiveIndexState,
    showEndStudyState,
} from "@/store/layoutAtoms";
import {
    Box,
    Grid,
    IconButton,
    makeStyles,
    Theme,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { Close as CloseIcon } from "@styled-icons/material/Close";
import clsx from "clsx";
import React from "react";
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import {
    useRecoilState,
    useSetRecoilState,
} from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    safeArea: {
        marginLeft: `env(safe-area-inset-left)`,
        marginRight: `env(safe-area-inset-right)`,
    },
    fullHeight: {
        width: `100%`,
        height: `100%`,
    },
    iconButton: {
        position: `fixed`,
        top: theme.spacing(2),
        right: theme.spacing(1),
    },
}));

function MainStudy () {
    const classes = useStyles();
    const [ showEndStudy, setShowEndStudy ] = useRecoilState(showEndStudyState);
    const setClassEnded = useSetRecoilState(classEndedState);
    const setClassLeft = useSetRecoilState(classLeftState);
    const setHasJoinedClassroom = useSetRecoilState(hasJoinedClassroomState);
    const setMaterialActiveIndex = useSetRecoilState(materialActiveIndexState);
    const history = useHistory();
    const { showPopup } = usePopupContext();
    const intl = useIntl();
    const theme = useTheme();
    const isApp = process.env.IS_CORDOVA_BUILD;
    const isMobileWeb = useMediaQuery(theme.breakpoints.down(`xs`)) && !isApp;
    const isMdUp = useMediaQuery(theme.breakpoints.up(`md`));

    const onCloseButtonClick = () => {
        showPopup({
            variant: `info`,
            title: intl.formatMessage({
                id: `study.exit.title`,
                defaultMessage: `Are you sure you want to exit?`,
            }),
            description: [
                intl.formatMessage({
                    id: `study.exit.body`,
                    defaultMessage: `Your progress will not be saved.`,
                }),
            ],
            closeLabel: intl.formatMessage({
                id: `common_ok`,
                defaultMessage: `OK`,
            }),
            showCloseIcon: true,
            onClose: () => {
                history.goBack();
                setClassEnded(false);
                setClassLeft(false);
                setHasJoinedClassroom(false);
                setMaterialActiveIndex(0);
                setShowEndStudy(false);
            },
        });
    };

    return (
        <Grid
            container
            className={clsx(classes.fullHeight, {
                [classes.safeArea]: !isApp,
            })}
        >
            <Grid
                item
                xs
            >
                <Box
                    py={!isMobileWeb && 4}
                    display="flex"
                    flexDirection="column"
                    height="100%"
                    boxSizing="border-box"
                >
                    <ClassContent />
                    {!showEndStudy && (
                        <>
                            <Box
                                position="fixed"
                                bottom={theme.spacing(4)}
                                left={theme.spacing(3.5)}
                            >
                                <WBToolbarContainer />
                            </Box>
                            {isApp && (
                                <IconButton
                                    className={classes.iconButton}
                                    onClick={onCloseButtonClick}
                                >
                                    <CloseIcon
                                        size={isMdUp ? `34` : `20`}
                                        color={BACKGROUND_PROCESS_GREY}
                                    />
                                </IconButton>
                            )}
                        </>
                    )}
                </Box>
            </Grid>
        </Grid>
    );
}

export default MainStudy;
