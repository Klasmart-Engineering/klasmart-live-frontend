
import React, { useState, useContext } from 'react'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import PlayIcon from '@material-ui/icons/PlayArrow'
import StopIcon from '@material-ui/icons/Stop'
import ViewIcon from '@material-ui/icons/Visibility'
import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles'
import { FormattedMessage } from 'react-intl'
import { DrawerState } from './teacher'
import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks'
import { UserContext } from '../../app'
import { InviteButton } from '../../components/invite'
import { Grid } from '@material-ui/core'

const MUT_SHOW_CONTENT = gql`
    mutation showContent($roomId: ID!, $type: ContentType!, $contentId: ID) {
        showContent(roomId: $roomId, type: $type, contentId: $contentId)
    }
`

const StyledToggleButtonGroup = withStyles((theme) => ({
    grouped: {
      margin: theme.spacing(0.5),
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
      }
  })
)

interface Props {
    contentId: string
    streamId: string|undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setDrawerState: (s: DrawerState) => any,
}

export function ControlButtons({contentId, streamId, setDrawerState} : Props): JSX.Element {
    const {roomId} = useContext(UserContext)
    const {toggleSelected,loadingSelected} = useStyles()
    const [showContent, {loading}] = useMutation(MUT_SHOW_CONTENT)
    const [selectedButton, setSelectedButton] = useState(0);

    const selected = loading ? loadingSelected:toggleSelected
    return <Grid container>
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
          style={{ padding: '2px 5px', borderRadius: 12 }}
          classes={{ selected }}
          onClick={() => showContent({variables: { roomId, type: "Blank", id: '' } })}
          >
          <StopIcon style={{ paddingRight: 5 }} />
          <FormattedMessage id="button_stop" />
          </ToggleButton>
          <ToggleButton
          value={1}
          aria-label="centered"
          style={{ padding: '2px 5px', borderRadius: 12  }}
          classes={{ selected }}
          disabled={streamId === undefined}
          onClick={() => {
            showContent({variables: { roomId, type: 'Stream', contentId: streamId }})
            setDrawerState(DrawerState.HIDDEN)
          }}
          >
          <PlayIcon style={{ paddingRight: 5 }} />
          <FormattedMessage id="button_stream" />
          </ToggleButton>
          <ToggleButton
          value={2}
          aria-label="right aligned"
          style={{ padding: '2px 5px', borderRadius: 12  }}
          classes={{ selected }}
          onClick={() => {
            showContent({variables: { roomId, type: 'Activity', contentId }})
            setDrawerState(DrawerState.FULL)
          }}
          >
          <ViewIcon style={{ paddingRight: 5 }} />
          <FormattedMessage id="button_activity" />
          </ToggleButton>
      </StyledToggleButtonGroup>
      <InviteButton />
    </Grid>

}