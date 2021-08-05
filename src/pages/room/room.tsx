import { LocalSessionContext } from "../../entry";
import {
    setContentIndex,
    setDrawerTabIndex,
} from "../../store/reducers/control";
import {
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import React,
{
    useContext,
    useEffect,
    useState,
} from "react";
import { useDispatch } from "react-redux";

export enum ContentType {
    Blank = `Blank`,
    Stream = `Stream`,
    Activity = `Activity`,
    Video = `Video`,
    Audio = `Audio`,
    Image = `Image`,
    Camera = `Camera`,
    Screen = `Screen`,
}

// TODO create a new file for enums
export enum InteractiveMode {
    Blank,
    Present,
    Observe,
    ShareScreen,
}
export interface Session {
    id: string;
    name?: string;
    streamId?: string;
    isTeacher?: boolean;
    isHost?: boolean;
    joinedAt: number;
}

export interface Content {
    type: ContentType;
    contentId: string;
}

export interface Message {
    id: string;
    message: string;
    session: Session;
}
export interface InteractiveModeState {
    interactiveMode: number;
    setInteractiveMode: React.Dispatch<React.SetStateAction<number>>;
}

export interface StreamIdState {
    streamId: string | undefined;
    setStreamId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export function Room (): JSX.Element {
    const { classtype } = useContext(LocalSessionContext);
    const dispatch = useDispatch();

    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));

    const [ interactiveMode, setInteractiveMode ] = useState<number>(0);
    const [ streamId, setStreamId ] = useState<string>();

    useEffect(() => {

        dispatch(setDrawerTabIndex(0));
        dispatch(setContentIndex(0));
    }, []);

    return(<div>to delete</div>);
}
