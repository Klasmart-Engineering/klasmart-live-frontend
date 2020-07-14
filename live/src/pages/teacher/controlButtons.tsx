
import React, { useContext, Dispatch, useEffect } from 'react'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import PlayIcon from '@material-ui/icons/PlayArrow'
import StopIcon from '@material-ui/icons/Stop'
import ViewIcon from '@material-ui/icons/Visibility'
import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles'
import { FormattedMessage } from 'react-intl'
import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks'
import { UserContext } from '../../app'
import { Grid, Typography } from '@material-ui/core'
import CenterAlignChildren from '../../components/centerAlignChildren'
import clsx from 'clsx'

const MUT_SHOW_CONTENT = gql`
    mutation showContent($roomId: ID!, $type: ContentType!, $contentId: ID) {
        showContent(roomId: $roomId, type: $type, contentId: $contentId)
    }
`

const StyledToggleButtonGroup = withStyles((theme) => ({
    grouped: {
        // margin: theme.spacing(0.5),
        border: 'none',
        '&:not(:first-child)': {
            borderRadius: theme.shape.borderRadius
        },
        '&:first-child': {
            borderRadius: theme.shape.borderRadius
        },
    
        textTransform: 'capitalize'
        }
    }))(ToggleButtonGroup)

    const useStyles = makeStyles(() =>
    createStyles({
        toggleSelected: {
            color: 'white !important',
            backgroundColor: '#3f51b5 !important'
        },
        loadingSelected: {
            color: 'white !important',
            backgroundColor: '#000 !important'
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
)

interface Props {
    contentId: string;
    streamId: string|undefined;
    selectedButton: number;
    setSelectedButton: Dispatch<React.SetStateAction<number>>;
}

export function ControlButtons({contentId, streamId, selectedButton, setSelectedButton} : Props): JSX.Element {
    const {roomId} = useContext(UserContext)
    const {toggleSelected,loadingSelected, buttonGroup, buttonGroupActivity} = useStyles()
    const [showContent, {loading}] = useMutation(MUT_SHOW_CONTENT)
    console.log(`selectedButton ${selectedButton}`)
    const selected = loading ? loadingSelected : toggleSelected;

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

    return (
        <Grid container style={{ height: "100%" }}>
            <CenterAlignChildren className={clsx(buttonGroup, selectedButton === 2 ? buttonGroupActivity : "")}>
                <Typography variant="caption" style={{ padding: "0 8px" }}>
                    <FormattedMessage id="live_buttonInteractiveLabel" />
                </Typography>
                <StyledToggleButtonGroup
                    value={selectedButton}
                    exclusive
                    onChange={(e,v) => setSelectedButton(v)}
                    size="small"
                    aria-label="text alignment"
                >
                    <ToggleButton
                        value={0}
                        aria-label="left aligned"
                        style={{ padding: '2px 8px', borderRadius: 12 }}
                        classes={{ selected }}
                    >
                        <StopIcon style={{ paddingRight: 5 }} />
                        <FormattedMessage id="live_buttonStop" />
                    </ToggleButton>
                    <ToggleButton
                        value={1}
                        aria-label="centered"
                        style={{ padding: '2px 8px', borderRadius: 12  }}
                        classes={{ selected }}
                        disabled={streamId === undefined}
                    >
                        <PlayIcon style={{ paddingRight: 5 }} />
                        <FormattedMessage id="live_buttonPresent" />
                    </ToggleButton>
                    <ToggleButton
                        value={2}
                        aria-label="right aligned"
                        style={{ padding: '2px 8px', borderRadius: 12  }}
                        classes={{ selected }}
                        disabled={contentId === undefined}
                    >
                        <ViewIcon style={{ paddingRight: 5 }} />
                        <FormattedMessage id="live_buttonActivity" />
                    </ToggleButton>
                </StyledToggleButtonGroup>
            </CenterAlignChildren>
        </Grid>
    )
}