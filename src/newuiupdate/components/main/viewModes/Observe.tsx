import { ContentType, Session } from "../../../../pages/room/room";
import { LIVE_LINK, LocalSessionContext } from "../../../providers/providers";
import { RoomContext } from "../../../providers/roomContext";
import { hasControlsState,  materialActiveIndexState } from "../../../states/layoutAtoms";
import { Whiteboard } from "../../../whiteboard/components/Whiteboard";
import { useSynchronizedState } from "../../../whiteboard/context-providers/SynchronizedStateProvider";
import { MUTATION_SHOW_CONTENT } from "../../utils/graphql";
import { PreviewPlayer } from "../../utils/interactiveContent/previewPlayer";
import { RecordedIframe } from "../../utils/interactiveContent/recordediframe";
import { fullScreenById } from "../../utils/utils";
import { useMutation } from "@apollo/client";
import {
    makeStyles, Theme,  Typography,
} from "@material-ui/core";
import { ArrowsAngleExpand as ExpandIcon } from "@styled-icons/bootstrap/ArrowsAngleExpand";
import { CloudOffline as OfflineIcon } from "@styled-icons/ionicons-outline/CloudOffline";
import clsx from "clsx";
import { useSnackbar } from "kidsloop-px";
import React, {
    useContext, useEffect, useMemo, useRef, useState,
} from "react";
import { useIntl } from "react-intl";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: `grid`,
        gridTemplateColumns: `repeat(2, 1fr)`,
        gridGap: 20,
        padding: 20,
    },
    item:{
        minHeight: 260,
        background: theme.palette.background.paper,
        borderRadius: 12,
        boxShadow: `2px 2px 3px 1px rgb(0 0 0 / 5%)`,
        position: `relative`,

        "&:-webkit-full-screen": {
            width: `100vw`,
            height: `100vh`,
        },
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
    previewPlayerContainer:{
        "&:hover $previewExpand":{
            opacity: 1,
            visibility: `visible`,
        },
    },
    previewExpand:{
        opacity: 0,
        visibility: `hidden`,
        display: `flex`,
        position: `absolute`,
        top: 0,
        left: 0,
        zIndex: 9,
        margin: 10,
        borderRadius: 10,
        width: 30,
        height: 30,
        cursor: `pointer`,
        background: theme.palette.grey[300],
        alignItems: `center`,
        justifyContent: `center`,
        "&:hover":{
            opacity: 0.8,
        },
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
    studentWrap: {
        // position: `relative`,
        // width: `100%`,
    },
    studentWrapItem: {
        position: `absolute`,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: `block`,
    },
    studentWrapItemBoard: {
        zIndex: 2,
        pointerEvents: `none`,

        '&.active': {
            pointerEvents: `auto`,
        },
    },
    studentWrapItemContent: {
        zIndex: 1,

        '&:before': {
            content: ``,
            display: `block`,
            paddingTop: `100%`,
        },
    },
}));

function Observe () {
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const {
        materials, sessionId, roomId, isTeacher,
    } = useContext(LocalSessionContext);
    const { content, sessions } = useContext(RoomContext);
    const [ studentSessions, setStudentSessions ] = useState<Session[]>([]);
    const [ hasControls, setHasControls ] = useRecoilState(hasControlsState);
    const [ materialActiveIndex, setMaterialActiveIndex ] = useRecoilState(materialActiveIndexState);
    const material = materialActiveIndex >= 0 && materialActiveIndex < materials.length ? materials[materialActiveIndex] : undefined;
    const { state: { display: isGlobalCanvasEnabled, permissions: permissionsGlobalCanvas } } = useSynchronizedState();

    const [ showContent, { loading: loadingShowContent } ] = useMutation(MUTATION_SHOW_CONTENT, {
        context: {
            target: LIVE_LINK,
        },
    });

    useEffect(() => {
        if(!isTeacher){
            enqueueSnackbar(intl.formatMessage({
                id: `notification_observe_content_interactive`,
            }));
        }
    }, []);

    useEffect(() => {
        const students = [ ...sessions.values() ].filter(session => session.isTeacher !== true);
        setStudentSessions(students);
    }, [ sessions, sessions.size ]);

    useEffect(() => {
        if (hasControls && material) {
            showContent({
                variables: {
                    roomId,
                    type: ContentType.Activity,
                    contentId: material.url,
                },
            });
        }
    }, [ material ]);

    const studentModeFilterGroups = useMemo(() => {
        return [ sessionId ];
    }, [ sessionId ]);

    if(isTeacher){
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
    }else{
        return(
            <div className={classes.studentWrap}>
                <div className={clsx(classes.studentWrapItem, classes.studentWrapItemBoard, {
                    [`active`] :  permissionsGlobalCanvas.allowCreateShapes && isGlobalCanvasEnabled,
                })}>
                    <Whiteboard
                        group={sessionId}
                        uniqueId="student"
                        filterGroups={studentModeFilterGroups} />
                </div>
                <div className={`${classes.studentWrapItem} ${classes.studentWrapItemContent}`}>
                    {content && <RecordedIframe contentId={content.contentId}  />}
                </div>
            </div>
        );
    }

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
            {session?.streamId ?
                <>
                    <Whiteboard
                        group={session.id}
                        uniqueId={session.id}
                        filterGroups={filterGroups} />
                    <div className={classes.previewPlayerContainer}>
                        <div
                            className={classes.previewExpand}
                            onClick={() => fullScreenById(`observe:${session.streamId}`) }>
                            <ExpandIcon size="0.75em" />
                        </div>
                        <PreviewPlayer
                            width={width}
                            height={height}
                            container={`observe:${session.streamId}`}
                            streamId={session?.streamId} />
                    </div>
                </> :
                <div className={classes.previewLoader}>
                    <OfflineIcon size="3em"/>
                </div>
            }

        </div>
    );

}