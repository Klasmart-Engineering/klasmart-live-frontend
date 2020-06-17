import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Paper from "@material-ui/core/Paper";
import Popover from "@material-ui/core/Popover";
import { createStyles, makeStyles, Theme, useTheme, withStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import AddPhotoIcon from "@material-ui/icons/AddPhotoAlternate";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import ClearIcon from "@material-ui/icons/Clear";
import LineWeightIcon from "@material-ui/icons/LineWeight";
import SelectIcon from "@material-ui/icons/PhotoSizeSelectSmall";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import fabric from "fabric";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useStore } from "react-redux";
import { ActionTypes } from "../store/actions";
import { State } from "../store/store";
import { Activity, LessonResultCollection } from "../types/objectTypes";

const colorList = [
    {
        ariaLabel: "black",
        color: "#000000",
    },
    {
        ariaLabel: "red",
        color: "#ff5252",
    },
    {
        ariaLabel: "yellow",
        color: "#ffbc00",
    },
    {
        ariaLabel: "green",
        color: "#00c853",
    },
    {
        ariaLabel: "blue",
        color: "#00b0ff",
    },
    {
        ariaLabel: "purple",
        color: "#d500f9",
    },
    {
        ariaLabel: "brown",
        color: "#8d6e63",
    },
];

const lineThickness = [
    {
        ariaLabel: "one pixel thick",
        width: 1,
    },
    {
        ariaLabel: "five pixels thick",
        width: 5,
    },
    {
        ariaLabel: "ten pixels thick",
        width: 10,
    },
    {
        ariaLabel: "fifteen pixels thick",
        width: 15,
    },
    {
        ariaLabel: "twenty pixels thick",
        width: 20,
    },
    {
        ariaLabel: "twenty-five pixels thick",
        width: 25,
    },
];

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        canvas: {
            border: "1px solid rgb(170, 170, 170)",
        },
        divider: {
            margin: theme.spacing(1, 0.5),
        },
        paper: {
            border: `1px solid ${theme.palette.divider}`,
            display: "flex",
            flexWrap: "wrap",
        },
        parentContainer: {
            width: "100%",
            // flexGrow: 1,
            [theme.breakpoints.up("md")]: {
                margin: theme.spacing(2),
            },
            [theme.breakpoints.down("md")]: {
                paddingTop: theme.spacing(2),
            },
        },
    }),
);

const StyledToggleButtonGroup = withStyles((theme: Theme) => ({
    grouped: {
        "&:first-child": {
            borderRadius: theme.shape.borderRadius,
        },
        "&:not(:first-child)": {
            borderRadius: theme.shape.borderRadius,
        },
        "border": "none",
        // "color": "black",
        "margin": theme.spacing(0.5),
    },
}))(ToggleButtonGroup);

interface Props {
    activity: Activity;
    backgroundURL?: string;
}

