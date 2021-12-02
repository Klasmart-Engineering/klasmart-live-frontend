import { useDeviceOrientationValue } from "@/app/model/appModel";
import backgroundStudy from "@/assets/img/background/background_study.jpg";
import Main from '@/components/main/main';
import Sidebar from '@/components/sidebar/sidebar';
import { useSessions } from "@/data/live/state/useSessions";
import { useHttpEndpoint } from "@/providers/region-select-context";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import {
    ClassInformation,
    classInfoState,
    hasControlsState,
    studyRecommandUrlState,
} from "@/store/layoutAtoms";
import { classGetInformation } from "@/utils/utils";
import {
    Grid,
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
import { useSetRecoilState } from "recoil";

const qs = require(`qs`);

const useStyles = makeStyles(() => ({
    root: {
        height: `100vh`,
        paddingBottom: `env(safe-area-inset-bottom)`,
    },
    rootSafeArea:{
        paddingLeft: `env(safe-area-inset-left)`, // iPhone Notch
    },
    study: {
        backgroundImage: `url('${backgroundStudy}')`,
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
    const setStudyRecommandUrl = useSetRecoilState(studyRecommandUrlState);
    const deviceOrientation = useDeviceOrientationValue();

    const {
        roomId,
        sessionId,
        classType,
        organizationId,
        scheduleId,
    } = useSessionContext();
    const sessions = useSessions();

    function ramdomInt (min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    const cmsEndpoint = useHttpEndpoint(`cms`);

    const getAllLessonMaterials = useCallback(async () => {
        const headers = new Headers();
        headers.append(`Accept`, `application/json`);
        headers.append(`Content-Type`, `application/json`);
        const encodedParams = qs.stringify({
            publish_status: `published`,
            order_by: `update_at`,
            content_type: 1,
            organizationId,
        }, {
            encodeValuesOnly: true,
        });
        const response = await fetch(`${cmsEndpoint}/v1/contents?${encodedParams}`, {
            headers,
            method: `GET`,
        });
        if (response.status === 200) { return response.json(); }

    }, [ cmsEndpoint ]);

    async function fetchEverything () {
        async function fetchAllLessonMaterials () {
            const payload = await getAllLessonMaterials();
            const matList = payload.list;
            const dnds = matList.filter((mat: any) => {
                const obj = JSON.parse(mat.data);
                return obj.file_type === 5;
            });
            let randomIdx: number;
            if (dnds.length === 0) {
                randomIdx = ramdomInt(0, matList.length - 1);
                const data = JSON.parse(matList[randomIdx].data);
                setStudyRecommandUrl(`/h5p/play/${data.source}`);
            } else {
                randomIdx = ramdomInt(0, dnds.length - 1);
                const data = JSON.parse(dnds[randomIdx].data);
                setStudyRecommandUrl(`/h5p/play/${data.source}`);
            }
        }
        try {
            await Promise.all([ fetchAllLessonMaterials() ]);
        } catch (err) {
            console.error(`Fail to fetchAllLessonMaterials in Study: ${err}`);
            setStudyRecommandUrl(``);
        }
    }

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

    const handleClassGetInformation = async () => {
        try {
            const dataR = await classGetInformation(scheduleId, organizationId, cmsEndpoint);
            const dateOption = {
                year: `numeric`,
                month: `2-digit`,
                day: `2-digit`,
                hour: `numeric`,
                minute: `numeric`,
                hour12: true,
            } as const;

            setClassInfo({
                class_name: dataR.class.name,
                lesson_name: dataR.title,
                room_id: `${roomId}`,
                class_type: dataR.class_type,
                teachers: dataR.class_roster_teachers,
                students: dataR.class_roster_students,
                program: dataR.program.name,
                subject: dataR.subjects[0].name,
                lesson_plan: dataR.lesson_plan.name,
                materials: dataR.lesson_plan.materials.length,
                start_at: new Date(dataR.start_at*1000).toLocaleString(`en-GB`, dateOption),
                end_at: new Date(dataR.end_at*1000).toLocaleString(`en-GB`, dateOption),
            });
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if (classType === ClassType.LIVE) {
            handleClassGetInformation();
        }

        if (classType === ClassType.STUDY) {
            if (organizationId) {
                fetchEverything();
            }
        }
    }, [ classType ]);

    return (
        <Grid
            container
            direction={isXsDown ? `column` : `row`}
            className={clsx(classes.root, {
                [classes.study] : classType === ClassType.STUDY,
                [classes.rootSafeArea] : deviceOrientation === `landscape-primary`,
            })}
        >
            <Grid
                item
                xs>
                <Main />
            </Grid>
            {classType === ClassType.LIVE &&
                <Grid item>
                    <Sidebar />
                </Grid>
            }
        </Grid>
    );
}
