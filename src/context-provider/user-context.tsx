import React, { createContext, ReactChild, ReactChildren, useContext, useMemo, useState } from "react"
import { LessonMaterial } from "../lessonMaterialContext";
import { parseTokenParams } from "../utils/parseTokenUtils";

export interface IUserContext {
    teacher: boolean,
    materials: LessonMaterial[]
    roomId: string,
    sessionId: string,
    name?: string,
    token?: string,
    setName: React.Dispatch<React.SetStateAction<string | undefined>>
    setToken: React.Dispatch<React.SetStateAction<string | undefined>>
}

const UserContext = createContext<IUserContext>({ setName: () => null, setToken: () => null, roomId: "", materials: [], teacher: false, sessionId: "" });

type Props = {
    children?: ReactChild | ReactChildren | null
    sessionId: string
}

// TODO: Somehow unify this with the user-information-context as the name and state
// overlap. Some state kept by this user-context might not be relevant for this 
// context though, like the selected camera stream.
export function UserContextProvider({ children, sessionId }: Props) {
    const [token, setToken] = useState<string>();

    const [selectedName, setSelectedName] = useState<string>();
    const [selectedCamera, setSelectedCamera] = useState<MediaStream>();

    const userContext = useMemo<IUserContext>(() => {
        const params = parseTokenParams(token);

        let parsedTokenState = {
            roomId: "",
            teacher: false,
            materials: [],
        };

        if (params) {
            parsedTokenState = {
                roomId: params.roomId,
                teacher: params.teacher,
                materials: params.materials,
            }
        }

        const localContextState = {
            camera: selectedCamera,
            setCamera: setSelectedCamera,
            name: selectedName,
            setName: setSelectedName,
            token,
            sessionId,
            setToken,
        };
        
        return { ...localContextState, ...parsedTokenState }
    }, [selectedCamera, setSelectedCamera, selectedName, setSelectedName, token]);

    return (
        <UserContext.Provider value={userContext}>
            { children }
        </UserContext.Provider>
    )
}

export function useUserContext() {
    return useContext(UserContext);
}