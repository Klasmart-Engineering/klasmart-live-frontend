import { pauseAllMicrophonesState, pauseAllCamerasState } from "@/components/toolbar/toolbarMenus/globalActionsMenu/globalActionsMenu";
import UserCameraBackground from "@/components/userCamera/UserCameraBackground";
import NoCamera from "@/components/userCamera/noCamera";
import UserCamera from "@/components/userCamera/UserCamera";
import UserCameraActions from "@/components/userCamera/userCameraActions";
import UserCameraDetails from "@/components/userCamera/userCameraDetails";
import { useSessions } from "@/data/live/state/useSessions";
import { Session } from "@/pages/utils";
import { useSessionContext } from "@/providers/session-context";
import { useStream } from "@kl-engineering/live-state/ui";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React,
{ useEffect,
    useMemo,
    useRef,
useState } from "react";
import { useInViewport } from "react-in-viewport";
import { useRecoilValue } from "recoil";
import { useResizeDetector } from "react-resize-detector";

const SMALL_ITEM_WIDTH_LIMIT = 180;
const LARGE_ITEM_WIDTH_LIMIT = 280;
const EXTRA_LARGE_ITEM_WIDTH_LIMIT = 380;

type ItemWidthVariant = "small" | "medium" | "large" | "extra large";

const PAUSE_CAMERA_TIMEOUT = 3000;

const useStyles = makeStyles(() => ({
    root: {
        borderRadius: 12,
        transform: `translateZ(0)`, // Apply border-radius for Safari
        width: `100%`,
        height: `100%`,
        minHeight: 96,
        margin: `0 auto`,
        alignItems: `center`,
        textAlign: `center`,
        position: `relative`,
        overflow: `hidden`,
        outline: `0px solid rgba(20,100,200,0.5)`,
        transition: `outline-width 100ms linear`,
    },
    rootExtraLarge:{
        minHeight: 200,
        "& $userCameraRoot":{
            objectFit: "contain"
        }
    },
    rootLarge:{
        minHeight: 192,
        "& $userCameraRoot":{
            objectFit: "cover"
        }
    },
    rootMedium:{
        minHeight: 96,
        "& $userCameraRoot":{
            objectFit: "cover"
        }
    },
    rootSmall:{
        minHeight: 100,
        "& $userCameraRoot":{
            objectFit: "contain"
        }
    },
    userCameraRoot:{
        objectFit: "contain"
    }
}));

interface ItemUserCameraProps extends React.HTMLAttributes<HTMLDivElement> {
    user: Session;
}

function ItemUserCamera ({ user, className, ...rest }: ItemUserCameraProps) {
    const classes = useStyles();
    const [ isHover, setIsHover ] = useState(false);

    const { audio, video } = useStream(user.id);
    const mySession = useSessionContext();
    const isSelf = (user.id === mySession.sessionId);

    const sessions = useSessions();
    const userSession = sessions.get(user.id);

    const localSession = sessions.get(mySession.sessionId);
    const pauseAllMicrophones = useRecoilValue(pauseAllMicrophonesState);
    useEffect(() => {
        if(!localSession?.isHost || !mySession.isTeacher || userSession?.isTeacher) { return; }
        audio.globalPause.execute(pauseAllMicrophones);
    }, [
        localSession?.isHost,
        pauseAllMicrophones,
        audio.track,
    ]);

    const pauseAllCameras = useRecoilValue(pauseAllCamerasState);
    useEffect(() => {
        if(!localSession?.isHost || !mySession.isTeacher || userSession?.isTeacher) { return; }
        video.globalPause.execute(pauseAllCameras);
    }, [
        localSession?.isHost,
        pauseAllCameras,
        video.track,
    ]);

    const {
        ref: itemRef,
        width: itemWidth = 0
    } = useResizeDetector<HTMLDivElement>();

    const itemWidthVariant = useMemo<ItemWidthVariant>(() => {
        if(itemWidth < SMALL_ITEM_WIDTH_LIMIT)
            return `small`;
        else if(itemWidth >= SMALL_ITEM_WIDTH_LIMIT && itemWidth < LARGE_ITEM_WIDTH_LIMIT)
            return `medium`;
            else if(itemWidth >= LARGE_ITEM_WIDTH_LIMIT && itemWidth < EXTRA_LARGE_ITEM_WIDTH_LIMIT)
            return `large`;
        return `extra large`;
    }, [itemWidth]);

    const { inViewport } = useInViewport(itemRef);
    const pauseCameraTimeout = useRef<NodeJS.Timeout>();
    useEffect(() => {
        if (isSelf || userSession?.isHost) return;
        if (inViewport) {
            if (pauseCameraTimeout.current) {
                clearTimeout(pauseCameraTimeout.current);
            }
            video.pause.execute(false);
        } else {
            pauseCameraTimeout.current = setTimeout(() => {
                video.pause.execute(true);
            }, PAUSE_CAMERA_TIMEOUT);
        }

        return () => {
            if (pauseCameraTimeout.current) {
                clearTimeout(pauseCameraTimeout.current);
            }
        };
    }, [ inViewport, userSession?.isHost ]);
    
    return (
        <div ref={itemRef}
            className={clsx(className, classes.root, {
                [classes.rootExtraLarge]: itemWidthVariant === `extra large`,
                [classes.rootLarge]: itemWidthVariant === `large`,
                [classes.rootMedium]: itemWidthVariant === `medium`,
                [classes.rootSmall]: itemWidthVariant === `small`,
            })}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            {...rest}
        >
            <UserCameraBackground/>
            <UserCamera 
                user={user} 
                className={clsx(classes.userCameraRoot)} />
            {
                !video.isConsumable &&
                <NoCamera
                    name={user.name}
                />
            }
            <UserCameraDetails
                user={user}
                mic={audio}
            />
            {
                isHover &&
                <UserCameraActions
                    user={user}
                    expanded={video.isConsumable && !process.env.IS_CORDOVA_BUILD}
                    mic={audio}
                    camera={video}
                />
            }
        </div>
    );
}

export default ItemUserCamera;
