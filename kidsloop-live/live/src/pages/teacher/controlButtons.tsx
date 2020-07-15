
import React from "react";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import PlayIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import ViewIcon from "@material-ui/icons/Visibility";
import { createStyles, makeStyles, withStyles } from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";
import { Grid, Typography } from "@material-ui/core";
import CenterAlignChildren from "../../components/centerAlignChildren";
import clsx from "clsx";

const StyledToggleButtonGroup = withStyles((theme) => ({
    grouped: {
        // margin: theme.spacing(0.5),
        border: "none",
        "&:not(:first-child)": {
            borderRadius: theme.shape.borderRadius
        },
        "&:first-child": {
            borderRadius: theme.shape.borderRadius
        },
    
        textTransform: "capitalize"
    }
}))(ToggleButtonGroup);

const useStyles = makeStyles(() =>
    createStyles({
        toggleSelected: {
            color: "white !important",
            backgroundColor: "#3f51b5 !important"
        },
        loadingSelected: {
            color: "white !important",
            backgroundColor: "#000 !important"
        },
        buttonGroup: {
            backgroundColor: "#e6f3ff",
            borderBottomLeftRadius: 12,
            padding: "0px 16px",
        },
        buttonGroupActivity: {
            borderTopLeftRadius: 12,
        },
    })
);

interface Props {
    setSelectedButton: (v: number) => void
    loading: boolean
    selectedButton: number
    disablePresent: boolean
    disableActivity: boolean

}

export function ControlButtons({setSelectedButton, loading, selectedButton, disablePresent, disableActivity} : Props): JSX.Element {
    const {toggleSelected,loadingSelected, buttonGroup, buttonGroupActivity} = useStyles();
    const selected = loading ? loadingSelected : toggleSelected;

    return (
        <Grid container style={{ height: "100%" }}>
            <CenterAlignChildren className={clsx(buttonGroup, selectedButton === 2 ? buttonGroupActivity : "")}>
                <Typography variant="caption" style={{ padding: "0 8px" }}>
                    <FormattedMessage id="live_buttonInteractiveLabel" />
                </Typography>
                <StyledToggleButtonGroup
                    value={selectedButton}
                    exclusive
                    onChange={(e,v) => {
                        setSelectedButton(v);
                    }}
                    size="small"
                    aria-label="text alignment"
                >
                    <ToggleButton
                        value={0}
                        aria-label="left aligned"
                        style={{ padding: "2px 8px", borderRadius: 12 }}
                        classes={{ selected }}
                    >
                        <StopIcon style={{ paddingRight: 5 }} />
                        <FormattedMessage id="live_buttonStop" />
                    </ToggleButton>
                    <ToggleButton
                        value={1}
                        aria-label="centered"
                        style={{ padding: "2px 8px", borderRadius: 12  }}
                        classes={{ selected }}
                        disabled={disablePresent}
                    >
                        <PlayIcon style={{ paddingRight: 5 }} />
                        <FormattedMessage id="live_buttonPresent" />
                    </ToggleButton>
                    <ToggleButton
                        value={2}
                        aria-label="right aligned"
                        style={{ padding: "2px 8px", borderRadius: 12  }}
                        classes={{ selected }}
                        disabled={disableActivity}
                    >
                        <ViewIcon style={{ paddingRight: 5 }} />
                        <FormattedMessage id="live_buttonActivity" />
                    </ToggleButton>
                </StyledToggleButtonGroup>
            </CenterAlignChildren>
        </Grid>
    );
}