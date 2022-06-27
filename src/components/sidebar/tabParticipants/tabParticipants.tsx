import ListUserCamera from "@/components/sidebar/listUserCamera/listUserCamera";
import SidebarPagination from "@/components/sidebar/sidebarPagination";
import UserAudio from "@/components/sidebar/UserAudio";
import { GlobaActionsMenuItem } from "@/components/toolbar/toolbarMenus/globalActionsMenu/globalAction";
import {
    pauseAllCamerasState,
    pauseAllMicrophonesState,
} from "@/components/toolbar/toolbarMenus/globalActionsMenu/globalActionsMenu";
import { THEME_COLOR_GREY_200 } from "@/config";
import { useSessions } from "@/data/live/state/useSessions";
import { Session } from "@/pages/utils";
import { useSessionContext } from "@/providers/session-context";
import { hasControlsState } from "@/store/layoutAtoms";
import { NoItemList } from "@/utils/noItemList";
import { useTrackStates } from '@kl-engineering/live-state/ui';
import {
    Box,
    ButtonBase,
    Fade,
    Grid,
    makeStyles,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import { alpha } from "@material-ui/core/styles";
import { CameraVideoFill as CameraVideoFillIcon } from "@styled-icons/bootstrap/CameraVideoFill";
import { CameraVideoOffFill as CameraDisabledIcon } from "@styled-icons/bootstrap/CameraVideoOffFill";
import { MicFill as MicFillIcon } from "@styled-icons/bootstrap/MicFill";
import { MicMuteFill as MicDisabledIcon } from "@styled-icons/bootstrap/MicMuteFill";
import { Person as UserIcon } from "@styled-icons/fluentui-system-regular/Person";
import clsx from "clsx";
import React,
{
    useMemo,
    useState,
} from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";
import {
    useRecoilState,
    useRecoilValue,
} from "recoil";

export type ProducerId = string;

export type TrackState = {
    producerId?: ProducerId | undefined;
    kind?: "audio" | "video" | undefined;
    isMine?: boolean | undefined;
    isConsumable?: boolean | undefined;
    isPausedLocally?: boolean | undefined;
    isPausedGlobally?: boolean | undefined;
    isPausedAtSource?: boolean | undefined;
    sessionId?: string | undefined;
}

interface SessionWithTrackState extends Session, TrackState {}

const useStyles = makeStyles((theme) => ({
    rootSm: {
        padding: `0 10px`,
        "& $cameraGridSingleTeacher": {
            padding: `0`,
            minHeight: `auto`,
        },
        [theme.breakpoints.down(`xs`)]: {
            flexWrap: `nowrap`,
            margin: theme.spacing(1, 0),
        },
    },
    cameraGrid: {
        display: `grid`,
        gridTemplateColumns: `1fr`,
        gridGap: `10px`,
    },
    cameraGridTwoColumns: {
        gridTemplateColumns: `1fr 1fr`,
        [theme.breakpoints.between(`sm`, 1024)]: {
            gridTemplateColumns: `1fr`,
        },
    },
    cameraGridSingleTeacher: {
        gridTemplateColumns: `1fr`,
        minHeight: `150px`,
        padding: `0 52px`,
    },
    gridContainerTeachers: {
        marginBottom: `15px`,
    },
    gridContainerStudents: {
        marginBottom: -10,
        paddingBottom: 10,
    },
    gridContainerAll: {
        overflowY: `auto`,
        height: `100%`,
    },
    fullheight: {
        height: `100%`,
        flexWrap: `nowrap`,
    },
    participants: {
        display: `flex`,
        alignItems: `center`,
        marginBottom: theme.spacing(1),
        flexWrap: `wrap`,
    },
    globalMuteActionIcon: {
        color: theme.palette.text.primary,
        backgroundColor: THEME_COLOR_GREY_200,
        padding: theme.spacing(1),
        borderRadius: `1.5em`,
        margin: theme.spacing(0.5),
        cursor: `pointer`,
    },
    active: {
        filter: `none`,
        color: red[500],
        backgroundColor: alpha(red[500], 0.1),
        "&:hover": {
            backgroundColor: alpha(red[500], 0.2),
        },
    },
    participantsTitle: {
        fontWeight: theme.typography.fontWeightBold as number,
        marginRight: theme.spacing(2),
    },
}));

function TabParticipants () {
    const classes = useStyles();
    const intl = useIntl();
    const sessions = useSessions();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));
    const isXsDown = useMediaQuery(theme.breakpoints.down(`xs`));
    const hasControls = useRecoilValue(hasControlsState);
    const { isTeacher } = useSessionContext();
    const trackStates = useTrackStates();
    const [ currentPage, setCurrentPage ] = useState(1);

    const STREAMS_PER_PAGE = 3;

    const studentsSessions = useMemo(() => [ ...sessions.values() ]
        .filter(s => !s.isTeacher)
        .sort(sessionComparator), [ sessions ]);

    const teachersSessions = useMemo(() => [ ...sessions.values() ]
        .filter(s => s.isTeacher)
        .sort(sessionComparator), [ sessions ]);

    const hostSession = useMemo(() => [ ...sessions.values() ]
        .filter(s => s.isHost), [ sessions ]);

    const nonHostSessions = useMemo(() => [ ...sessions.values() ]
        .filter(s => !s.isHost)
        .sort(sessionWithTrackComparator), [ sessions ]);

    const pagesTotal = useMemo(() => Math.ceil(nonHostSessions.length / STREAMS_PER_PAGE), [ nonHostSessions ]);

    const videoTracks = trackStates.filter((track: TrackState) => track.kind === `video`);

    const sessionsWithTrackState = useMemo(() => {
        if (!videoTracks) {return nonHostSessions;}
        const combinedSessionAndTracks = nonHostSessions.map(session => ({
            ...session,
            ...videoTracks.find((track: TrackState) => track.sessionId === session.id),
            name: session.name,
        }));

        return combinedSessionAndTracks.sort(sessionWithTrackComparator);
    }, [ nonHostSessions, videoTracks ]);

    const slicedSessions = useMemo(() => sessionsWithTrackState.slice(((currentPage - 1) * STREAMS_PER_PAGE), (currentPage * STREAMS_PER_PAGE)), [ sessionsWithTrackState, currentPage ]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, direction: string) => {
        switch (direction) {
        case `next`:
            setCurrentPage(currentPage + 1);
            break;
        case `prev`:
            setCurrentPage(currentPage - 1);
            break;
        default:
            console.log(`No direction provided.`);
        }
    };

    const [ allMicrophonesPaused, setAllMicrophonesPaused ] = useRecoilState(pauseAllMicrophonesState);
    const [ allCamerasPause, setAllCamerasPause ] = useRecoilState(pauseAllCamerasState);

    const GLOBAL_ICON_SIZE=`1.4rem`;

    const muteActions: GlobaActionsMenuItem[] = [
        {
            id: `global-action-toggle-all-microphones`,
            title: intl.formatMessage({
                id: allMicrophonesPaused ? `toggle_all_microphones_on` : `toggle_all_microphones_off`,
            }),
            icon: <MicFillIcon size={GLOBAL_ICON_SIZE} />,
            activeIcon: <MicDisabledIcon size={GLOBAL_ICON_SIZE} />,
            active: allMicrophonesPaused,
            onClick: () => setAllMicrophonesPaused(allMicrophonesPaused => !allMicrophonesPaused),
        },
        {
            id: `global-action-toggle-all-cameras`,
            title: intl.formatMessage({
                id: allCamerasPause ? `toggle_all_cameras_on` : `toggle_all_cameras_off`,
            }),
            icon: <CameraVideoFillIcon size={GLOBAL_ICON_SIZE} />,
            activeIcon: <CameraDisabledIcon size={GLOBAL_ICON_SIZE} />,
            active: allCamerasPause,
            onClick: () => setAllCamerasPause(allCamerasPaused => !allCamerasPaused),
        },
    ];

    return (
        <Fade in>
            <Grid
                container
                direction="column"
                className={clsx(classes.fullheight, {
                    [classes.rootSm]: isSmDown,
                })}
            >
                <Grid
                    item
                    className={classes.participants}
                >
                    <Typography className={classes.participantsTitle}>
                        <FormattedMessage
                            id="live.class.participant.title"
                            values={{
                                count: sessions.size,
                            }}
                        />
                    </Typography>
                    {hasControls && (
                        <>
                            {muteActions.map((action) => (
                                <Tooltip
                                    key={action.id}
                                    title={action.title ?? ``}
                                    placement="bottom"
                                >
                                    <ButtonBase
                                        disableRipple
                                        disableTouchRipple
                                        id={action.id}
                                        className={clsx(classes.globalMuteActionIcon, {
                                            [classes.active]: action.active,
                                        })}
                                        onClick={action.onClick}
                                    >
                                        {action.activeIcon ? ( action.active ? action.activeIcon : action.icon ) : action.icon}
                                    </ButtonBase>
                                </Tooltip>
                            ))}
                        </>
                    )}
                </Grid>
                <Grid
                    item
                    className={classes.gridContainerAll}
                >
                    {isTeacher ? (
                        <>
                            <Grid
                                item
                                className={classes.gridContainerTeachers}
                            >
                                {teachersSessions.length ? (
                                    <div className={clsx(classes.cameraGrid, {
                                        [classes.cameraGridTwoColumns]: isTeacher,
                                        [classes.cameraGridSingleTeacher]: isTeacher && teachersSessions.length === 1 && !isXsDown,
                                    })}
                                    >
                                        <ListUserCamera
                                            users={teachersSessions}
                                        />
                                    </div>
                                ) : (
                                    <NoItemList
                                        icon={<UserIcon />}
                                        text={intl.formatMessage({
                                            id: `no_teachers_connected`,
                                        })}
                                    />
                                )}
                            </Grid>
                            <Grid
                                item
                                xs
                                className={clsx({
                                    [classes.gridContainerStudents]: studentsSessions.length && !isSmDown,
                                })}
                            >
                                {studentsSessions.length ? (
                                    <div className={clsx(classes.cameraGrid, {
                                        [classes.cameraGridTwoColumns]: isTeacher,
                                    })}
                                    >
                                        <ListUserCamera users={studentsSessions} />
                                    </div>
                                ) : (
                                    <NoItemList
                                        icon={<UserIcon />}
                                        text={intl.formatMessage({
                                            id: `no_students_connected`,
                                        })}
                                    />
                                )}
                            </Grid>
                        </>
                    ) : (
                        <>
                            <Grid
                                item
                                className={classes.gridContainerTeachers}
                            >
                                {hostSession.length ? (
                                    <div className={classes.cameraGrid}>
                                        <ListUserCamera
                                            users={hostSession}
                                            minHeight={isXsDown ? 192 : undefined}
                                        />
                                    </div>
                                ) : (
                                    <NoItemList
                                        icon={<UserIcon />}
                                        text={intl.formatMessage({
                                            id: `no_teachers_connected`,
                                        })}
                                    />
                                )}
                            </Grid>
                            <Grid
                                item
                                xs
                                className={clsx({
                                    [classes.gridContainerStudents]: slicedSessions.length && !isSmDown,
                                })}
                            >
                                {slicedSessions.length ? (
                                    <div className={classes.cameraGrid}>
                                        <ListUserCamera
                                            users={slicedSessions}
                                            minHeight={isXsDown ? 192 : undefined}
                                        />
                                    </div>
                                ) : (
                                    <NoItemList
                                        icon={<UserIcon />}
                                        text={intl.formatMessage({
                                            id: `no_students_connected`,
                                        })}
                                    />
                                )}
                            </Grid>
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                margin={1}
                                marginTop={2}
                            >
                                <SidebarPagination
                                    currentPage={currentPage}
                                    pagesTotal={pagesTotal}
                                    handlePageChange={handlePageChange}
                                />
                            </Box>
                            {nonHostSessions.map(session => (
                                <UserAudio
                                    key={session.id}
                                    user={session}
                                />
                            ))}
                        </>
                    )}
                </Grid>
            </Grid>
        </Fade>
    );
}

const sessionComparator = (a: Session, b: Session) => {
    if (Boolean(a.isHost) !== Boolean(b.isHost)) {
        return Number(b.isHost) - Number(a.isHost);
    }

    return a.name.localeCompare(b.name);
};

const sessionWithTrackComparator = (a: SessionWithTrackState, b: SessionWithTrackState) => {
    if (Boolean(a.isTeacher) !== Boolean(b.isTeacher)) {
        return Number(b.isTeacher) - Number(a.isTeacher);
    }

    if (Boolean(a.isMine) !== Boolean(b.isMine)) {
        return Number(b.isMine) - Number(a.isMine);
    }

    if (Boolean(a.isTeacher) === Boolean(b.isTeacher)) {
        return Number(b.isConsumable) - Number(a.isConsumable);
    }

    return a.name.localeCompare(b.name);
};

export default TabParticipants;
