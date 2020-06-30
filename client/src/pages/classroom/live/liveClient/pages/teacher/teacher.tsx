import Drawer from '@material-ui/core/Drawer'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import ArrowIcon from '@material-ui/icons/ExpandLess'
import React, { useEffect, useMemo, useState, useContext } from 'react'
import { FormattedMessage } from 'react-intl'
import { Player } from '../../components/player'
import { RecordedIframe } from '../../components/recordediframe'
import { ControlButtons } from './controlButtons'
import StyledTextField from '../../components/textfield'
import { Session, Content } from '../../room'
import GridList from '@material-ui/core/GridList'
import { GridListTile, TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { sessionIdContext } from '../../entry'
import { PreviewPlayer } from '../../components/preview-player'

const activityList = [
    { title: "Introduction: Snow Leopards", link: "/h5p/play/5ed99fe36aad833ac89a4803" },
    { title: "Matching", link: "/h5p/play/5ecf4e4b611e18398f7380ef" },
    { title: "Sticker Activity", link: "/h5p/play/5ed0b64a611e18398f7380fb" },
    { title: "Flashcards", link: "/h5p/play/5ed05dd1611e18398f7380f4" }
]

const useStyles = makeStyles(() =>
    createStyles({
        parentContainer: {
            height: '100%',
            width: '100%'
            // margin: "0 auto",
        },
        iframeContainer: {
            overflow: 'hidden',
            paddingTop: '56.25%',
            position: 'relative',
            border: '1px solid gray',
            borderRadius: '12px 12px 0 0',
            margin: "0 auto",
        },
        iframe: {
            border: 'none',
            height: '100%',
            left: 0,
            position: 'absolute',
            top: 0,
            width: '100%'
        },
        parentContainerDrawer: {
            width: '100%',
            margin: '0 auto'
        },
        toolbarDrawer: {
            borderBottom: '1px solid #eee',
            width: '100%',
            margin: '0 auto'
        },
        iframeContainerDrawer: {
            borderRadius: 5,
            overflow: 'hidden',
            paddingTop: '56.25%',
            position: 'relative',
            width: '100%',
            maxHeight: 200,
            align: 'center',
            textAlign: 'center',
            float: 'left'
        },
        iframeDrawer: {
            border: 'none',
            height: '100%',
            left: 0,
            position: 'absolute',
            top: 0,
            width: '100%',
            margin: '0 auto'
        },
        drawerCloseBtn: {
            float: 'right'
        },
        zoomInBtn: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 10
        },
        toggleSelected: {
            color: 'white !important',
            backgroundColor: '#3f51b5 !important'
        },
        gridList: {
            flexWrap: 'nowrap',
            transform: 'translateZ(0)',
        },
        txtfield: {
            "& fieldset": {
                borderRadius: 12,
            },
            "borderColor": "#1896ea",
        },
    })
)

interface TeacherProps {
    users: Map<string, Session>
    content: Content,
}

export enum DrawerState {
    HIDDEN = 0,
    HALF = 1,
    FULL = 2,
}

