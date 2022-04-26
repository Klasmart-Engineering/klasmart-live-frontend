import ListUserCamera from "@/components/sidebar/listUserCamera/listUserCamera";
import { useSessions } from "@/data/live/state/useSessions";
import { Session } from "@/pages/utils";
import { useSessionContext } from "@/providers/session-context";
import { NoItemList } from "@/utils/utils";
import {
    Fade,
    Grid,
    makeStyles,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { Person as UserIcon } from "@styled-icons/fluentui-system-regular/Person";
import clsx from "clsx";
import React,
{ useMemo } from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles(() => ({
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
}));

function TabParticipants () {
    const classes = useStyles();
    const intl = useIntl();
    const sessions = useSessions();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));
    const { isTeacher } = useSessionContext();

    const studentsSessions = useMemo(() => [ ...sessions.values() ]
        .filter(s => !s.isTeacher)
        .sort(sessionComparator), [ sessions ]);

    const teachersSessions = useMemo(() => [ ...sessions.values() ]
        .filter(s => s.isTeacher)
        .sort(sessionComparator), [ sessions ]);

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
                    ) : <NoItemList
                        icon={<UserIcon />}
                        text={intl.formatMessage({
                            id: `no_teachers_connected`,
                        })}
                    />}
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
