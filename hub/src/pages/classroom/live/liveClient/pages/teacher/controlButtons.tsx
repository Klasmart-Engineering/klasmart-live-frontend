
import { useMutation } from "@apollo/react-hooks";
import { Grid, Typography } from "@material-ui/core";
import { createStyles, makeStyles, withStyles } from "@material-ui/core/styles";
import PlayIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import ViewIcon from "@material-ui/icons/Visibility";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { gql } from "apollo-boost";
import React, { useContext, useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import CenterAlignChildren from "../../../../../../components/centerAlignChildren";
import { UserContext } from "../../app";

const MUT_SHOW_CONTENT = gql`
    mutation showContent($roomId: ID!, $type: ContentType!, $contentId: ID) {
        showContent(roomId: $roomId, type: $type, contentId: $contentId)
    }
`;

const StyledToggleButtonGroup = withStyles((theme) => ({
    grouped: {
        // margin: theme.spacing(0.5),
        "&:first-child": {
            borderRadius: theme.shape.borderRadius,
        },
        "&:not(:first-child)": {
            borderRadius: theme.shape.borderRadius,
        },
        "border": "none",
        "textTransform": "capitalize",
    },
}))(ToggleButtonGroup);

const useStyles = makeStyles(() =>
    createStyles({
        buttonGroup: {
            backgroundColor: "#e6f3ff",
            borderBottomLeftRadius: 12,
            padding: "0px 16px",
        },
        loadingSelected: {
            backgroundColor: "#000 !important",
            color: "white !important",
        },
        toggleSelected: {
            backgroundColor: "#3f51b5 !important",
            color: "white !important",
        },
    }),
);

interface Props {
    contentId: string;
    streamId: string|undefined;
}

export function ControlButtons({contentId, streamId}: Props): JSX.Element {
    const {roomId} = useContext(UserContext);
    const {toggleSelected, loadingSelected, buttonGroup} = useStyles();
    const [showContent, {loading}] = useMutation(MUT_SHOW_CONTENT);
    const [selectedButton, setSelectedButton] = useState(0);

    useEffect(()=>{
        if (selectedButton === 0) {
            showContent({variables: { roomId, type: "Blank", contentId: "" }});
        }
    },[selectedButton]);

    useEffect(()=>{
        if (selectedButton === 1) {
            showContent({variables: { roomId, type: "Stream", contentId: streamId }});
        }
    },[streamId,selectedButton]);

    useEffect(()=>{
        if (selectedButton === 2) {
            showContent({variables: { roomId, type: "Activity", contentId }});
        }
    },[contentId,selectedButton]);

    const selected = loading ? loadingSelected : toggleSelected;
    return (
        <Grid container style={{ height: "100%" }}>
            <CenterAlignChildren className={buttonGroup}>
                <Typography variant="caption" style={{ padding: "0 8px" }}>
                    <FormattedMessage id="live_buttonInteractiveLabel" />
                </Typography>
                <StyledToggleButtonGroup
                    value={selectedButton}
                    exclusive
                    onChange={(e, v) => setSelectedButton(v)}
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
                        disabled={streamId === undefined}
                    >
                        <PlayIcon style={{ paddingRight: 5 }} />
                        <FormattedMessage id="live_buttonPresent" />
                    </ToggleButton>
                    <ToggleButton
                        value={2}
                        aria-label="right aligned"
                        style={{ padding: "2px 8px", borderRadius: 12  }}
                        classes={{ selected }}
                    >
                        <ViewIcon style={{ paddingRight: 5 }} />
                        <FormattedMessage id="live_buttonActivity" />
                    </ToggleButton>
                </StyledToggleButtonGroup>
            </CenterAlignChildren>
        </Grid>
    );
}
