
import { parseTokenParams } from "@/app/utils/parseTokenUtils";
import { AuthTokenProvider } from "@/services/auth-token/AuthTokenProvider";
import { ClassType } from "@/store/actions";
import { hasJoinedClassroomState } from "@/store/layoutAtoms";
import { LessonMaterial } from "@/types/lessonMaterial";
import React,
{
    createContext,
    ReactChild,
    ReactChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useRecoilValue } from "recoil";
import { v4 as uuid } from "uuid";

interface Teacher {
    id: string;
    name: string;
}

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
    type: ``,
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
    title?: string;
    teachers?: Teacher[];
    dueDate?: number;
    startTime?: number;
    type?: string;
    setName: React.Dispatch<React.SetStateAction<string | undefined>>;
    setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
    setTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
    setTeachers: React.Dispatch<React.SetStateAction<Teacher[] | undefined>>;
    setDueDate: React.Dispatch<React.SetStateAction<number | undefined>>;
    setStartTime: React.Dispatch<React.SetStateAction<number | undefined>>;
    renewSessionId: () => void;
}

const SessionContext = createContext<ISessionContext>({
    setName: () => null,
    setToken: () => null,
    setTitle: () => null,
    setTeachers: () => null,
    setDueDate: () => null,
    setStartTime: () => null,
    renewSessionId: () => null,
    ...DEFAULT_SESSION_CONTEXT,
});

type Props = {
    children?: ReactChild | ReactChildren | null;
}

export function SessionContextProvider ({ children }: Props) {
    const [ sessionId, setSessionId ] = useState(uuid());
    const [ sessionIdHasBeenUsed, setSesionIdHasBeenUsed ] = useState(false);
    const hasJoinedClassroom = useRecoilValue(hasJoinedClassroomState);
    const [ token, setToken ] = useState(() => AuthTokenProvider.retrieveToken()??undefined);

    const [ selectedName, setSelectedName ] = useState<string>();
    const [ selectedCamera, setSelectedCamera ] = useState<MediaStream>();

    const [ title, setTitle ] = useState<string>();
    const [ startTime, setStartTime ] = useState<number>();
    const [ teachers, setTeachers ] = useState<Teacher[]>();
    const [ dueDate, setDueDate ] = useState<number>();

    const renewSessionId = useCallback(() => {
        if(!sessionIdHasBeenUsed) return;
        setSesionIdHasBeenUsed(false);
        const newSessionId = uuid();
        setSessionId(newSessionId);
    }, [ sessionIdHasBeenUsed ]);

    useEffect(() => {
        if(!hasJoinedClassroom) return;
        setSesionIdHasBeenUsed(true);
    }, [ hasJoinedClassroom ]);

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
            title,
            teachers,
            dueDate,
            startTime,
            setToken,
            setTitle,
            setTeachers,
            setDueDate,
            setStartTime,
            renewSessionId,
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
                type: params.type,
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
        title,
        dueDate,
        teachers,
        startTime,
        sessionId,
        renewSessionId,
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