export default function Whiteboard(props: Props) {
    const classes = useStyles();
    const ref = useRef<HTMLCanvasElement>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const theme = useTheme();

    const [drawingMode, setDrawingMode] = useState<boolean>(true);
    const [thickness, setThickess] = useState<number>(10);
    const [drawingColor, setDrawingColor] = useState<string>("#000000");

    const [{ canvasWidth, canvasHeight }, setCanvasDimensions] = useState({ canvasWidth: 0, canvasHeight: 0 });
    const { activity, backgroundURL = "" } = props;

    const activeStep = useSelector((state: State) => state.lesson.activityStep);

    const store = useStore();
    const lessonResults = useSelector((state: State) => state.lesson.lessonResults);
    function setLessonResults(results: LessonResultCollection) {
        store.dispatch({ type: ActionTypes.LESSON_RESULTS, payload: results });
    }

    useEffect(() => {
        if (!ref.current) { return; }
        (window as any)._canvas = new fabric.fabric.Canvas(ref.current, {
            isDrawingMode: drawingMode,
        });

        if (backgroundURL !== "") {
            fabric.fabric.Image.fromURL(backgroundURL, (img) => {
                if (img !== undefined) {
                    let imgWidth = img.width || 1;
                    let imgHeight = img.height || 1;
                    let newCanvasHeight = 0;
                    let width = 0;

                    const canvasParent = document.getElementById(`canvas-${activity.activityID}`);
                    if (canvasParent) {
                        width = canvasParent.getBoundingClientRect().width;
                        const height = canvasParent.getBoundingClientRect().height;
                        const scale = (canvasWidth === 0 ? width : canvasWidth) / imgWidth;

                        newCanvasHeight = imgHeight * scale;
                        img.scaleToWidth(width);

                    }

                    imgWidth = img.width || 1;
                    imgHeight = img.height || 1;

                    (window as any)._canvas.setDimensions({ width, height: newCanvasHeight });
                    setCanvasDimensions({ canvasWidth: width, canvasHeight: newCanvasHeight });
                }
                (window as any)._canvas.setBackgroundImage(img, (window as any)._canvas.renderAll.bind((window as any)._canvas), {});
            });
        } else {
            const canvasParent = document.getElementById(`canvas-${activity.activityID}`);
            if (canvasParent) {
                const { width, height } = canvasParent.getBoundingClientRect();
                (window as any)._canvas.setDimensions({ width, height });
                setCanvasDimensions({ canvasWidth: width, canvasHeight: height });
            }
        }

        (window as any)._canvas.freeDrawingBrush.color = drawingColor;
        (window as any)._canvas.freeDrawingBrush.width = thickness;
        (window as any)._canvas.renderAll();

        lessonResults[activeStep].completed = true;
        setLessonResults(lessonResults);
    }, [window.innerHeight]);

    useEffect(() => {
        (window as any)._canvas.freeDrawingBrush.color = drawingColor;
    }, [drawingColor]);

    useEffect(() => {
        (window as any)._canvas.freeDrawingBrush.width = thickness;
    }, [thickness]);

    const handleFileChange = (event: any) => {
        const file: File = event.target.files[0];
        if (file) {
            if (drawingMode) { handleDrawingMode(); }

            const reader = new FileReader();
            reader.onload = (ev: any) => {
                const data = ev.target.result;

                if (file.type.includes("svg")) { // TODO: fix bug..
                    fabric.fabric.loadSVGFromURL(data, (objects, options) => {
                        const obj = fabric.fabric.util.groupSVGElements(objects, options);
                        obj.set({ left: 10, top: 10 });
                        (window as any)._canvas.add(obj).renderAll();
                    });
                } else {
                    fabric.fabric.Image.fromURL(data, (img) => {
                        img.set({ left: 10, top: 10 });
                        (window as any)._canvas.add(img);
                    });
                }
            };

            reader.readAsDataURL(file);
        }

        event.target.value = ""; // To call this function when upload the same image
    };

    const handleDrawingMode = () => {
        setDrawingMode(!drawingMode);
        (window as any)._canvas.isDrawingMode = !drawingMode;
    };

    const handleColorChange = (event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>, newColor: string) => {
        setDrawingColor(newColor);
    };

    const handleThicknessChange = (event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>, newThickness: number) => {
        setThickess(newThickness);
        handleClose();
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <>
            <Grid
                item
                id={`canvas-${activity.activityID}`}
                className={classes.parentContainer}
                style={{ flexGrow: backgroundURL === "" ? 1 : 0 }}
            >
                <canvas className={classes.canvas} ref={ref} id="whiteboard" />
            </Grid>
            <Grid item>
                <Paper elevation={0} className={classes.paper}>
                    <Hidden smDown>
                        <StyledToggleButtonGroup
                            size={isSmallScreen ? "small" : "large"}
                            value={drawingMode}
                            exclusive
                            aria-label="canvas mode"
                            onChange={handleDrawingMode}
                        >
                            <ToggleButton value={false} aria-label="left aligned">
                                <SelectIcon />
                            </ToggleButton>
                            <ToggleButton value={true} aria-label="centered">
                                <BorderColorIcon />
                            </ToggleButton>
                        </StyledToggleButtonGroup>
                        <Divider flexItem orientation="vertical" />
                    </Hidden>
                    <StyledToggleButtonGroup
                        size={isSmallScreen ? "small" : "large"}
                        value={drawingColor}
                        exclusive
                        aria-label="color picker"
                        onChange={handleColorChange}
                    >
                        {colorList.map((c) => (
                            <ToggleButton key={c.color} value={c.color} aria-label={c.ariaLabel}>
                                <div style={{ backgroundColor: c.color, width: 24, height: 24, borderRadius: 25 }} />
                            </ToggleButton>
                        ))}
                    </StyledToggleButtonGroup>
                    <Hidden xsDown>
                        <StyledToggleButtonGroup
                            size={isSmallScreen ? "small" : "large"}
                            value=""
                            onClick={handleClick}
                        >
                            <ToggleButton value="lineWeight" aria-label="line weight dropdown">
                                <LineWeightIcon />
                                <ArrowDropDownIcon />
                            </ToggleButton>
                        </StyledToggleButtonGroup>
                    </Hidden>
                    <Divider flexItem orientation="vertical" />
                    <Hidden smDown>
                        <StyledToggleButtonGroup
                            size={isSmallScreen ? "small" : "large"}
                            value=""
                            exclusive
                            aria-label="add image"
                        >
                            <ToggleButton value="addImage" aria-label="add image">
                                <input
                                    type="file"
                                    accept=".png,.jpg,.jpeg" // TODO: Add svg
                                    style={{ display: "none" }}
                                    id="button-file"
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="button-file">
                                    <AddPhotoIcon style={{ marginTop: 6 }} />
                                </label>
                            </ToggleButton>
                        </StyledToggleButtonGroup>
                    </Hidden>
                    <Divider flexItem orientation="vertical" />
                    <StyledToggleButtonGroup
                        size={isSmallScreen ? "small" : "large"}
                        value=""
                        exclusive
                        aria-label="clear canvas"
                        onClick={() => { (window as any)._canvas.clear(); }}
                    >
                        <ToggleButton value="clearCanvas" aria-label="clear canvas">
                            <ClearIcon />
                        </ToggleButton>
                    </StyledToggleButtonGroup>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            horizontal: "center",
                            vertical: "bottom",
                        }}
                        transformOrigin={{
                            horizontal: "center",
                            vertical: "top",
                        }}
                    >
                        <StyledToggleButtonGroup
                            size={isSmallScreen ? "small" : "medium"}
                            value={thickness}
                            exclusive
                            aria-label="select drawing thickness"
                            onChange={handleThicknessChange}
                        >
                            {lineThickness.map((l) => (
                                <ToggleButton key={l.width} value={l.width} aria-label={l.ariaLabel}>
                                    <div
                                        style={{ backgroundColor: theme.palette.type === "dark" ? "white" : "black",
                                            borderRadius: l.width / 2,
                                            height: l.width,
                                            width: l.width,
                                        }}
                                    />
                                </ToggleButton>
                            ))}
                        </StyledToggleButtonGroup>
                    </Popover>
                </Paper>
            </Grid>
        </>
    );
}
