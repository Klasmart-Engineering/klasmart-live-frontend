import { ClassContent } from "./classContent";
import { CloseIconButton } from "@/app/components/icons/closeIconButton";
import { useCordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import { usePopupContext } from "@/app/context-provider/popup-context";
import { WBToolbarContainer } from "@/components/classContent/WBToolbar";
import { TEXT_COLOR_SECONDARY_DEFAULT } from "@/config";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import { showEndStudyState } from "@/store/layoutAtoms";
import {
    makeStyles,
    Theme,
} from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    safeArea: {
        marginLeft: `env(safe-area-inset-left)`,
        marginRight: `env(safe-area-inset-right)`,
        height: `100%`,
    },
    closeButton: {
        position: `fixed`,
        top: theme.spacing(1.5),
        right: theme.spacing(2),
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
        <div className={classes.safeArea}>
            <ClassContent />
            {!showEndStudy && <>
                <WBToolbarContainer useLocalDisplay={classType !== ClassType.LIVE} />
                <div className={classes.closeButton}>
                    <CloseIconButton
                        buttonSize="small"
                        color={TEXT_COLOR_SECONDARY_DEFAULT}
                        onClick={onCloseButtonClick} />
                </div>
            </> }
        </div>
    );
}

export default MainClass;
