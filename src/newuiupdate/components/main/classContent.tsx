import { ClassType } from "../../../store/actions";
import { LocalSessionContext } from "../../providers/providers";
import { materialActiveIndexState } from "../../states/layoutAtoms";
import { Whiteboard } from "../../whiteboard/components/Whiteboard-new";
import PreviewLessonPlan from "./previewLessonPlan";
import { WB_TOOLBAR_MAX_HEIGHT } from "./WBToolbar";
import Grid from "@material-ui/core/Grid";
import {
    makeStyles, Theme, useTheme,
} from "@material-ui/core/styles";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import clsx from "clsx";
import IframeResizer from "iframe-resizer-react";
import React, {
    useContext, useEffect, useRef, useState,
} from "react";
import { useRecoilState } from "recoil";

export const DRAWER_TOOLBAR_WIDTH = 64;

interface NewProps extends IframeResizer.IframeResizerProps { forwardRef: any }
const IframeResizerNew = IframeResizer as React.FC<NewProps>;

const useStyles = makeStyles((theme: Theme) => ({
    arrowButton:{
        height: `100%`,
        display: `flex`,
        alignItems: `center`,
        border: `2px solid ${theme.palette.background.default}`,
        padding: `0 20px`,
        cursor: `pointer`,
        borderRadius: 20,
        "&:hover":{
            background: theme.palette.background.default,
        },
    },
    arrowButtonDisabled:{
        opacity: 0.4,
        pointerEvents: `none`,
    },
    content:{
        margin: `0 20px`,
        background: theme.palette.grey[200],
        borderRadius: 20,
        height: `100%`,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        position: `relative`,
    },
}));

export function ClassContent () {
    const {
        classtype, isTeacher, materials,
    } = useContext(LocalSessionContext);

    const classes = useStyles();

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [ materialActiveIndex, setMaterialActiveIndex ] = useRecoilState(materialActiveIndexState);

    const rootDivRef = useRef<HTMLDivElement>(null);
    const [ squareSize, setSquareSize ] = useState<number>(0);
    const forStudent = classtype === ClassType.STUDY || !isTeacher;

    useEffect(() => {
        if (!rootDivRef || !rootDivRef.current) { return; }
        const width = rootDivRef.current.clientWidth;
        const height = rootDivRef.current.clientHeight;
        if (!width || !height) { return; }
        else if (width > height) { setSquareSize(height); }
        else { setSquareSize(width); }
    }, [ rootDivRef.current ]);

    return(
        <Grid
            container
            style={{
                height: `calc(100% - ${WB_TOOLBAR_MAX_HEIGHT}px)`,
            }}>
            <Grid item>
                <MaterialNavigation direction="prev"/>
            </Grid>
            <Grid
                item
                xs>
                <div
                    className={classes.content}
                    id="activity-view-container">
                    <Whiteboard uniqueId={forStudent ? `student` : `teacher`} />
                    <PreviewLessonPlan />
                </div>
            </Grid>
            <Grid item>
                <MaterialNavigation direction="next"/>
            </Grid>
        </Grid>
    );
}

export interface MaterialNavigationProps {
    direction: "prev" | "next";
}

const MaterialNavigation = (props:MaterialNavigationProps) => {
    const { direction } = props;
    const classes = useStyles();
    const [ materialActiveIndex, setMaterialActiveIndex ] = useRecoilState(materialActiveIndexState);
    const { materials } = useContext(LocalSessionContext);

    return (
        <div
            className={clsx(classes.arrowButton, {
                [classes.arrowButtonDisabled]: direction === `prev` ? materialActiveIndex <= 0 : materialActiveIndex >=  materials.length - 1,
            })}
            aria-label="go to prev activity"
            onClick={() => direction === `prev` ? setMaterialActiveIndex(materialActiveIndex - 1) : setMaterialActiveIndex(materialActiveIndex + 1)}>
            {direction === `prev` ? <ArrowBackIcon fontSize="default" /> : <ArrowForwardIcon fontSize="default" />}
        </div>
    );
};
