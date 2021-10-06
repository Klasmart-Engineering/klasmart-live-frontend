import Loading from "../components/loading";
import {
    Content,
    Message,
    Session,
} from "../pages/utils";
import { ClassType } from "../store/actions";
import {
    audioGloballyMutedState,
    classEndedState,
    hasControlsState,
    InteractiveMode,
    interactiveModeState,
    isChatOpenState,
    isShowContentLoadingState,
    materialActiveIndexState,
    streamIdState,
    unreadMessagesState,
    videoGloballyMutedState,
} from "../store/layoutAtoms";
import {
    MUTATION_SEND_STUDENT_USAGE_RECORD_EVENT,
    MUTATION_SHOW_CONTENT,
} from "../utils/graphql";
import {
    defineContentId,
    defineContentType,
} from "../utils/utils";
import {
    LIVE_LINK,
    LocalSessionContext,
    SFU_LINK,
} from "./providers";
import { GLOBAL_MUTE_QUERY } from "./WebRTCContext";
import {
    gql,
    useMutation,
    useQuery,
    useSubscription,
} from "@apollo/client";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { useSnackbar } from "kidsloop-px";
import React,
{
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";
import { useRecoilState } from "recoil";

const SUB_ROOM = gql`
    subscription room($roomId: ID!, $name: String) {
        room(roomId: $roomId, name: $name) {
            message { id, message, session { name, isTeacher } },
            content { type, contentId },
            join { id, name, streamId, isTeacher, isHost, joinedAt },
            leave { id },
            session { webRTC { sessionId, description, ice, stream { name, streamId } } },
            sfu,
            trophy { from, user, kind },
        }
    }
`;

export interface RoomContextInterface {
    sfuAddress: string;
    messages: Map<string, Message>;
    content: Content | undefined;
    sessions: Map<string, Session>;
    trophy: any;
    audioGloballyMuted: boolean;
    videoGloballyMuted: boolean;
}

const defaultRoomContext = {
    sfuAddress: ``,
    messages: new Map<string, Message>(),
    content: undefined,
    sessions: new Map<string, Session>(),
    trophy: undefined,
    audioGloballyMuted: false,
    videoGloballyMuted: false,
};

export const RoomContext = createContext<RoomContextInterface>(defaultRoomContext);
export const RoomProvider = (props: {children: React.ReactNode}) => {
    const intl = useIntl();
    const {
        roomId,
        name,
        sessionId,
        camera,
        isTeacher,
        materials,
        classtype,
    } = useContext(LocalSessionContext);
    const [ sfuAddress, setSfuAddress ] = useState<string>(``);
    const [ messages, setMessages ] = useState<Map<string, Message>>(new Map<string, Message>());
    const [ content, setContent ] = useState<Content>();
    const [ sessions, setSessions ] = useState<Map<string, Session>>(new Map<string, Session>());
    const [ trophy, setTrophy ] = useState();
    const [ classEnded, setClassEnded ] = useRecoilState(classEndedState);
    const [ unreadMessages, setUnreadMessages ] = useRecoilState(unreadMessagesState);
    const [ isChatOpen, setIsChatOpen ] = useRecoilState(isChatOpenState);
    const [ isShowContentLoading, setIsShowContentLoading ] = useRecoilState(isShowContentLoadingState);
    const [ audioGloballyMuted, setAudioGloballyMuted ] = useRecoilState(audioGloballyMutedState);
    const [ videoGloballyMuted, setVideoGloballyMuted ] = useRecoilState(videoGloballyMutedState);
    const { enqueueSnackbar } = useSnackbar();

    const [ materialActiveIndex, setMaterialActiveIndex ] = useRecoilState(materialActiveIndexState);
    const [ streamId, setStreamId ] = useRecoilState(streamIdState);
    const [ interactiveMode, setInteractiveMode ] = useRecoilState(interactiveModeState);
    const [ hasControls, setHasControls ] = useRecoilState(hasControlsState);

    const [ showContent, { loading: loadingShowContent } ] = useMutation(MUTATION_SHOW_CONTENT, {
        context: {
            target: LIVE_LINK,
        },
    });

    const [ sendStudentUsageRecordEvent ] = useMutation(MUTATION_SEND_STUDENT_USAGE_RECORD_EVENT, {
        context: {
            target: LIVE_LINK,
        },
    });
    useEffect(() => {
        setIsShowContentLoading(loadingShowContent);
    }, [ loadingShowContent ]);

    useEffect(() => {
        if (!hasControls) return;
        const material = interactiveMode !== InteractiveMode.OnStage && materialActiveIndex >= 0 && materialActiveIndex < materials.length ? materials[materialActiveIndex] : undefined;
        const type = defineContentType(material, interactiveMode);
        const contentId = defineContentId(material, interactiveMode, streamId, sessionId);

        showContent({
            variables: {
                roomId,
                type,
                contentId,
            },
        });
    }, [
        hasControls,
        streamId,
        materialActiveIndex,
        interactiveMode,
    ]);

    useEffect(() => {
        if (hasControls && interactiveMode === InteractiveMode.OnStage && classtype === ClassType.LIVE) return;
        if (!hasControls && classtype !==  ClassType.STUDY) return;
        const material = materials?.[materialActiveIndex];
        const materialUrl = material?.url;
        const activityTypeName = material?.__typename === `Iframe` ? `h5p` : material?.__typename;
        sendStudentUsageRecordEvent({
            variables: {
                roomId,
                materialUrl,
                activityTypeName,
            },
        });
    }, [
        materialActiveIndex,
        interactiveMode,
        hasControls,
    ]);

    useEffect(() => {
        isChatOpen && setUnreadMessages(0);
    }, [ isChatOpen, messages ]);

    useEffect(() => {
        fetchGlobalMute();
    }, [ audioGloballyMuted, videoGloballyMuted ]);

    const { loading, error } = useSubscription(SUB_ROOM, {
        onSubscriptionData: ({ subscriptionData }) => {
            if (!subscriptionData?.data?.room) { return; }
            const {
                message,
                content,
                join,
                leave,
                session,
                sfu,
                trophy,
            } = subscriptionData.data.room;
            if (sfu) { setSfuAddress(sfu); }
            if (message) { addMessage(message); }
            if (content) { setContent(content); }
            if (join) { userJoin(join); }
            if (leave) { userLeave(leave); }
            if (trophy) {
                if (trophy.from === trophy.user || trophy.user === sessionId || trophy.from === sessionId) {
                    setTrophy(trophy);
                }
            }
        },
        variables: {
            roomId,
            name,
        },
        context: {
            target: LIVE_LINK,
        },
    });

    const addMessage = (newMessage: Message) => {
        // for (const id of messages.keys()) {
        //     if (messages.size < 32) { break; }
        //     setMessages((prev) => {
        //         const newState = new Map(prev);
        //         newState.delete(id);
        //         return newState;
        //     });
        // }

        if(!isChatOpen){
            const now = Date.now() - 5000;
            const messageTime = Number(newMessage.id.split(`-`)[0]);

            if(camera && now <= messageTime){
                enqueueSnackbar(intl.formatMessage({
                    id: `notification_user_sent_message`,
                }, {
                    user: newMessage.session.name,
                }));
            }
            setUnreadMessages(unreadMessages + 1);
        }
        setMessages(prev => new Map(prev.set(newMessage.id, newMessage)));
    };

    const userJoin = (join: Session) => {
        console.log(`flag1 userJoin: `, join.streamId);
        const now = Date.now() - 5000;
        const newSession = !sessions.has(join.id);
        setSessions(prev => new Map(prev.set(join.id, join)));

        if(newSession && isTeacher && sessionId !== join.id && now <= join.joinedAt){
            enqueueSnackbar(intl.formatMessage({
                id: `notification_user_joined`,
            }, {
                user: join.name,
            }));
        }
    };

    const userLeave = (leave: Session) => {
        const user = sessions.get(leave.id);

        setSessions((prev) => {
            const newState = new Map(prev);
            newState.delete(leave.id);
            return newState;
        });

        if(leave.id === sessionId){
            setClassEnded(true);
        }

        if(isTeacher && user){
            enqueueSnackbar(intl.formatMessage({
                id: `notification_user_left`,
            }, {
                user: user.name,
            }));
        }
    };

    const { refetch: refetchGlobalMute } = useQuery(GLOBAL_MUTE_QUERY, {
        variables: {
            roomId,
        },
        context: {
            target: SFU_LINK,
        },
    });

    const fetchGlobalMute = async () => {
        const { data: globalMuteData } = await refetchGlobalMute();
        setAudioGloballyMuted(globalMuteData.retrieveGlobalMute.audioGloballyMuted);
        setVideoGloballyMuted(globalMuteData.retrieveGlobalMute.videoGloballyDisabled);
    };

    const value = {
        sfuAddress,
        messages,
        content,
        sessions,
        trophy,
        audioGloballyMuted,
        videoGloballyMuted,
    };

    if (loading || !content) { return <Grid
        container
        alignItems="center"
        style={{
            height: `100%`,
        }}><Loading messageId="loading" /></Grid>; }
    if (error) { return <Typography><FormattedMessage id="failed_to_connect" />{JSON.stringify(error)}</Typography>; }
    return <RoomContext.Provider value={value} >
        {props.children}
    </RoomContext.Provider>;
};
