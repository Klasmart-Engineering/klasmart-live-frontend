import React, { useState, useEffect, useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import IframeResizer from "iframe-resizer-react";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";

import ArrowBackIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIcon from '@material-ui/icons/ArrowForwardIos';

import { UserContext } from "../../entry";
import { LessonMaterial, MaterialTypename } from "../../lessonMaterialContext";
import { Whiteboard } from "../../whiteboard/components/Whiteboard";
import { State } from "../../store/store";
import { setContentIndex } from "../../store/reducers/control";

interface NewProps extends IframeResizer.IframeResizerProps {
    forwardRef: any
}
const IframeResizerNew = IframeResizer as React.FC<NewProps>

export default function Study(): JSX.Element {
    const dispatch = useDispatch();

    const { materials } = useContext(UserContext);
    const mats = materials.filter(mat => mat.__typename !== undefined && mat.__typename === MaterialTypename.Iframe)
    const contentIndex = useSelector((store: State) => store.control.contentIndex)
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const rootDivRef = useRef<HTMLDivElement>(null);
    const [squareSize, setSquareSize] = useState<number>(0);
    const [prevContentIdx, setPrevContentIdx] = useState<number>(contentIndex);
    const [shuffledMaterials, setShuffledMaterials] = useState<LessonMaterial[]>(mats)

    // Temporary feature - It will be not used after implementing recommand logic
    const shuffle = (array: LessonMaterial[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    };

    useEffect(() => {
        shuffle(mats);
        setShuffledMaterials(mats);
    }, [])

    useEffect(() => {
        if (!rootDivRef || !rootDivRef.current) { return; }
        const width = rootDivRef.current.clientWidth;
        const height = rootDivRef.current.clientHeight;
        if (!width || !height) { return; }
        else if (width > height) { setSquareSize(height); }
        else { setSquareSize(width); }
    }, [rootDivRef.current]);

    return (
        <Grid
            id="study-content-container"
            ref={rootDivRef}
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            item
            xs={12}
            style={{ width: "100%", height: "100%" }}
        >
            <Grid item>
                <IconButton disabled={contentIndex <= 0} aria-label="go to prev activity" onClick={() => dispatch(setContentIndex(contentIndex - 1))}>
                    <ArrowBackIcon fontSize="large" />
                </IconButton>
            </Grid>
            <Grid
                item
                style={squareSize ? {
                    position: "relative",
                    margin: "0 auto",
                    width: squareSize,
                    height: squareSize
                } : {
                        position: "relative",
                        margin: "0 auto",
                        height: "100%"
                    }
                }>
                <Whiteboard uniqueId="student" />
                <IframeResizerNew
                    forwardRef={iframeRef}
                    src={shuffledMaterials[contentIndex].url}
                    style={{ width: "100%", height: "100%" }}
                />
            </Grid>
            <Grid item>
                <IconButton disabled={contentIndex >= mats.length - 1} aria-label="go to next activity" onClick={() => dispatch(setContentIndex(contentIndex + 1))}>
                    <ArrowForwardIcon fontSize="large" />
                </IconButton>
            </Grid>
        </Grid>
    )
}
