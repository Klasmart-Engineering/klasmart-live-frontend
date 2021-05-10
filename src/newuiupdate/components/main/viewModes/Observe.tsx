import { MaterialTypename } from "../../../../lessonMaterialContext";
import { ContentType, Session } from "../../../../pages/room/room";
import { LIVE_LINK, LocalSessionContext } from "../../../providers/providers";
import { RoomContext } from "../../../providers/roomContext";
import {
    hasControlsState, interactiveModeState, isLessonPlanOpenState, materialActiveIndexState, streamIdState,
} from "../../../states/layoutAtoms";
import { MUTATION_SHOW_CONTENT } from "../../utils/graphql";
import ActivityImage from "../../utils/interactiveContent/image";
import { PreviewPlayer } from "../../utils/interactiveContent/previewPlayer";
import { RecordedIframe } from "../../utils/interactiveContent/recordediframe";
import { fullScreenById } from "../../utils/utils";
import { useMutation } from "@apollo/client";
import {
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Grid, Hidden, makeStyles, Theme, Tooltip, Typography, useTheme,
} from "@material-ui/core";
import { ArrowsAngleExpand as ExpandIcon } from "@styled-icons/bootstrap/ArrowsAngleExpand";
import { Eye as ObserveIcon } from "@styled-icons/fa-regular/Eye";
import { CloudOffline as OfflineIcon } from "@styled-icons/ionicons-outline/CloudOffline";
import React, {
    useContext, useEffect, useMemo, useRef, useState,
} from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: `grid`,
        gridTemplateColumns: `repeat(2, 1fr)`,
        gridGap: 20,
        padding: 20,
    },
    item:{
        minHeight: 180,
        background: theme.palette.background.paper,
        borderRadius: 12,
        boxShadow: `2px 2px 3px 1px rgb(0 0 0 / 5%)`,
        position: `relative`,
    },
    fullHeight:{
        height: `100%`,
        overflowY: `auto`,
        width: `100%`,
    },
    previewLoader:{
        display: `flex`,
        height: `100%`,
        alignItems: `center`,
        justifyContent: `center`,
    },
    previewExpand:{
        position: `absolute`,
        top: 0,
        left: 0,
        zIndex: 9,
        margin: 10,
        padding: 10,
        borderRadius: 10,
        cursor: `pointer`,
        background: `rgb(255 255 255 / 55%)`,
    },
    previewName:{
        position: `absolute`,
        left: 0,
        bottom: 0,
        zIndex: 9,
        padding: `10px 20px`,
        background: `rgb(255 255 255 / 55%)`,
        fontWeight: 600,
        borderRadius: `0 10px 0 0`,
    },
}));

function Observe () {
    const classes = useStyles();

    const {
        materials, sessionId, roomId,
    } = useContext(LocalSessionContext);
    const { content, sessions } = useContext(RoomContext);
    const [ studentSessions, setStudentSessions ] = useState<Session[]>([]);

    const [ hasControls, setHasControls ] = useRecoilState(hasControlsState);

    const [ materialActiveIndex, setMaterialActiveIndex ] = useRecoilState(materialActiveIndexState);
    const [ interactiveMode, setInteractiveMode ] = useRecoilState(interactiveModeState);
    const [ streamId, setStreamId ] = useRecoilState(streamIdState);

    const material = materialActiveIndex >= 0 && materialActiveIndex < materials.length ? materials[materialActiveIndex] : undefined;

    const [ showContent, { loading: loadingShowContent } ] = useMutation(MUTATION_SHOW_CONTENT, {
        context: {
            target: LIVE_LINK,
        },
    });

    useEffect(() => {
        setMaterialActiveIndex(0);
    }, []);

    useEffect(() => {
        const students = [ ...sessions.values() ].filter(session => session.isTeacher !== true);
        setStudentSessions(students);
    }, [ sessions, sessions.size ]);

    useEffect(() => {
        if (material) {
            showContent({
                variables: {
                    roomId,
                    type: ContentType.Activity,
                    contentId: material.url,
                },
            });
        }
    }, [
        // roomId,
        // interactiveMode,
        material,
        // streamId,
        // sessionId,
    ]);

    if(hasControls){
        return(
            <div className={classes.fullHeight}>
                <div className={classes.root}>
                    {studentSessions.map(session =>
                        <StudentPreviewCard
                            key={session.id}
                            session={session} />)}
                </div>
            </div>
        );
    }

    if(content && content.type === ContentType.Activity){
        return (
            <RecordedIframe contentId={content.contentId}  />
        );

    }

    if(content && content.type === ContentType.Image){
        return (
            <ActivityImage material={material?.url} />
        );
    }

    return(null);
}

export default Observe;

function StudentPreviewCard ({ session }: { session: Session }) {
    const classes = useStyles();

    const cardConRef = useRef<HTMLDivElement>(null);
    const [ width, setWidth ] = useState<number>(0);
    const [ height, setHeight ] = useState<number>(0);

    const filterGroups = useMemo(() => {
        return [ session.id ];
    }, [ session ]);

    useEffect(() => {
        if (cardConRef.current) {
            const contWidth = cardConRef.current.getBoundingClientRect().width;
            const contHeight = cardConRef.current.getBoundingClientRect().height;
            setWidth(contWidth);
            setHeight(contHeight);
        }
    }, []);

    return (
        <div
            ref={cardConRef}
            id={`observe:${session.streamId}`}
            className={classes.item}
        >
            <Typography className={classes.previewName}>{session.name}</Typography>
            {session?.streamId ?  <>
                <div
                    className={classes.previewExpand}
                    onClick={() => fullScreenById(`preview:${session.streamId}`) }>
                    <ExpandIcon size="0.75em" />
                </div>
                <PreviewPlayer
                    width={width}
                    height={height}
                    container={`observe:${session.streamId}`}
                    streamId={session?.streamId} /></> : <div className={classes.previewLoader}><OfflineIcon size="3em"/>
            </div>}

        </div>
    );

}
