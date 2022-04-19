/* eslint-disable react/no-multi-comp */
import { InteractionPlayer } from "@/components/interactiveContent/InteractionPlayer";
import InteractionRecorder from "@/components/interactiveContent/InteractionRecorder";
import Loading from "@/components/interactiveContent/loading";
import {
    THEME_COLOR_GREY_200,
    THEME_COLOR_GREY_BORDER_FULLSCREEN,
    THEME_COLOR_NAME_FULLSCREEN,
} from "@/config";
import { useContent } from "@/data/live/state/useContent";
import { useSessions } from "@/data/live/state/useSessions";
import { Session } from "@/pages/utils";
import { useSessionContext } from "@/providers/session-context";
import { isShowContentLoadingState } from "@/store/layoutAtoms";
import { useContentToHref } from "@/utils/contentUtils";
import {
    NoItemList,
    toggleFullScreenById,
} from "@/utils/utils";
import { useSnackbar } from "@kl-engineering/kidsloop-px";
import {
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import { ArrowsAngleExpand as ExpandIcon } from "@styled-icons/bootstrap/ArrowsAngleExpand";
import { Book as PlanIcon } from "@styled-icons/boxicons-regular/Book";
import { Person as UserIcon } from "@styled-icons/fluentui-system-regular/Person";
import clsx from "clsx";
import React,
{
    useEffect,
    useMemo,
    useState,
} from "react";
import { useInViewport } from "react-in-viewport";
import { useIntl } from "react-intl";
import { useResizeDetector } from "react-resize-detector";
import { useRecoilValue } from "recoil";
import {
    ArrowsCompress,
    ArrowsExpand,
} from "styled-icons/foundation";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: `grid`,
        gridTemplateColumns: `repeat(2, 1fr)`,
        gridGap: 20,
        padding: 20,
    },
    rootFullScreen: {
        gridTemplateColumns: `repeat(1, 1fr)`,
        padding: 0,
        height: `100%`,
    },
    item:{
        minHeight: 260,
        background: THEME_COLOR_GREY_200,
        borderRadius: 12,
        boxShadow: `2px 2px 3px 1px rgb(0 0 0 / 5%)`,
        position: `relative`,
        padding: theme.spacing(0.5),
        display: `block`,
        "&:-webkit-full-screen": {
            width: `100vw`,
            height: `100vh`,
        },
    },
    hiddenItemFullScreen: {
        display: `none`,
    },
    fullHeight:{
        height: `100%`,
        overflowY: `auto`,
        width: `100%`,
    },
    centerContent:{
        display: `flex`,
        height: `100%`,
        alignItems: `center`,
        justifyContent: `center`,
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
        bottom: 0,
        right: 0,
        zIndex: 9,
        margin: 10,
        borderRadius: 10,
        width: 30,
        height: 30,
        cursor: `pointer`,
        alignItems: `center`,
        justifyContent: `center`,
        "&:hover":{
            opacity: 0.8,
        },
    },
    previewNameContainer: {
        position: `absolute`,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        left: 0,
        right: 0,
        zIndex: 9,
        paddingTop: theme.spacing(3),
    },
    previewName:{
        position: `absolute`,
        left: 0,
        bottom: 0,
        zIndex: 9,
        padding: `10px 20px`,
        background: `rgb(255 255 255 / 55%)`,
        fontWeight: theme.typography.fontWeightBold as number,
        borderRadius: `0 10px 0 0`,
        [theme.breakpoints.down(`sm`)]: {
            fontSize: `0.7rem`,
        },
    },
    previewNameFullScreen: {
        position: `static`,
        borderRadius: 10,
        color: theme.palette.common.white,
        background: THEME_COLOR_NAME_FULLSCREEN,
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

interface Props {
}

export default function Observe (props: Props) {
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const {
        sessionId,
        isTeacher,
        materials,
    } = useSessionContext();
    const content = useContent();
    const sessions = useSessions();
    const [ studentSessions, setStudentSessions ] = useState<Session[]>([]);
    const [ contentHref ] = useContentToHref(content);
    const [ isFullScreen, setFullScreen ] = useState(false);
    const [ sessionIdFullScreen, setSessionIdFullScreen ] = useState(``);

    useEffect(() => {
        if (!isTeacher){
            enqueueSnackbar(intl.formatMessage({
                id: `notification_observe_content_interactive`,
            }));
        }
    }, []);

    useEffect(() => {
        const students = [ ...sessions.values() ].filter((session) => !session.isTeacher);
        setStudentSessions(students);
    }, [ sessions, sessions.size ]);

    const studentModeFilterGroups = useMemo(() => {
        return [ sessionId ];
    }, [ sessionId ]);

    const handleFullScreen = (sessionId: string) => {
        setSessionIdFullScreen(isFullScreen ? `` : sessionId);
        setFullScreen(!isFullScreen);
    };

    if( !materials.length ){
        return(
            <NoItemList
                icon={<PlanIcon />}
                text={intl.formatMessage({
                    id: `lessonplan_content_noresults`,
                })}
            />
        );
    }

    if (isTeacher) {
        if (studentSessions.length) {
            return (
                <div className={classes.fullHeight}>
                    <div className={clsx(classes.root, {
                        [classes.rootFullScreen]: isFullScreen,
                    })}>
                        {studentSessions.map((session) => {
                            return (
                                <StudentPreviewCard
                                    key={session.id}
                                    session={session}
                                    sessionIdFullScreen={sessionIdFullScreen}
                                    isFullScreen={sessionIdFullScreen === session.id}
                                    onToggleFullScreen={handleFullScreen}
                                />
                            );
                        })}
                    </div>
                </div>
            );
        } else {
            return (
                <NoItemList
                    icon={<UserIcon />}
                    text={intl.formatMessage({
                        id: `no_students_connected`,
                    })}
                />
            );
        }
    } else {
        return (
            <>
                {content && (
                    <InteractionRecorder
                        contentHref={contentHref}
                        group={sessionId}
                        filterGroups={studentModeFilterGroups}
                    />
                )}
            </>
        );
    }

}

interface StudentPreviewCardProps {
    session: Session;
    isFullScreen?: boolean;
    sessionIdFullScreen?: string;
    onToggleFullScreen: (sessionId: string) => void;
}

function StudentPreviewCard (props: StudentPreviewCardProps) {
    const {
        session,
        isFullScreen,
        sessionIdFullScreen,
        onToggleFullScreen,
    } = props;
    const classes = useStyles();
    const {
        ref: cardRef,
        height: cardHeight = 0,
        width: cardWidth = 0,
    } = useResizeDetector<HTMLDivElement>();
    const [ loadingStreamId, setLoadingStreamId ] = useState<boolean>(true);
    const isShowContentLoading = useRecoilValue(isShowContentLoadingState);
    const { inViewport } = useInViewport(cardRef);

    const filterGroups = useMemo(() => {
        return [ session.id ];
    }, [ session ]);

    const loadStudentPreviewPlayer = () => {
        setLoadingStreamId(false);
    };

    useEffect(() => {
        setLoadingStreamId(true);
    }, [ isShowContentLoading ]);

    useEffect(() => {
        loadStudentPreviewPlayer();
    }, [ session.streamId ]);

    return (
        <div
            ref={cardRef}
            id={`observe:${session.streamId}`}
            className={clsx(classes.item, {
                [classes.hiddenItemFullScreen]: !isFullScreen && sessionIdFullScreen !== ``,
            })}
        >
            <div className={isFullScreen ? classes.previewNameContainer : ``}>
                <Typography className={clsx(classes.previewName, {
                    [classes.previewNameFullScreen]: isFullScreen,
                })}>{session.name}</Typography>
            </div>
            {session?.streamId
                ? (
                    <div className={classes.centerContent}>
                        <div
                            className={classes.previewExpand}
                            onClick={() => onToggleFullScreen(session.id)}>
                            {isFullScreen ? <ArrowsCompress size="1em" /> : <ArrowsExpand size="1em" />}
                        </div>
                        <InteractionPlayer
                            group={session.id}
                            loadingStreamId={loadingStreamId}
                            streamId={session?.streamId}
                            inViewport={inViewport}
                            filterGroups={filterGroups}
                            sizeConstraints={{
                                height: cardHeight,
                                width: cardWidth,
                            }}
                            isFullScreen={isFullScreen}
                        />
                    </div>
                )
                : (
                    <div className={classes.centerContent}>
                        <Loading messageId="Connecting student" />
                    </div>
                )
            }
        </div>
    );

}
