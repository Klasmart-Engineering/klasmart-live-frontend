import backgroundStudy from "../../assets/img/background/background_study.jpg";
import { ClassType } from "../../store/actions";
import Main from '../components/main/main';
import Sidebar from '../components/sidebar/sidebar';
import { MUTATION_SET_HOST } from "../components/utils/graphql";
import {
    LIVE_LINK, LocalSessionContext, SFU_LINK,
} from '../providers/providers';
import { RoomContext } from "../providers/roomContext";
import {
    GLOBAL_MUTE_MUTATION, GLOBAL_MUTE_QUERY, GlobalMuteNotification, WebRTCContext,
} from "../providers/WebRTCContext";
import {
    hasControlsState, isLessonPlanOpenState, studyRecommandUrlState,
} from "../states/layoutAtoms";
import { useMutation, useQuery } from "@apollo/client";
import {
    Grid, makeStyles, Theme, useMediaQuery, useTheme,
} from '@material-ui/core';
import React, {
    useContext, useEffect, useState,
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
    const [ isLessonPlanOpen, setIsLessonPlanOpen ] = useRecoilState(isLessonPlanOpenState);
    const [ studyRecommandUrl, setStudyRecommandUrl ] = useRecoilState(studyRecommandUrlState);

    const [ camerasOn, setCamerasOn ] = useState(true);
    const [ micsOn, setMicsOn ] = useState(true);

    const {
        roomId, sessionId, classtype, org_id,
    } = useContext(LocalSessionContext);
    const { sessions } = useContext(RoomContext);
    const webrtc = useContext(WebRTCContext);

    const localSession = sessions.get(sessionId);

    const [ hostMutation ] = useMutation(MUTATION_SET_HOST, {
        context: {
            target: LIVE_LINK,
        },
    });

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

    // TODO :
    // 1) Change the settimeout logic ? (added because it is conflicting with the give room controls logic)
    // 2) Move to a provider ?
    let setDefaultHost:any;

    useEffect(() => {
        setDefaultHost = setTimeout(function (){
            const teachers = [ ...sessions.values() ].filter(session => session.isTeacher === true).sort((a, b) => a.joinedAt - b.joinedAt);
            const host = teachers.find(session => session.isHost === true);
            if (!host && teachers.length) {
                const hostId = teachers[0].id;
                hostMutation({
                    variables: {
                        roomId,
                        hostId,
                    },
                });
                hostId === sessionId ? setHasControls(true) : setHasControls(false);
            }
        }, 1000);

        return function cleanup (){
            clearTimeout(setDefaultHost);
        };
    }, [ sessions.size ]);

    useEffect(() => {
        const teachers = [ ...sessions.values() ].filter(session => session.isTeacher === true).sort((a, b) => a.joinedAt - b.joinedAt);
        const host = teachers.find(session => session.isHost === true);
        host?.id === sessionId ? setHasControls(true) : setHasControls(false);
    }, [ sessions ]);

    useEffect(() => {
        if(classtype === ClassType.STUDY){
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
