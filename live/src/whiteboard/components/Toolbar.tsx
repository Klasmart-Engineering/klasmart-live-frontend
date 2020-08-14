import React, { useState } from "react";
import { ColorResult, CirclePicker } from "react-color";
import { Slider, Button } from "@material-ui/core";
import { useWhiteboard } from "../context-provider/WhiteboardContextProvider";
import { FormattedMessage } from "react-intl";

export default function Toolbar(): JSX.Element {
    const { state, actions: { clear, setBrush, display } } = useWhiteboard();

    const [selectColor, setSelectColor] = useState(false);

    const handleSetColor = (color: ColorResult) => {
        const newBrush = { ...state.brushParameters };

        setSelectColor(false);

        newBrush.style = color.hex;
        setBrush(newBrush);
    };

    const handleSetLineWidth = (value: number | number[]) => {
        if (typeof value !== "number") {
            return;
        }

        const newBrush = { ...state.brushParameters };

        newBrush.width = value;
        setBrush(newBrush);
    };

    const handleDisplayColor = () => {
        setSelectColor(!selectColor);
    };

    const paintingControls: JSX.Element = (
        <>
            {state.permissions.allowCreateShapes ?
                <>
                    {selectColor ?
                        <div style={{ zIndex: 5, width: "840px", backgroundColor: "rgba(80, 80, 80, 0.4)", padding: "5px", position: "absolute" }}>
                            <CirclePicker width={"100%"} colors={["#000", "#ff0000", "#00ff00", "#0062f1", "#ffff00", "rgb(200, 147, 68)", "#ffffff"]} circleSize={100} color={state.brushParameters.style} onChangeComplete={c => handleSetColor(c)} />
                        </div> : <></>
                    }
                    <Slider min={1.0} max={6.0} value={state.brushParameters.width} onChange={(_e, value) => handleSetLineWidth(value)} />
                    <br />
                    <Button color="primary" onClick={handleDisplayColor}>
                        <FormattedMessage id="whiteboard_color" />
                    </Button>
                </> : <></>
            }
            {state.permissions.allowDeleteShapes.others ?
                <Button color="primary" onClick={() => { clear(); }}>
                    <FormattedMessage id="whiteboard_clear" />
                </Button> : <></>
            }
        </>
    );

    const displayed: JSX.Element = (
        <>
            {paintingControls}
            {state.permissions.allowShowHide ?
                <Button color="primary" onClick={() => display(false)}>
                    <FormattedMessage id="whiteboard_hide" />
                </Button>
                : <></>
            }
        </>
    );

    const hidden: JSX.Element = (
        <>
            {state.permissions.allowShowHide ?
                <Button color="primary" onClick={() => display(true)}>
                    <FormattedMessage id="whiteboard_show" />
                </Button>
                : <></>
            }
        </>
    );

    return (
        <div>
            {state.display ? displayed : hidden}
        </div>
    );
}
