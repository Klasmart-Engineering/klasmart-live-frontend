import ListUserCamera from "@/components/sidebar/listUserCamera/listUserCamera";
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
import { NoItemList } from "@/utils/utils";
import {
    Fade,
    Grid,
    makeStyles,
    Theme,
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
{ useMemo } from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";
import {
    useRecoilState,
    useRecoilValue,
} from "recoil";

const useStyles = makeStyles((theme) => ({
    rootSm:{
        padding: `0 10px`,
        "& $cameraGridSingleTeacher":{
            padding: `0`,
            minHeight: `auto`,
        },
        "& $cameraGrid":{
            gridTemplateColumns: `1fr`,
        },
    },
    cameraGrid: {
        display: `grid`,
        gridTemplateColumns: `1fr 1fr`,
        gridGap: `10px`,
    },
    studentCameraGrid: {
        display: `grid`,
        gridTemplateColumns: `1fr`,
        gridGap: `10px`,
    },
    cameraGridSingleTeacher:{
        gridTemplateColumns: `1fr`,
        minHeight: `150px`,
        padding: `0 52px`,
    },
    gridContainerTeachers:{
        marginBottom: `15px`,
    },
    gridContainerStudents: {
        marginBottom: -10,
        paddingBottom: 10,
    },
    fullheight: {
        height: `100%`,
    },
    participants: {
        display: `flex`,
        alignItems: `center`,
        marginBottom: theme.spacing(1),
        flexWrap: `wrap`,
    },
    globalMuteActionIcon:{
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
    const { isTeacher } = useSessionContext();
    const hasControls = useRecoilValue(hasControlsState);

    const studentsSessions = useMemo(() => [ ...sessions.values() ]
        .filter(s => !s.isTeacher)
        .sort(sessionComparator), [ sessions ]);

    const teachersSessions = useMemo(() => [ ...sessions.values() ]
        .filter(s => s.isTeacher)
        .sort(sessionComparator), [ sessions ]);

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
                    [classes.rootSm] : isSmDown,
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
                                    <div
                                        id={action.id}
                                        className={clsx(classes.globalMuteActionIcon, {
                                            [classes.active]: action.active,
                                        })}
                                        onClick={action.onClick}
                                    >
                                        {action.activeIcon ? ( action.active ? action.activeIcon : action.icon ) : action.icon}
                                    </div>
                                </Tooltip>
                            ))}
                        </>
                    )}
                </Grid>
                <Grid
                    item
                    className={classes.gridContainerTeachers}
                >
                    {teachersSessions.length ? (
                        <div className={clsx(classes.cameraGrid, {
                            [classes.cameraGridSingleTeacher] : isTeacher && teachersSessions.length === 1,
                            [classes.studentCameraGrid]: !isTeacher,
                        })}
                        >
                            <ListUserCamera users={teachersSessions} />
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
                        <div className={clsx({
                            [classes.studentCameraGrid]: !isTeacher,
                            [classes.cameraGrid]: isTeacher,
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
            </Grid>
        </Fade>
    );
}

const sessionComparator = (a: Session, b: Session) => {
    if (Boolean(a.isHost) !== Boolean(b.isHost)) {
        return a.isHost ? 1 : -1;
    }

    return a.name.localeCompare(b.name);
};

export default TabParticipants;
