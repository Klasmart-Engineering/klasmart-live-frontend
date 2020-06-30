
import { useMutation } from "@apollo/react-hooks";
import { Grid } from "@material-ui/core";
import { createStyles, makeStyles, withStyles } from "@material-ui/core/styles";
import PlayIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import ViewIcon from "@material-ui/icons/Visibility";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { gql } from "apollo-boost";
import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { UserContext } from "../../app";
import { InviteButton } from "../../components/invite";
import { Content } from "../../room";
import { DrawerState } from "./teacher";

const MUT_SHOW_CONTENT = gql`
    mutation showContent($roomId: ID!, $type: ContentType!, $contentId: ID) {
        showContent(roomId: $roomId, type: $type, contentId: $contentId)
    }
`;

const StyledToggleButtonGroup = withStyles((theme) => ({
    grouped: {
        "&:first-child": {
            borderRadius: theme.shape.borderRadius,
        },
        "&:not(:first-child)": {
            borderRadius: theme.shape.borderRadius,
        },
        "border": "none",
        "margin": theme.spacing(0.5),
        "textTransform": "capitalize",
    },
}))(ToggleButtonGroup);

const useStyles = makeStyles(() =>
    createStyles({
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
    content: Content;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setDrawerState: (s: DrawerState) => any;
}

export function ControlButtons({contentId, streamId, setDrawerState, content}: Props): JSX.Element {
    const {roomId} = useContext(UserContext);
    const {toggleSelected, loadingSelected} = useStyles();
    const [showContent, {loading}] = useMutation(MUT_SHOW_CONTENT);
    const [selectedButton, setSelectedButton] = useState(content.type);

    useEffect(() => {
        showContent({ variables: { roomId, type: selectedButton, contentId: selectedButton === "Stream" ? streamId : contentId }});
    }, [roomId, contentId, streamId, selectedButton]);

    const selected = loading ? loadingSelected : toggleSelected;
    return <Grid container>
        <StyledToggleButtonGroup
            value={content.type}
            exclusive
            onChange={(e, v) => setSelectedButton(v)}
            size="small"
            aria-label="text alignment"
        >
            <ToggleButton
                value={"Blank"}
                aria-label="left aligned"
                style={{ padding: "2px 5px", borderRadius: 12 }}
                classes={{ selected }}
                onClick={() => showContent({variables: { roomId, type: "Blank", contentId: "" } })}
            >
                <StopIcon style={{ paddingRight: 5 }} />
                <FormattedMessage id="live_buttonStop" />
            </ToggleButton>
            <ToggleButton
                value={"Stream"}
                aria-label="centered"
                style={{ padding: "2px 5px", borderRadius: 12  }}
                classes={{ selected }}
                disabled={streamId === undefined}
                onClick={() => {
                    showContent({variables: { roomId, type: "Stream", contentId: streamId }});
                    setDrawerState(DrawerState.HIDDEN);
                }}
            >
                <PlayIcon style={{ paddingRight: 5 }} />
                <FormattedMessage id="live_buttonStream" />
            </ToggleButton>
            <ToggleButton
                value={"Activity"}
                aria-label="right aligned"
                style={{ padding: "2px 5px", borderRadius: 12  }}
                classes={{ selected }}
                onClick={() => {
                    showContent({variables: { roomId, type: "Activity", contentId }});
                    setDrawerState(DrawerState.FULL);
                }}
            >
                <ViewIcon style={{ paddingRight: 5 }} />
                <FormattedMessage id="live_buttonActivity" />
            </ToggleButton>
        </StyledToggleButtonGroup>
        <InviteButton />
    </Grid>;
}
