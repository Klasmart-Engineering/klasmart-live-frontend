import { useSessionContext } from "../session-context";
import { ConferenceContextProvider } from "./conferenceContext";
import Loading from "@/components/loading";
import { ReadTrophyDto } from "@/data/live/dto/readRoomDto";
import { useSendStudentUsageRecordMutation } from "@/data/live/mutations/useSendStudentUsageRecordMutation";
import { useShowContentMutation } from "@/data/live/mutations/useShowContentMutation";
import { useRoomSubscription } from "@/data/live/subscriptions/useRoomSubscription";
import { SfuServiceApolloClient } from "@/data/sfu/sfuServiceApolloClient";
import {
    Content,
    InteractiveMode,
    Message,
    Session,
} from "@/pages/utils";
import { ClassType } from "@/store/actions";
import {
    classEndedState,
    hasControlsState,
    interactiveModeState,
    isChatOpenState,
    isShowContentLoadingState,
    materialActiveIndexState,
    streamIdState,
    unreadMessagesState,
} from "@/store/layoutAtoms";
import {
    defineContentId,
    defineContentType,
} from "@/utils/utils";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { useSnackbar } from "kidsloop-px";
import React,
{
    createContext,
    useEffect,
    useState,
} from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";
import { useRecoilState } from "recoil";
import {useToolbarContext} from "kidsloop-canvas/lib/components/toolbar/toolbar-context-provider";

interface Props {
    enableConferencing: boolean;
}

export interface RoomContextInterface {
    sfuAddress: string;
    messages: Map<string, Message>;
    content: Content | undefined;
    sessions: Map<string, Session>;
    trophy?: ReadTrophyDto;
}

const defaultRoomContext = {
    sfuAddress: ``,
    messages: new Map<string, Message>(),
    content: undefined,
    sessions: new Map<string, Session>(),
    trophy: undefined,
};

export const RoomContext = createContext<RoomContextInterface>(defaultRoomContext);
export const RoomProvider: React.FC<Props> = ({ children, enableConferencing }) => {
    const intl = useIntl();
    const {
        roomId,
        name,
        sessionId,
        camera,
        isTeacher,
        materials,
        classType,
        token,
    } = useSessionContext();
    const [ sfuAddress, setSfuAddress ] = useState<string>(``);
    const [ messages, setMessages ] = useState<Map<string, Message>>(new Map<string, Message>());
    const [ content, setContent ] = useState<Content>();
    const [ sessions, setSessions ] = useState<Map<string, Session>>(new Map<string, Session>());
    const [ trophy, setTrophy ] = useState<ReadTrophyDto>();
    const [ currentConnection, setCurrentConnection ] = useState<ConnectionType>();
    const [ , setClassEnded ] = useRecoilState(classEndedState);
    const [ unreadMessages, setUnreadMessages ] = useRecoilState(unreadMessagesState);
    const [ isChatOpen ] = useRecoilState(isChatOpenState);
    const [ , setIsShowContentLoading ] = useRecoilState(isShowContentLoadingState);
    const { enqueueSnackbar } = useSnackbar();

    const [ materialActiveIndex ] = useRecoilState(materialActiveIndexState);
    const [ streamId ] = useRecoilState(streamIdState);
    const [ interactiveMode ] = useRecoilState(interactiveModeState);
    const [ hasControls ] = useRecoilState(hasControlsState);

    const [ showContent, { loading: loadingShowContent } ] = useShowContentMutation();

    const [ sendStudentUsageRecordEvent ] = useSendStudentUsageRecordMutation();

    const { actions: { clear } } = useToolbarContext();

    useEffect(() => {
        setIsShowContentLoading(loadingShowContent);
    }, [ loadingShowContent ]);

    useEffect(() => {
        if (!hasControls) return;
        if (interactiveMode === InteractiveMode.SCREENSHARE) return; // Prevent duplicated showContent

        const material = interactiveMode !== InteractiveMode.ONSTAGE && materialActiveIndex >= 0 && materialActiveIndex < materials.length ? materials[materialActiveIndex] : undefined;
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
        if (hasControls && interactiveMode === InteractiveMode.ONSTAGE && classType === ClassType.LIVE) return;
        if (!hasControls && classType !==  ClassType.STUDY) return;
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
        const connectionType = (navigator as any).connection?.type;
        setCurrentConnection(connectionType);
    }, []);

    useEffect(() => {
        window.onbeforeunload = () => {
            try {
                clear([sessionId]);
            }catch (err) {
                console.error(err);
            }
        }
    }, []);

    useEffect(() => {
        try {
            if(isTeacher)
                clear();
            else {
                clear([sessionId]);
            }
        }catch (err) {
            console.error(err);
        }}, [content, interactiveMode, materialActiveIndex]);

    const isConnectionTypeChange = () => {
        if(!currentConnection) return;
        const connectionType =  (navigator as any).connection?.type;
        if (connectionType !== currentConnection && connectionType !== `none`) return true;
        return false;
    };

    const { loading, error } = useRoomSubscription({
        onSubscriptionData: ({ subscriptionData }) => {
            if (!subscriptionData?.data?.room) { return; }
            const {
                message,
                content,
                join,
                leave,
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

            const connectionType = (navigator as any).connection?.type;
            if(currentConnection !== connectionType){
                setCurrentConnection(connectionType);
            }
        },
        variables: {
            roomId,
            name,
        },
    });

    const addMessage = (newMessage: Message) => {
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
        if(leave.id === sessionId && isConnectionTypeChange()) return;
        const user = sessions.get(leave.id);

        setSessions((prev) => {
            const newState = new Map(prev);
            newState.delete(leave.id);
            return newState;
        });

        if(leave.id === sessionId){
            clear([sessionId]);
            setClassEnded(true);
        }

        if(isTeacher && user){
            clear([user.id]);
            enqueueSnackbar(intl.formatMessage({
                id: `notification_user_left`,
            }, {
                user: user.name,
            }));
        }
    };

    const value = {
        sfuAddress,
        messages,
        content,
        sessions,
        trophy,
    };

    if (loading || !content) {
        return (
            <Grid
                container
                alignItems="center"
                style={{
                    height: `100%`,
                }}
            >
                <Loading messageId="loading" />
            </Grid>
        );
    }

    if (error) {
        return (
            <Typography>
                <FormattedMessage id="failed_to_connect" />{JSON.stringify(error)}
            </Typography>
        );
    }

    return (
        <RoomContext.Provider value={value}>
            { enableConferencing ?
                <SfuServiceApolloClient
                    token={token}
                    sessionId={sessionId}
                    roomId={roomId}
                >
                    <ConferenceContextProvider
                        roomId={roomId}
                    >
                        {children}
                    </ConferenceContextProvider>
                </SfuServiceApolloClient> :
                <>
                    {children}
                </>

            }
        </RoomContext.Provider>
    );
};
