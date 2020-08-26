
import React, { useContext, useState } from "react";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createStyles, makeStyles, withStyles, Theme, useTheme } from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";
import { ScreenShareContext } from "./screenShareProvider";
import { webRTCContext } from "../../webRTCState";
import { InteractiveModeState } from "../../room";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";

import { Preview as ViewIcon } from "@styled-icons/material/Preview";
import { HelpOutline as HelpIcon } from "@styled-icons/material/HelpOutline";
import { PresentToAll as PresentIcon } from "@styled-icons/material/PresentToAll";
import { Videocam as VideoIcon } from "@styled-icons/material/Videocam";
import { ScreenShare as ScreenShareIcon } from "@styled-icons/material/ScreenShare";
import { StopScreenShare as StopScreenShareIcon } from "@styled-icons/material/StopScreenShare";
import { Refresh as RefreshIcon } from "@styled-icons/material/Refresh";

const StyledToggleButtonGroup = withStyles((theme) => ({
    grouped: {
        [theme.breakpoints.down("sm")]: {
            marginRight: theme.spacing(2),
        },
        margin: theme.spacing(0.5),
        border: "none",
        "&:not(:first-child)": {
            borderRadius: 12,
        },
        "&:first-child": {
            borderRadius: 12,
            borderTop: "none",
        },
    }
}))(ToggleButtonGroup);

const StyledTooltip = withStyles((theme) => ({
    popper: {
        [theme.breakpoints.down("sm")]: {
            // TODO: Vertical Tooltip
            // transformOrigin: "-50% 0%",
            // transform: "rotate(-90deg)",
            maxWidth: 56,
            textAlign: "center"
        }
    }
}))(Tooltip);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        divider: {
            height: 1,
            marginTop: theme.spacing(2),
        },
        buttonRoot: {
            "&:hover": {
                "transform": "translateX(-2px)",
            },
        },
        selectedButton: {
            color: theme.palette.type === "light" ? "white !important" : "#030D1C !important",
            backgroundColor: theme.palette.type === "light" ? "#0E78D5 !important" : "white !important",
        },
        screenSharingButton: {
            color: "white !important",
            backgroundColor: "#f50057 !important",
        },
        buttonGroup: {
            backgroundColor: theme.palette.type === "light" ? "#e6f3ff" : "#2a78d5",
            margin: "0 auto",
            paddingTop: theme.spacing(2),
            // width: "100%",
        },
        helpButton: {
            color: theme.palette.type === "light" ? "#2a78d5" : "#030D1C",
            height: 48,
            width: 48,
        }
    })
);

interface Props {
    interactiveModeState: InteractiveModeState;
    disablePresent: boolean
    disableActivity: boolean
    setKey: React.Dispatch<React.SetStateAction<number>>;
    orientation: "horizontal" | "vertical"
}

