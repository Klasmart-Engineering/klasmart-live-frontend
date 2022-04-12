import { WBToolbarContainer } from "../classContent/WBToolbar";
import { ClassContent } from "./classContent";
import { useCordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import { usePopupContext } from "@/app/context-provider/popup-context";
import StyledIcon from "@/components/styled/icon";
import { THEME_COLOR_BACKGROUND_PAPER } from "@/config";
import { showEndStudyState } from "@/store/layoutAtoms";
import {
    Box,
    Grid,
    makeStyles,
    Theme,
    useTheme,
} from "@material-ui/core";
import { Close as CloseIcon } from "@styled-icons/material/Close";
import clsx from "clsx";
import React from "react";
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    safeArea: {
        marginLeft: `env(safe-area-inset-left)`,
        marginRight: `env(safe-area-inset-right)`,
    },
    fullHeight: {
        width: `100%`,
        height: `100%`,
    },
}));

function MainStudy () {
    const classes = useStyles();
    const [ showEndStudy, setShowEndStudy ] = useRecoilState(showEndStudyState);
    const history = useHistory();
    const { restart } = useCordovaSystemContext();
    const { showPopup } = usePopupContext();
    const intl = useIntl();
    const theme = useTheme();

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
                if (restart) {
                    restart();
                } else {
                    history.push(`/schedule`);
                }
            },
        });
    };

    return (
        <Grid
            container
            className={clsx(classes.fullHeight, {
                [classes.safeArea]: !process.env.IS_CORDOVA_BUILD,
            })}
        >
            <Grid
                item
                xs
            >
                <Box
                    py={4}
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
                                right={theme.spacing(3.5)}
                            >
                                <WBToolbarContainer useLocalDisplay />
                            </Box>
                            {process.env.IS_CORDOVA_BUILD && (
                                <Box
                                    position="fixed"
                                    top={theme.spacing(4)}
                                    right={theme.spacing(4)}
                                    onClick={onCloseButtonClick}
                                >
                                    <StyledIcon
                                        icon={<CloseIcon />}
                                        size={`xlarge`}
                                        color={THEME_COLOR_BACKGROUND_PAPER}
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Grid>
        </Grid>
    );
}

export default MainStudy;
