
import { parseTokenParams } from "@/app/utils/parseTokenUtils";
import { AuthTokenProvider } from "@/services/auth-token/AuthTokenProvider";
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

export interface ISessionContext {
    isTeacher: boolean;
    materials: LessonMaterial[];
    roomId: string;
    sessionId: string;
    organizationId: string;
    scheduleId: string;
    classType: string; // "live" | "class" | "study" | "task"
    name?: string;
    token?: string;
    camera?: MediaStream;
    setName: React.Dispatch<React.SetStateAction<string | undefined>>;
    setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
    setCamera: React.Dispatch<React.SetStateAction<MediaStream | undefined>>;
}

const SessionContext = createContext<ISessionContext>({
    setCamera: () => null,
    setName: () => null,
    setToken: () => null,
    roomId: ``,
    materials: [],
    isTeacher: false,
    sessionId: ``,
    organizationId: ``,
    scheduleId: ``,
    classType: ``,
});

type Props = {
    children?: ReactChild | ReactChildren | null;
    sessionId: string;
}

export function SessionContextProvider ({ children, sessionId }: Props) {
    const [ token, setToken ] = useState<string>();

    const [ selectedName, setSelectedName ] = useState<string>();
    const [ selectedCamera, setSelectedCamera ] = useState<MediaStream>();

    useEffect(()=>{
        const authToken = AuthTokenProvider.retrieveToken();
        if(!authToken) return;

        setToken(authToken);
    }, []);

    const userContext = useMemo<ISessionContext>(() => {
        const params = parseTokenParams(token);

        let parsedTokenState = {
            roomId: ``,
            isTeacher: false,
            materials: [],
            organizationId: ``,
            scheduleId: ``,
            classType: `live`,
        };

        if (params) {
            parsedTokenState = {
                roomId: params.roomId,
                isTeacher: params.teacher,
                materials: params.materials,
                organizationId: params.org_id,
                classType: params.classtype,
                scheduleId: params.schedule_id,
            };
        }

        const localContextState = {
            camera: selectedCamera,
            setCamera: setSelectedCamera,
            name: params ? params.name : selectedName,
            setName: setSelectedName,
            token,
            sessionId,
            setToken,
        };

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
