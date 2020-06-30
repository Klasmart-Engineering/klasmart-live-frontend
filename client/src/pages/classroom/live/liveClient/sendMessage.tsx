import React, { useState, useContext } from 'react'
import { Button, CircularProgress, Grid, useTheme, Paper, makeStyles, Theme, createStyles, TextField, Collapse } from '@material-ui/core'
import { useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { UserContext } from './app'

const useStyles = makeStyles((theme: Theme) =>
createStyles({
    cssFocused: {
        "&$cssFocused": {
            backgroundColor: "#dff0ff",
            color: "#000", // focused
        },

    },
    cssOutlinedInput: {
        "&$cssFocused": {
            borderColor: "#1896ea", // focused
        },
        "&:hover:not($disabled):not($cssFocused):not($error)": {
            backgroundColor: "#b8ddff",
            borderColor: "#7c8084", // hovered
        },
        "&:not(hover):not($disabled):not($cssFocused):not($error)": {
            borderColor: "#c9caca", // default
        },
        "backgroundColor": "#fcfcfb",
    },
    liveChatInput: {
        borderRadius: 12,
        padding: theme.spacing(2, 4),
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(2, 2),
        },
    },
    paperContainer: {
        borderRadius: 12,
        boxShadow: theme.palette.type === "dark" ? "0px 2px 4px -1px rgba(255, 255, 255, 0.25), 0px 4px 5px 0px rgba(255, 255, 255, 0.2), 0px 1px 10px 0px rgba(255, 255, 255, 0.16)" : "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
    },
    smallAvatar: {
        height: theme.spacing(4),
        marginRight: theme.spacing(1),
        width: theme.spacing(4),
    },
}));


const SEND_MESSAGE = gql`
    mutation sendMessage($roomId: ID!, $message: String) {
        sendMessage(roomId: $roomId, message: $message) {
            id,
            message
        }
    }
`
export function SendMessage (): JSX.Element {
    const classes = useStyles();
    const theme = useTheme();
    const [focusedInput, setFocusedInput] = useState(false);
    const [sendMessage, { loading }] = useMutation(SEND_MESSAGE);
    const [message, setMessage] = useState('');
    const {roomId} = useContext(UserContext)

    function send() {
      sendMessage({ variables: { roomId, message } })
      setMessage('')
    }

    return (
        <Grid item xs={12} style={{ margin: theme.spacing(3, 0) }}>
            <Paper elevation={4} className={classes.paperContainer}>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                    className={classes.liveChatInput}
                    spacing={2}
                >
                    <form 
                        onSubmit={(e) => { e.preventDefault(); send()}}
                        style={{ flex: 1 }}
                    >
                        <Grid item style={{ flex: 1 }}>
                            <TextField
                                fullWidth
                                id="live-chat-input"
                                label="Share something here"
                                variant="filled"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onClick={() => setFocusedInput(true)}
                                InputProps={{
                                    classes: {
                                        focused: classes.cssFocused,
                                        root: classes.cssOutlinedInput,
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Collapse in={focusedInput}>
                                <Grid container item xs={12} justify="flex-end" alignItems="center">
                                    <Button
                                        color="primary" 
                                        onClick={() => send()}
                                    >
                                        {!loading ? 'Send' : <CircularProgress size={15}/>}
                                    </Button>
                                </Grid>
                            </Collapse>
                        </Grid>
                    </form>
                </Grid>
            </Paper>
        </Grid>
    )
}