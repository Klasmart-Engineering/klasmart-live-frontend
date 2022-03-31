
import { parseTokenParams } from "@/app/utils/parseTokenUtils";
import { AuthTokenProvider } from "@/services/auth-token/AuthTokenProvider";
import { ClassType } from "@/store/actions";
import { LessonMaterial } from "@/types/lessonMaterial";
import React,
{
    createContext,
    ReactChild,
    ReactChildren,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

const DEFAULT_SESSION_CONTEXT = {
    roomId: ``,
    materials: [],
    isTeacher: false,
    sessionId: ``,
    organizationId: ``,
    scheduleId: ``,
    classType: ClassType.LIVE,
    user_id: ``,
    isReview: false,
};

export interface ISessionContext {
    isTeacher: boolean;
    materials: LessonMaterial[];
    roomId: string;
    sessionId: string;
    organizationId: string;
    scheduleId: string;
    classType: ClassType; // "live" | "class" | "study" | "task"
    name?: string;
    token?: string;
    user_id?: string;
    isReview?: boolean;
    setName: React.Dispatch<React.SetStateAction<string | undefined>>;
    setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const SessionContext = createContext<ISessionContext>({
    setName: () => null,
    setToken: () => null,
    ...DEFAULT_SESSION_CONTEXT,
});

type Props = {
    children?: ReactChild | ReactChildren | null;
    sessionId: string;
}

export function SessionContextProvider ({ children, sessionId }: Props) {
    const [ token, setToken ] = useState<string>();

    const [ selectedName, setSelectedName ] = useState<string>();
    const [ selectedCamera, setSelectedCamera ] = useState<MediaStream>();

    useEffect(() => {
        const authToken = AuthTokenProvider.retrieveToken();
        if(!authToken) return;

        setToken(authToken);
    }, []);

    const userContext = useMemo<ISessionContext>(() => {
        const params = parseTokenParams(token);

        const localContextState = {
            camera: selectedCamera,
            setCamera: setSelectedCamera,
            name: params ? params.name : selectedName,
            setName: setSelectedName,
            token,
            sessionId,
            setToken,
        };

        const parsedTokenState = params
            ? {
                roomId: params.roomId,
                isTeacher: params.teacher,
                materials: params.materials,
                organizationId: params.org_id,
                scheduleId: params.schedule_id,
                classType: params.classtype as ClassType,
                user_id: params.user_id,
                isReview: params.is_review,
            }
            : DEFAULT_SESSION_CONTEXT;

        return {
            ...localContextState,
            ...parsedTokenState,
        };
    }, [
        selectedCamera,
        setSelectedCamera,
        selectedName,
        setSelectedName,
        token,
    ]);

    return (
        <SessionContext.Provider value={userContext}>
            { children }
        </SessionContext.Provider>
    );
}

export function useSessionContext () {
    return useContext(SessionContext);
}