export function ControlButtons({ interactiveModeState, disablePresent, disableActivity, setKey, orientation }: Props): JSX.Element {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
    const { selectedButton, buttonRoot, buttonGroup, divider, helpButton, screenSharingButton } = useStyles();
    const screenShare = useContext(ScreenShareContext);
    const webrtc = useContext(webRTCContext);

    const { interactiveMode, setInteractiveMode } = interactiveModeState;
    const [{ openStopTooltip, openPresentTooltip, openActivityTooltip, openScreenTooltip }, setOpenTooltip] = useState({
        openStopTooltip: false, openPresentTooltip: false, openActivityTooltip: false, openScreenTooltip: false
    });

    const toggleTooltip = (
        openStopTooltip: boolean,
        openPresentTooltip: boolean,
        openActivityTooltip: boolean,
        openScreenTooltip: boolean
    ) => { setOpenTooltip({ openStopTooltip, openPresentTooltip, openActivityTooltip, openScreenTooltip }); };

    return (
        <Grid
            container
            direction={orientation === "horizontal" ? "row" : "column"}
            justify="center"
            alignItems="center"
            alignContent="center"
            className={buttonGroup}
            style={orientation === "horizontal" ? { padding: 16 } : {}}
        >
            <Grid item xs={10} md={12}>
                <StyledToggleButtonGroup
                    orientation={orientation}
                    value={interactiveMode}
                    exclusive
                    onChange={(e, v) => {
                        setInteractiveMode(v);
                    }}
                    aria-label="interactive mode buttons"
                >
                    <StyledTooltip
                        arrow
                        open={openStopTooltip}
                        onClose={() => toggleTooltip(false, false, false, false)}
                        onOpen={() => toggleTooltip(true, false, false, false)}
                        placement={isSmDown ? "top" : "left"}
                        title={<FormattedMessage id="live_buttonStop" />}
                    >
                        <ToggleButton
                            aria-label="blank"
                            classes={{ root: buttonRoot }}
                            className={!interactiveMode ? selectedButton : ""}
                            value={0}
                        >
                            <VideoIcon size="1.5rem" />
                        </ToggleButton>
                    </StyledTooltip>
                    <StyledTooltip
                        arrow
                        open={openPresentTooltip}
                        onClose={() => toggleTooltip(false, false, false, false)}
                        onOpen={() => toggleTooltip(false, true, false, false)}
                        placement={isSmDown ? "top" : "left"}
                        title={<FormattedMessage id="live_buttonPresent" />}
                    >
                        <ToggleButton
                            aria-label="present"
                            classes={{ root: buttonRoot }}
                            className={interactiveMode === 1 ? selectedButton : ""}
                            disabled={disablePresent}
                            value={1}
                        >
                            <PresentIcon size="1.5rem" />
                        </ToggleButton>
                    </StyledTooltip>
                    <StyledTooltip
                        arrow
                        open={openActivityTooltip}
                        onClose={() => toggleTooltip(false, false, false, false)}
                        onOpen={() => toggleTooltip(false, false, true, false)}
                        placement={isSmDown ? "top" : "left"}
                        title={<FormattedMessage id="live_buttonObserve" />}
                    >
                        <ToggleButton
                            aria-label="student mode"
                            classes={{ root: buttonRoot }}
                            className={interactiveMode === 2 ? selectedButton : ""}
                            disabled={disableActivity}
                            value={2}
                        >
                            <ViewIcon size="1.5rem" />
                        </ToggleButton>
                    </StyledTooltip>
                    <StyledTooltip
                        arrow
                        open={openScreenTooltip}
                        onClose={() => toggleTooltip(false, false, false, false)}
                        onOpen={() => toggleTooltip(false, false, false, true)}
                        placement={isSmDown ? "top" : "left"}
                        title={interactiveMode === 3 ? "Stop Presenting" : <FormattedMessage id="live_buttonScreen" />}
                    >
                        <ToggleButton
                            style={{ whiteSpace: 'pre-line' }}
                            value={3}
                            aria-label="present screen"
                            classes={{ root: buttonRoot }}
                            className={(interactiveMode === 3 || screenShare.getStream()) ? screenSharingButton : ""}
                            disabled={!navigator.mediaDevices || !(navigator.mediaDevices as any).getDisplayMedia}
                            onClick={() => {
                                if (screenShare.getStream() && interactiveMode === 3) {
                                    screenShare.stop(webrtc);
                                }
                                if (!screenShare.getStream() && interactiveMode !== 3) {
                                    screenShare.start(webrtc);
                                }
                            }}
                        >
                            {
                                screenShare.getStream() ?
                                    <StopScreenShareIcon size="1.5rem" /> :
                                    <ScreenShareIcon size="1.5rem" />
                            }
                        </ToggleButton>
                    </StyledTooltip>
                </StyledToggleButtonGroup>
            </Grid>
            <Divider flexItem className={divider} />
            <Grid container justify="center" alignItems="center" item xs={1} md={12}>
                <Typography align="center">
                    <Tooltip id="what_is_this" arrow placement={isSmDown ? "top" : "left"} title={<FormattedMessage id="what_is_this" />}>
                        <IconButton
                            size="small"
                            className={helpButton}
                            onClick={() => { (openStopTooltip || openPresentTooltip || openActivityTooltip || openScreenTooltip) ? toggleTooltip(false, false, false, false) : toggleTooltip(true, true, true, true); }}
                        >
                            <HelpIcon size="1.25rem" />
                        </IconButton>
                    </Tooltip>
                </Typography>
            </Grid>
            <Grid container justify="center" alignItems="center" item xs={1} md={12}>
                <Typography align="center">
                    <Tooltip arrow placement={isSmDown ? "top" : "left"} title={<FormattedMessage id="refresh_activity" />}>
                        <IconButton
                            size="small"
                            className={helpButton}
                            onClick={() => setKey(Math.random())}
                        >
                            <RefreshIcon size="1.25rem" />
                        </IconButton>
                    </Tooltip>
                </Typography>
            </Grid>
        </Grid>
    );
}