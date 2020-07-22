
import React, { useContext, useState } from "react";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import PlayIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import ViewIcon from "@material-ui/icons/Visibility";
import ScreenShareIcon from "@material-ui/icons/ScreenShare";
import StopScreenShareIcon from "@material-ui/icons/StopScreenShare";
import HelpTwoToneIcon from "@material-ui/icons/HelpTwoTone";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles, withStyles, Theme } from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";
import { ScreenShareContext } from "./screenShareProvider";
import { webRTCContext } from "../../webRTCState";
import { InteractiveModeState } from "../../room";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";

const StyledToggleButtonGroup = withStyles((theme) => ({
    grouped: {
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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        label: {
            writingMode: "vertical-rl",
            transform: "rotate(-180deg)",
        },
        divider: {
            height: 1,
            marginTop: theme.spacing(2),
        },
        buttonRoot: {
            backgroundColor: "white",
            "&:hover": {
                "-webkit-transition": "all .4s ease",
                color: "white",
                backgroundColor: "#1B365D",
                "box-shadow": "0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)",
                "transform": "translateX(-2px)",
                "transition": "all .4s ease",
            },
        },
        selectedButton: {
            color: "white !important",
            backgroundColor: "#0E78D5 !important",
        },
        buttonGroup: {
            backgroundColor: "#e6f3ff",
            margin: "0 auto",
            paddingTop: theme.spacing(2),
            // width: "100%",
        },
        helpButton: {
            color: theme.palette.primary.main,
            height: 48,
            width: 48,
        }
    })
);

interface Props {
    interactiveModeState: InteractiveModeState;
    disablePresent: boolean
    disableActivity: boolean

}

export function ControlButtons({interactiveModeState, disablePresent, disableActivity} : Props): JSX.Element {
    const {selectedButton, buttonRoot, buttonGroup, divider, helpButton, label} = useStyles();
    const screenShare = useContext(ScreenShareContext);
    const webrtc = useContext(webRTCContext);
    
    const { interactiveMode, setInteractiveMode } = interactiveModeState;
    const [{ openStopTooltip, openPresentTooltip, openActivityTooltip, openScreenTooltip }, setOpenTooltip] = useState({
        openStopTooltip: false, openPresentTooltip: false, openActivityTooltip: false, openScreenTooltip: false });

    const toggleTooltip = (
        openStopTooltip: boolean, 
        openPresentTooltip: boolean, 
        openActivityTooltip: boolean, 
        openScreenTooltip: boolean
    ) => { setOpenTooltip({openStopTooltip, openPresentTooltip, openActivityTooltip, openScreenTooltip}); };

    return (
        <Grid container direction="column" justify="center" alignContent="center" className={buttonGroup}>
            <Grid item xs={12}>
                <StyledToggleButtonGroup
                    orientation="vertical"
                    value={interactiveMode}
                    exclusive
                    onChange={(e,v) => {
                        setInteractiveMode(v);
                    }}
                    aria-label="interactive mode buttons"
                >
                    <Tooltip 
                        arrow 
                        open={openStopTooltip} 
                        onClose={() => toggleTooltip(false, false, false, false)}
                        onOpen={() => toggleTooltip(true, false, false, false)}
                        placement="left"
                        title={<FormattedMessage id ="live_buttonStop"/>}
                    >
                        <ToggleButton
                            aria-label="blank"
                            classes={{ root: buttonRoot }}
                            className={ !interactiveMode ? selectedButton : "" }
                            value={0}
                        >
                            <StopIcon />
                        </ToggleButton>
                    </Tooltip>
                    <Tooltip 
                        arrow 
                        open={openPresentTooltip} 
                        onClose={() => toggleTooltip(false, false, false, false)}
                        onOpen={() => toggleTooltip(false, true, false, false)}
                        placement="left"
                        title={<FormattedMessage id ="live_buttonPresent"/>}
                    >
                        <ToggleButton
                            aria-label="present"
                            classes={{ root: buttonRoot }}
                            className={ interactiveMode === 1 ? selectedButton : "" }
                            disabled={disablePresent}
                            value={1}
                        >
                            <PlayIcon />
                        </ToggleButton>
                    </Tooltip>
                    <Tooltip 
                        arrow 
                        open={openActivityTooltip} 
                        onClose={() => toggleTooltip(false, false, false, false)}
                        onOpen={() => toggleTooltip(false, false, true, false)}
                        placement="left"
                        title={<FormattedMessage id ="live_buttonActivity"/>}
                    >
                        <ToggleButton
                            aria-label="student mode"
                            classes={{ root: buttonRoot }}
                            className={ interactiveMode === 2 ? selectedButton : "" }
                            disabled={disableActivity}
                            value={2}
                        >
                            <ViewIcon />
                        </ToggleButton>
                    </Tooltip>
                    <Tooltip 
                        arrow 
                        open={openScreenTooltip} 
                        onClose={() => toggleTooltip(false, false, false, false)}
                        onOpen={() => toggleTooltip(false, false, false, true)}
                        placement="left"
                        title={ interactiveMode === 3 ? "Stop Presenting" : <FormattedMessage id="live_buttonScreen" />}
                    >
                        <ToggleButton
                            value={3}
                            aria-label="present screen"
                            classes={{ root: buttonRoot }}
                            className={ interactiveMode === 3 ? selectedButton : "" }
                            disabled={!navigator.mediaDevices || !(navigator.mediaDevices as any).getDisplayMedia}
                            onClick={() => {
                                if(screenShare.getStream() && interactiveMode === 3) {
                                    screenShare.stop(webrtc);
                                }
                                if(!screenShare.getStream() && interactiveMode !== 3)
                                {
                                    screenShare.start(webrtc);
                                }
                            }}
                        >
                            {
                                screenShare.getStream() ?
                                    <StopScreenShareIcon />:
                                    <ScreenShareIcon /> 
                            }
                        </ToggleButton>
                    </Tooltip>
                </StyledToggleButtonGroup>
            </Grid>
            <Divider flexItem className={divider} />
            <Grid item xs={12}>
                <Typography align="center">
                    <Tooltip arrow placement="left" title="What's This?">
                        <IconButton 
                            size="small"
                            className={helpButton}
                            onClick={() => {(openStopTooltip || openPresentTooltip || openActivityTooltip || openScreenTooltip) ? toggleTooltip(false, false, false, false) : toggleTooltip(true, true, true, true);}}
                        >
                            <HelpTwoToneIcon />
                        </IconButton>
                    </Tooltip>
                </Typography>
            </Grid>
        </Grid>
    );
}