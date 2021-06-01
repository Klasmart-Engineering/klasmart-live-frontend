import React, { useState, useEffect, useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import IframeResizer from "iframe-resizer-react";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";

import ArrowBackIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIcon from '@material-ui/icons/ArrowForwardIos';
import { DoorOpen as ExitIcon } from "@styled-icons/bootstrap/DoorOpen";

import { WBToolbarContainer, WB_TOOLBAR_MAX_HEIGHT } from "./WBToolbar"
import { State } from "../../store/store";
import { ClassType } from "../../store/actions";
import { Whiteboard } from "../../whiteboard/components/Whiteboard-new";
import { setContentIndex } from "../../store/reducers/control";
import { ResizedIframe, ImageFrame } from "../resizedContent";
import { LessonMaterial, MaterialTypename } from "../../lessonMaterialContext";
import { ReplicatedMedia } from "../../pages/synchronized-video";
import { useSessionContext } from "../../context-provider/session-context";
import { useMaterialToHref } from "../../utils/contentUtils";
import StyledFAB from "../styled/fabButton";
import { RoomContext } from "../../providers/RoomContext";
import StyledIcon from "../styled/icon";

export const DRAWER_TOOLBAR_WIDTH = 64;

export function ClassContentContainer({ materialKey, recommendUrl }: {
    materialKey: number,
    recommendUrl?: string,
}) {
    const { classType: classtype } = useSessionContext();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
    const drawerOpen = useSelector((state: State) => state.control.drawerOpen);

    return (
        <Grid
            id="class-content-container"
            component="main"
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            item xs={drawerOpen ? 9 : 12}
            key={materialKey}
            style={{
                padding: isSmDown ? theme.spacing(1) : theme.spacing(2),
                paddingRight: (isSmDown ? theme.spacing(1) : theme.spacing(2)) + (classtype === ClassType.STUDY ? 0 : DRAWER_TOOLBAR_WIDTH),
            }}
        >
            <ClassContent recommendUrl={recommendUrl} />
            <WBToolbarContainer />
        </Grid>
    )
}

function ClassContent({ recommendUrl }: {
    recommendUrl?: string
}) {
    const { classType: classtype, isTeacher, materials } = useSessionContext();
    const { exitRoom } = useContext(RoomContext);

    const theme = useTheme();

    const rootDivRef = useRef<HTMLDivElement>(null);

    const forStudent = classtype === ClassType.STUDY || !isTeacher;

    const dispatch = useDispatch();
    const contentIndex = useSelector((store: State) => store.control.contentIndex);

    const [currentMaterial, setCurrentMaterial] = useState<LessonMaterial>(materials[0]);
    useEffect(()=>{
        if (contentIndex >= 0 && contentIndex < materials.length){
            setCurrentMaterial(materials[contentIndex])
        } else {
            return
        }
    }, [contentIndex])

    const [contentHref] = useMaterialToHref(currentMaterial);

    return (
        <Grid
            id="class-content"
            item xs={12}
            style={{
                maxWidth: "100%",
                height: `calc(100% - ${WB_TOOLBAR_MAX_HEIGHT}px)`,
                maxHeight: `calc(100% - ${WB_TOOLBAR_MAX_HEIGHT}px)`,
                overflow: "hidden",
                // overflowY: interactiveMode === 2 ? "auto" : "hidden" // For Observe mode
            }}
        >
            <Grid
                ref={rootDivRef}
                container
                direction="row"
                justify="space-between"
                alignItems="center"
                item
                xs={12}
                style={{ width: "100%", height: "100%" }}
            >
                <Grid
                    container
                    justify="center"
                    item
                    xs={1}
                >
                    <IconButton disabled={contentIndex <= 0} aria-label="go to prev activity" onClick={() => dispatch(setContentIndex(contentIndex - 1))}>
                        <ArrowBackIcon fontSize="large" />
                    </IconButton>
                </Grid>
                <Grid
                    id="classes-content-container"
                    container
                    justify="center"
                    alignItems="center"
                    item
                    xs={10}
                    style={{
                        position: "relative",
                        margin: "0 auto",
                        height: "100%"
                    }}
                >
                    <Whiteboard uniqueId={forStudent ? "student" : "teacher"} />
                    {currentMaterial.__typename === MaterialTypename.Image ?
                        <ImageFrame material={currentMaterial} /> : 
                            currentMaterial.__typename === MaterialTypename.Video ||
                            currentMaterial.__typename === MaterialTypename.Audio ||
                            (currentMaterial.__typename === undefined && currentMaterial.video) ? 
                                <ReplicatedMedia
                                    type={currentMaterial.__typename || MaterialTypename.Video}
                                    src={(currentMaterial.__typename === undefined && currentMaterial.video) || contentHref}
                                    style={{ width: "100%" }}
                                /> :
                                (currentMaterial.__typename === MaterialTypename.Iframe || currentMaterial.__typename === undefined) && contentHref ?
                                <ResizedIframe contentId={contentIndex >= materials.length ? `${recommendUrl}` : `${contentHref}`} /> : <></>
                    }
                </Grid>
                <Grid
                    container
                    justify="center"
                    item
                    xs={1}
                >
                    <IconButton disabled={contentIndex >= (recommendUrl ? materials.length : materials.length - 1)} aria-label="go to next activity" onClick={() => dispatch(setContentIndex(contentIndex + 1))}>
                        <ArrowForwardIcon fontSize="large" />
                    </IconButton>
                </Grid>
                <StyledFAB 
                    aria-label="exit study button"
                    size="large"
                    onClick={() => exitRoom()}
                    style={{
                        display: contentIndex >= materials.length - 1 ? "block" : "none",
                        backgroundColor: "transparent",
                        position: "fixed",
                        top: theme.spacing(1),
                        right: theme.spacing(1)
                    }}>
                        <StyledIcon icon={<ExitIcon />} size="large" color="#000000" />
                </StyledFAB>
            </Grid>
        </Grid>
    )
}