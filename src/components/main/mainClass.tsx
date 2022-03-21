import { ClassContent } from "./classContent";
import { CloseIconButton } from "@/app/components/icons/closeIconButton";
import { useCordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import { usePopupContext } from "@/app/context-provider/popup-context";
import { WBToolbarContainer } from "@/components/classContent/WBToolbar";
import StyledIcon from "@/components/styled/icon";
import {
    TEXT_COLOR_SECONDARY_DEFAULT,
    THEME_COLOR_BACKGROUND_PAPER,
} from "@/config";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import { showEndStudyState } from "@/store/layoutAtoms";
import {
    makeStyles,
    Theme,
} from "@material-ui/core";
import { Close as CloseIcon } from "@styled-icons/material/Close";
import clsx from "clsx";
import React, { useEffect } from "react";
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
    closeButton: {
        position: `fixed`,
        top: theme.spacing(1.5),
        right: theme.spacing(3),
    },
}));

function MainClass () {
    const classes = useStyles();
    const { classType } = useSessionContext();
    const [ showEndStudy, setShowEndStudy ] = useRecoilState(showEndStudyState);
    const history = useHistory();
    const { restart } = useCordovaSystemContext();
    const { showPopup } = usePopupContext();
    const intl = useIntl();

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
        <div className={clsx(classes.fullHeight, {
            [classes.safeArea]: !process.env.IS_CORDOVA_BUILD,
        })}>
            <ClassContent />
            {!showEndStudy && <>
                <WBToolbarContainer useLocalDisplay={classType !== ClassType.LIVE} />
                {
                    classType === ClassType.STUDY && process.env.IS_CORDOVA_BUILD && <div
                        className={classes.closeButton}
                        onClick={onCloseButtonClick}>
                        <StyledIcon
                            icon={<CloseIcon />}
                            size={`xlarge`}
                            color={THEME_COLOR_BACKGROUND_PAPER} />
                    </div>
                }
            </> }
        </div>
    );
}

export default MainClass;
