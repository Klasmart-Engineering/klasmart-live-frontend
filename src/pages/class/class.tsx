import backgroundStudy from "../../assets/img/background/background_study.jpg";
import Sidebar from '../../components/sidebar/sidebar';
import Main from '../../newuiupdate/components/main/main';
import {
    LIVE_LINK,
    LocalSessionContext,
    SFU_LINK,
} from '../../providers/providers';
import { RoomContext } from "../../providers/roomContext";
import {
    GLOBAL_MUTE_MUTATION,
    GLOBAL_MUTE_QUERY,
    GlobalMuteNotification,
    WebRTCContext,
} from "../../providers/WebRTCContext";
import { ClassType } from "../../store/actions";
import {
    classInfoState,
    hasControlsState,
    studyRecommandUrlState,
} from "../../store/layoutAtoms";
import { MUTATION_SET_HOST } from "../../utils/graphql";
import { classGetInformation } from "../../utils/utils";
import {
    useMutation,
    useQuery,
} from "@apollo/client";
import {
    Grid,
    makeStyles,
    Theme,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import React,
{
    useContext,
    useEffect,
    useState,
} from 'react';
import { useRecoilState } from "recoil";

const qs = require(`qs`);

const useStyles = makeStyles((theme: Theme) => ({
    study: {
        backgroundImage: `url('${backgroundStudy}')`,
        backgroundSize: `cover`,
        backgroundPosition: `left bottom`,
    },
}));

function Class () {
    const classes = useStyles();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));

    const [ hasControls, setHasControls ] = useRecoilState(hasControlsState);
    const [ studyRecommandUrl, setStudyRecommandUrl ] = useRecoilState(studyRecommandUrlState);
    const [ classInfo, setClassInfo ] = useRecoilState(classInfoState);

    const [ camerasOn, setCamerasOn ] = useState(true);
    const [ micsOn, setMicsOn ] = useState(true);

    const {
        roomId,
        sessionId,
        classtype,
        org_id,
        schedule_id,
    } = useContext(LocalSessionContext);
    const { sessions } = useContext(RoomContext);
    const webrtc = useContext(WebRTCContext);

    const localSession = sessions.get(sessionId);

    const [ globalMuteMutation ] = useMutation(GLOBAL_MUTE_MUTATION, {
        context: {
            target: SFU_LINK,
        },
    });

    const { refetch: refetchGlobalMute } = useQuery(GLOBAL_MUTE_QUERY, {
        variables: {
            roomId,
        },
        context: {
            target: SFU_LINK,
        },
    });

    function ramdomInt (min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // https://swagger-ui.kidsloop.net/#/content/searchContents
    async function getAllLessonMaterials () {
        const CMS_ENDPOINT = `${process.env.ENDPOINT_CMS}`;
        const headers = new Headers();
        headers.append(`Accept`, `application/json`);
        headers.append(`Content-Type`, `application/json`);
        const encodedParams = qs.stringify({
            publish_status: `published`,
            order_by: `update_at`,
            content_type: 1,
            org_id,
        }, {
            encodeValuesOnly: true,
        });
        const response = await fetch(`${CMS_ENDPOINT}/v1/contents?${encodedParams}`, {
            headers,
            method: `GET`,
        });
        if (response.status === 200) { return response.json(); }
    }

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
        } finally { }
    }

    useEffect(() => {
        const teachers = [ ...sessions.values() ].filter(session => session.isTeacher === true).sort((a, b) => a.joinedAt - b.joinedAt);
        const host = teachers.find(session => session.isHost === true);
        if (host){
            host?.id === sessionId ? setHasControls(true) : setHasControls(false);
        }
    }, [ sessions.size, sessions ]);

    const handleClassGetInformation = async () => {
        try {
            const dataR = await classGetInformation(schedule_id, org_id);
            const dateOption = {
                year: `numeric`,
                month: `2-digit`,
                day: `2-digit`,
                hour: `numeric`,
                minute: `numeric`,
                hour12: true,
            };

            setClassInfo({
                class_name: dataR.class.name,
                lesson_name: dataR.title,
                room_id: `${roomId}`,
                class_type: dataR.class_type,
                enrolled_participants: `${dataR.class_roster_students.length > 1 ? dataR.class_roster_students.length+` students` : dataR.class_roster_students.length+` student`}, ${dataR.class_roster_teachers.length > 1 ? dataR.class_roster_teachers.length+` teachers` : dataR.class_roster_teachers.length+` teacher`}`,
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
        if (classtype === ClassType.LIVE) {
            handleClassGetInformation();
        }

        if (classtype === ClassType.STUDY) {
            if (org_id) {
                fetchEverything();
            }
        }
    }, [ classtype ]);

    const enforceGlobalMute = async () => {
        const { data } = await refetchGlobalMute();
        const videoGloballyDisabled = data?.retrieveGlobalMute?.videoGloballyDisabled;
        if (videoGloballyDisabled) {
            toggleVideoStates(videoGloballyDisabled);
        }
        const audioGloballyMuted = data?.retrieveGlobalMute?.audioGloballyMuted;
        if (audioGloballyMuted) {
            toggleAudioStates(audioGloballyMuted);
        }
    };

    useEffect(() => {
        enforceGlobalMute();
    }, [
        roomId,
        localSession?.isHost,
        webrtc?.inboundStreams.size,
    ]);

    async function toggleVideoStates (isOn?: boolean) {
        const notification: GlobalMuteNotification = {
            roomId,
            audioGloballyMuted: undefined,
            videoGloballyDisabled: isOn ?? camerasOn,
        };
        const data = await globalMuteMutation({
            variables: notification,
        });
        const videoGloballyDisabled = data?.data?.updateGlobalMute?.videoGloballyDisabled;
        if (videoGloballyDisabled != null) {
            setCamerasOn(!videoGloballyDisabled);
        }
    }

    async function toggleAudioStates (isOn?: boolean) {
        const notification: GlobalMuteNotification = {
            roomId,
            audioGloballyMuted: isOn ?? micsOn,
            videoGloballyDisabled: undefined,
        };
        const data = await globalMuteMutation({
            variables: notification,
        });
        const audioGloballyMuted = data?.data?.updateGlobalMute?.audioGloballyMuted;
        if (audioGloballyMuted != null) {
            setMicsOn(!audioGloballyMuted);
        }
    }

    return (
        <Grid
            container
            direction={isSmDown ? `column` : `row`}
            className={classtype === ClassType.STUDY ? classes.study : undefined}
        >
            <Grid
                item
                xs>
                <Main />
            </Grid>
            {classtype === ClassType.LIVE &&
                <Grid item>
                    <Sidebar />
                </Grid>
            }
        </Grid>
    );
}

export default Class;
