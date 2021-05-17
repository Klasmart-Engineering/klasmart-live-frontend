import { whiteboard } from "../../../utils/layerValues";
import { LocalSessionContext } from "../../providers/providers";
import { useSynchronizedState } from "../context-providers/SynchronizedStateProvider";
import { makeStyles, Theme } from "@material-ui/core";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { WhiteboardCanvas } from "kidsloop-canvas/lib/domain/whiteboard/WhiteboardCanvas";
import React, {
    useContext, useEffect, useMemo,
} from "react";

const useStyles = makeStyles((theme: Theme) => ({
    whiteboard: {
        "& div": {
            overflow: `hidden`,
            position: `relative`,
        },
        "& canvas": {
            width: `2048px !important`,
            height: `2048px !important`,
        },
    },
    whiteboardResizer:{
        position: `absolute`,
        top: `0`,
        left: `0`,
        width: `100%`,
        height: `100%`,
    },
}));

type Props = {
    uniqueId: string;
    group?: string;
    width?: string | number; // In student case, activity's width should be passed
    height?: string | number;
    filterUsers?: string[];
    filterGroups?: string[];
    centerHorizontally?: boolean;
    centerVertically?: boolean;
}

export function Whiteboard ({
    group, width, height, filterUsers, filterGroups, uniqueId, centerHorizontally, centerVertically,
}: Props): JSX.Element {
    const { state: { permissions, display } } = useSynchronizedState();
    const classes = useStyles();
    const { sessionId } = useContext(LocalSessionContext);

    const canvasUserId = useMemo(() => {
        if (group) {
            return `${sessionId}:${group}`;
        } else {
            return sessionId;
        }
    }, [ sessionId, group ]);

    useEffect(()=>{
        window.dispatchEvent(new Event(`resize`));
    }, [ display ]);

    const canvasStyle: CSSProperties = {
        zIndex: whiteboard,
        width: `100%`,
        height: `100%`,
    };

    return (
        <div
            id="whiteboard-container"
            style={{
                zIndex: whiteboard + 1,
                display: display ? `block` : `none`,
                position: `absolute`,
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                width: width ? width : `100%`,
                height: height ? height : `100%`,
            }}
            className={`${classes.whiteboard} whiteboard-container-class`}
        >
            <div className={`${classes.whiteboardResizer} whiteboard-resizer`}>
                <WhiteboardCanvas
                    instanceId={`canvas:user:${sessionId}:${uniqueId}`}
                    userId={canvasUserId}
                    pointerEvents={permissions.allowCreateShapes}
                    initialStyle={canvasStyle}
                    filterUsers={filterUsers}
                    filterGroups={filterGroups}
                    pixelWidth={2048}
                    pixelHeight={2048}
                    display={display}
                    scaleMode={`ScaleToFill`}
                    centerHorizontally={centerHorizontally !== undefined ? centerHorizontally : true}
                    centerVertically={centerVertically !== undefined ? centerVertically : false}
                />
            </div>
        </div>
    );
}
