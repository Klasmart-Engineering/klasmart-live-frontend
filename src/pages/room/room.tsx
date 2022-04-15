import { useDeviceOrientationValue } from "@/app/model/appModel";
import background_study_blue from "@/assets/img/background/background_study.svg";
import Main from '@/components/main/main';
import Sidebar from '@/components/sidebar/sidebar';
import { useSessions } from "@/data/live/state/useSessions";
import { useHttpEndpoint } from "@/providers/region-select-context";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import {
    classActiveUserIdState,
    ClassInformation,
    classInfoState,
    hasControlsState,
    showEndStudyState,
} from "@/store/layoutAtoms";
import { classGetInformation } from "@/utils/utils";
import {
    Box,
    makeStyles,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import clsx from "clsx";
import React,
{
    useCallback,
    useEffect,
    useState,
} from 'react';
import {
    useRecoilValue,
    useSetRecoilState,
} from "recoil";

const useStyles = makeStyles(() => ({
    root: {
        height: `100%`,
        paddingBottom: `env(safe-area-inset-bottom)`,
        display: `flex`,
    },
    rootSafeArea:{
        paddingLeft: `env(safe-area-inset-left)`, // iPhone Notch
    },
    blueBackground: {
        backgroundImage: `url('${background_study_blue}')`,
        backgroundSize: `cover`,
        backgroundPosition: `left bottom`,
    },
}));

export function Room () {
    const classes = useStyles();
    const theme = useTheme();
    const isXsDown = useMediaQuery(theme.breakpoints.down(`xs`));

    const [ classInfo, setClassInfo ] = useState<ClassInformation>();
    const setRecoilClassInfo = useSetRecoilState(classInfoState);
    const setHasControls = useSetRecoilState(hasControlsState);
    const showEndStudy = useRecoilValue(showEndStudyState);
    const setClassActiveUserId = useSetRecoilState(classActiveUserIdState);
    const deviceOrientation = useDeviceOrientationValue();

    const {
        roomId,
        sessionId,
        classType,
        organizationId,
        scheduleId,
        user_id,
    } = useSessionContext();
    const sessions = useSessions();

    const cmsEndpoint = useHttpEndpoint(`cms`);

    useEffect(() => {
        if(classType !== ClassType.CLASSES) return;

        setClassActiveUserId(user_id);
    }, []);

    useEffect(() => {
        const teachers = [ ...sessions.values() ].filter(session => session.isTeacher === true).sort((a, b) => a.joinedAt - b.joinedAt);
        const host = teachers.find(session => session.isHost === true);
        if (host){
            host?.id === sessionId ? setHasControls(true) : setHasControls(false);
        }
    }, [ sessions.size, sessions ]);

    useEffect(() => {
        if (!classInfo?.room_id) return;

        const teachers = [ ...sessions.values() ].filter(session => session.isTeacher);
        const students = [ ...sessions.values() ].filter(session => !session.isTeacher);

        const newClassInfo = {
            ...classInfo,
            teachers: classInfo.teachers.map(teacher => ({
                ...teacher,
                isAbsent: !teachers.find(teacherInSession => teacher.name === teacherInSession.name),
            })),
            students: classInfo.students.map(student => ({
                ...student,
                isAbsent: !students.find(studentInSession => student.name === studentInSession.name),
            })),
        };

        setRecoilClassInfo(newClassInfo);
    }, [ sessions, classInfo ]);

    const updateClassInformation = useCallback(() => {
        classGetInformation(scheduleId, organizationId, cmsEndpoint)
            .then(classInformationData => {
                const dateOptions: Intl.DateTimeFormatOptions = {
                    year: `numeric`,
                    month: `2-digit`,
                    day: `2-digit`,
                    hour: `numeric`,
                    minute: `numeric`,
                    hour12: true,
                };

                const startAt = new Date(classInformationData.start_at * 1000).toLocaleString(`en-GB`, dateOptions);
                const endAt = new Date(classInformationData.end_at * 1000).toLocaleString(`en-GB`, dateOptions);

                const subject = classInformationData && classInformationData.subjects
                                && classInformationData.subjects.length > 0 ? classInformationData.subjects[0] : undefined;

                setClassInfo({
                    class_name: classInformationData.class?.name ?? `N/A`,
                    lesson_name: classInformationData.title,
                    room_id: roomId,
                    class_type: classInformationData.class_type,
                    teachers: classInformationData.class_roster_teachers ?? [],
                    students: classInformationData.class_roster_students ?? [],
                    program: classInformationData.program?.name ?? `N/A`,
                    subject: subject?.name ?? `N/A`,
                    lesson_plan: classInformationData.lesson_plan?.name ?? `N/A`,
                    materials: classInformationData.lesson_plan.materials?.length ?? 0,
                    start_at: startAt,
                    end_at: endAt,
                });

            }).catch(error => {
                console.error(error);
            });
    }, [
        cmsEndpoint,
        scheduleId,
        organizationId,
    ]);

    useEffect(() => {
        if (classType !== ClassType.LIVE) return;

        updateClassInformation();
    }, [ classType ]);

    return (
        <Box
            flexDirection={isXsDown ? `column` : `row`}
            className={clsx(classes.root, {
                [classes.blueBackground]: classType === ClassType.STUDY || showEndStudy,
                [classes.rootSafeArea]: deviceOrientation === `landscape-primary`,
            })}
        >
            <Main />
            {classType === ClassType.LIVE && (
                <Sidebar />
            )}
        </Box>
    );
}
