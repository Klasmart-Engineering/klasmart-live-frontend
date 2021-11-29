import UserCamera from "@/components/userCamera/userCamera";
import { useSessions } from "@/data/live/state/useSessions";
import { Session } from "@/pages/utils";
import { NoItemList } from "@/utils/utils";
import {
    Fade,
    Grid,
    makeStyles,
    Theme,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { Person as UserIcon } from "@styled-icons/fluentui-system-regular/Person";
import clsx from "clsx";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";
import { useRecoilState } from "recoil";
import {
    classInfoState,
} from "../../../store/layoutAtoms";

const useStyles = makeStyles((theme: Theme) => ({
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
    cameraGridSingleTeacher:{
        gridTemplateColumns: `1fr`,
        minHeight: `150px`,
        padding: `0 52px`,
    },
    gridContainerTeachers:{
        marginBottom: `15px`,
    },
    gridContainerStudents: {
        overflowX : `hidden`,
        overflowY : `auto`,
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

    const [ studentsSessions, setStudentsSessions ] = useState<Session[]>([]);
    const [ teachersSessions, setTeachersSessions ] = useState<Session[]>([]);
    const [ classInfo, setClassInfo ] = useRecoilState(classInfoState);

    useEffect(() => {
        if(!classInfo.room_id) return; //Skip the default classInfo

        const teachers = [ ...sessions.values() ].filter(session => session.isTeacher === true);
        setTeachersSessions(teachers);
        const students = [ ...sessions.values() ].filter(session => session.isTeacher !== true);
        setStudentsSessions(students);

        const studentsInClass = classInfo.students.filter(student => !student.isAbsent);
        if(studentsInClass.length === students.length) return;

        let newClassInfo = {
            ...classInfo,
            students: classInfo.students.map(studentInfo => ({
                ...studentInfo,
                isAbsent : !students.find(student => student.name === studentInfo.name)
            }))
        };

        setClassInfo(newClassInfo);

    }, [ sessions, classInfo ]);

    return (
        <Fade in>
            <Grid
                container
                direction="column"
                className={clsx(classes.fullheight, {
                    [classes.rootSm] : isSmDown,
                })}>
                <Grid
                    item
                    className={classes.gridContainerTeachers}>
                    {teachersSessions.length ? (
                        <div className={clsx(classes.cameraGrid, {
                            [classes.cameraGridSingleTeacher] : teachersSessions.length === 1,
                        })}>
                            {teachersSessions.map((user) => (
                                <UserCamera
                                    key={user.id}
                                    user={user} />
                            ))}
                        </div>
                    ) : <NoItemList
                        icon={<UserIcon />}
                        text={intl.formatMessage({
                            id: `no_teachers_connected`,
                        })} />}
                </Grid>
                <Grid
                    item
                    xs
                    className={clsx({
                        [classes.gridContainerStudents]: studentsSessions.length && !isSmDown,
                    })}>
                    {studentsSessions.length ? (
                        <div className={classes.cameraGrid}>
                            {studentsSessions.map((user) => (
                                <UserCamera
                                    key={user.id}
                                    user={user} />
                            ))}
                        </div>
                    ) : (
                        <NoItemList
                            icon={<UserIcon />}
                            text={intl.formatMessage({
                                id: `no_students_connected`,
                            })} />
                    )}
                </Grid>
            </Grid>
        </Fade>
    );
}

export default TabParticipants;