export function Teacher ({users, content}: TeacherProps): JSX.Element {
    const classes = useStyles()
    const sessionId = useContext(sessionIdContext)
    const [streamId, setStreamId] = useState<string>()
    const [drawerState, setDrawerState] = useState<DrawerState>(DrawerState.HIDDEN)
    const [zoominTarget, setZoominTarget] = useState<string>()
    const [width, setWidth] = useState<string | number>("100%");
    const [height, setHeight] = useState<string | number>("100%");
    const [maxWidth, setMaxWidth] = useState<number>(0);
    const [maxHeight, setMaxHeight] = useState<number>(0);

    const memos = useMemo(() => {
        const url = new URL(window.location.href)
        return {
        activity: url.searchParams.get('activity') || '',
        hostName: url.hostname,
        }
    }, [])

    const [contentId, setContentId] = useState(memos.activity)
    const [value, setValue] = useState(activityList[0].title);

    console.log(`contentId: ${contentId}`)
    console.log(`value: ${value}`)
    
    useEffect(() => {
        const containerRef = window.document.getElementById("iframe-container");
        if (containerRef) {
            setHeight(containerRef.getBoundingClientRect().height);
            setWidth(containerRef.getBoundingClientRect().width);
            setMaxHeight(containerRef.getBoundingClientRect().height);
            setMaxWidth(containerRef.getBoundingClientRect().width);
        }
        const onPressESC = (event: any) => {
            if (event.keyCode === 27) {
                setZoominTarget(undefined)
                setDrawerState(DrawerState.HALF)
            }
        }
        window.addEventListener('keydown', onPressESC, false)
        return () => window.removeEventListener('keydown', onPressESC, false)
    }, [])

    return (
        <Grid container>
            <Grid className={classes.parentContainer}>
                <Grid container spacing={3}>
                    <Grid item xs={12} style={{ margin: '10px 0px 20px 0px' }}>
                        <Autocomplete
                            freeSolo
                            value={contentId}
                            onChange={(event: any, newValue: string | { title: string; link: string; } | null) => {
                                if(newValue) {
                                    console.log(`newValue: ${newValue}`)
                                    if (typeof newValue === "string") {
                                        setContentId(activityList[activityList.findIndex((e)=> e.title === newValue)].link);
                                    } else {
                                        setContentId(newValue.link);
                                    }
                                }
                            }}
                            inputValue={value}
                            onInputChange={(event, newInputValue) => {
                                console.log(`newInputValue: ${newInputValue}`)
                                setValue(newInputValue);
                            }}
                            id="activity select and input"
                            options={activityList.map((option) => option.title)}
                            style={{ width: "100%" }}
                            renderInput={(params) =>                                    
                                <TextField 
                                    {...params}
                                    label="Select an activity or enter a link"
                                    className={classes.txtfield}
                                    variant="outlined" />
                            }
                        />
                    </Grid>
                </Grid>
                <Grid 
                    id="iframe-container" 
                    className={classes.iframeContainer}
                    style={{ height, width }}
                >
                    <RecordedIframe
                        contentId={contentId}
                        setStreamId={setStreamId}
                        maxWidth={maxWidth}
                        maxHeight={maxHeight}
                        parentWidth={width}
                        parentHeight={height}
                        setParentWidth={setWidth}
                        setParentHeight={setHeight}
                        frameProps={{ 
                            width: '100%', 
                            style: { top: '0', position: 'absolute', left: '0', height: '100%' } 
                        }}
                    />
                    <Drawer
                        anchor={'bottom'}
                        open={drawerState !== DrawerState.HIDDEN}
                        variant="persistent"
                        onClose={() => setDrawerState(DrawerState.HIDDEN)}
                        PaperProps={{ style: { position: 'absolute', minHeight: drawerState === DrawerState.FULL ? '50%' : '50%', maxHeight: '50%' } }}
                        BackdropProps={{ style: { position: 'absolute' } }}
                        ModalProps={{
                            container: document.getElementById('iframe-container'),
                            style: { position: 'absolute' }
                    }}>
                    <Grid container className={classes.parentContainerDrawer} spacing={3}>
                        <Grid container justify="flex-end" style={{ borderBottom: '1px solid #eee' }}>
                            <Grid item>
                                {/* <IconButton aria-label="drawer-size" size="small">
                                <ArrowIcon
                                    fontSize="inherit"
                                    style={{ transform: drawerState === DrawerState.FULL ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                    onClick={() =>  setDrawerState(drawerState === DrawerState.FULL ? DrawerState.HALF : DrawerState.FULL) }
                                />
                                </IconButton> */}
                                <IconButton aria-label="close" size="small" onClick={() => setDrawerState(DrawerState.HIDDEN)}>
                                <CloseIcon fontSize="inherit" />
                                </IconButton>
                            </Grid>
                        </Grid>
                        {
                        users.size === 0 
                        ? <Typography>
                            <FormattedMessage id="waiting_for_students" />
                        </Typography>
                        : (zoominTarget !== undefined
                            ? <Grid className={classes.iframeContainerDrawer}>
                            <Player streamId={zoominTarget} frameProps={{ style: { top: '0', position: 'absolute', left: '0', height: '100%', transform: 'scale(0.8)' } }} />
                            </Grid>
                            : 
                            <Grid container direction="row" style={{ height: "100%" }}>
                                {
                                    [...users.entries()].filter(([,s]) => s.id !== sessionId).map(([id,session]) => (
                                        <Grid item style={{ height: 200, width: 200 }} key={id}>
                                            {session.streamId ? 
                                                <PreviewPlayer 
                                                    streamId={session.streamId}
                                                    height={200}
                                                    width={200}
                                                /> : undefined}
                                            <Typography align="center">
                                                {session.name}
                                            </Typography>
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        )
                        }
                    </Grid>
                    </Drawer>
                </Grid>
                <Grid
                    container
                    justify="space-between"
                    style={{ maxWidth: width, margin: "0 auto", borderLeft: '1px solid gray', borderRight: '1px solid gray', borderBottom: '1px solid gray', borderRadius: '0 0 12px 12px' }}
                >
                    <Grid item>
                        <ControlButtons setDrawerState={setDrawerState} contentId={contentId} content={content} streamId={streamId} />
                    </Grid>
                    <Grid item style={{ display: drawerState !== DrawerState.HIDDEN ? 'none' : 'inline-flex' }}>
                        <Tooltip
                            title={<FormattedMessage id="open_preview_drawer" />}
                            placement="left"
                            aria-label="open"
                        >
                            <IconButton aria-label="drawer-size" size="small">
                            <ArrowIcon fontSize="inherit" onClick={() => setDrawerState(DrawerState.HALF)} />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item style={{width:"400px"}}>
            </Grid>
        </Grid>
    )
}
