import ViewMode from "./viewMode";
import { InteractiveMode } from "@/pages/utils";
import { interactiveModeState } from "@/store/layoutAtoms";
import { useSnackbar } from "@kl-engineering/kidsloop-px";
import { useScreenshare } from "@kl-engineering/live-state/ui";
import { Theme } from "@mui/material";
import { makeStyles } from '@mui/styles';
import { ScreenShare as ScreenShareIcon } from "@styled-icons/material/ScreenShare";
import React,
{
    RefObject,
    useCallback,
    useState,
} from "react";
import { useIntl } from "react-intl";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({}));

const ALERT_FALLBACK_WIDTH = 411;
const ALERT_VISIBLE_TIME = 1500;

interface AlertProps {
    open: boolean;
    anchorEl: HTMLDivElement | HTMLButtonElement | null;
    title?: React.ReactNode;
    width?: number;
}

interface Props {
}

function ViewModeScreenshare (props: Props) {
    const [ alert, setAlert ] = useState<AlertProps>();
    const [ interactiveMode, setInteractiveMode ] = useRecoilState(interactiveModeState);
    const isDisabledShareScreen = typeof navigator.mediaDevices?.getDisplayMedia !== `function`;
    const intl = useIntl();
    const screenshare = useScreenshare();
    const { enqueueSnackbar } = useSnackbar();

    const stopScreenshare = () => {
        screenshare.setSending.execute(false);
        setInteractiveMode(InteractiveMode.ONSTAGE);
    };

    const onClickScreenshare = (buttonRef: RefObject<HTMLButtonElement>) => {
        if(!isDisabledShareScreen) {
            screenshare.setSending.execute(true)
                .then(() => {
                    setInteractiveMode(InteractiveMode.SCREENSHARE);
                })
                .catch((e: unknown) => {
                    stopScreenshare();
                    let id = `screenShare.error.default`;
                    if( e instanceof Error) {
                        switch(e.name) {
                        case `NotAllowedError`:
                        case `NotReadableError`:
                            id = `screenShare.error.${e.name}`;
                        }
                    }
                    enqueueSnackbar(intl.formatMessage({
                        id,
                    }));
                });
        } else {
            setAlert({
                open: true,
                anchorEl: buttonRef.current ?? null,
                title: intl.formatMessage({
                    id: `live.class.shareScreen.error.notAvailable`,
                }, {
                    strong: (modeName) => <strong>{modeName}</strong>,
                }),
                width: buttonRef.current?.offsetParent?.clientWidth ?? ALERT_FALLBACK_WIDTH,
            });
        }
    };

    const onCloseAlert = useCallback(() => {
        if (!isDisabledShareScreen) return;
        setTimeout(() => {
            setAlert({
                ...alert,
                open: false,
                anchorEl: null,
            });
        }, ALERT_VISIBLE_TIME);
    }, [ alert?.anchorEl ]);

    return (
        <ViewMode
            disableLongPress={!isDisabledShareScreen}
            title={intl.formatMessage({
                id: `viewMode.screenShare`,
            })}
            icon={ScreenShareIcon}
            active={interactiveMode === InteractiveMode.SCREENSHARE}
            disabled={isDisabledShareScreen}
            onCloseAlert={onCloseAlert}
            onClick={onClickScreenshare}
        />
    );
}

export default ViewModeScreenshare;
