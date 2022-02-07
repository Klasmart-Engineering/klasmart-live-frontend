import { CanvasToolbarItems } from "@/components/toolbar/toolbarMenus/canvasMenu/canvasMenu";
import { useSessionContext } from "@/providers/session-context";
import {
    canvasDrawColorState,
    canvasSelectedItemState,
} from "@/store/layoutAtoms";
import { whiteboard } from "@/utils/layerValues";
import { useSynchronizedState } from "@/whiteboard/context-providers/SynchronizedStateProvider";
import {
    makeStyles,
    Theme,
} from "@material-ui/core";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { WhiteboardCanvas } from "kidsloop-canvas/lib/domain/whiteboard/WhiteboardCanvas";
import React,
{
    useEffect,
    useMemo,
} from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

// Generate a landscape size for the canvas
const canvasSize = {
    width: Math.max(window.screen.width, window.screen.height),
    height: Math.min(window.screen.width, window.screen.height),
};

interface StyledCursorProps {
    color?: string;
}

const StyledCursor = styled.div`
    width: 100%;
    height: 100%;
    & canvas {
       cursor: ${(props: StyledCursorProps) => props.color ? `url("data:image/svg+xml,<svg fill='${props.color}' viewBox='0 0 32 32' width='16' height='16' aria-hidden='true' focusable='false' xmlns='http://www.w3.org/2000/svg'><circle xmlns='http://www.w3.org/2000/svg' cx='12' cy='12' r='8.2'/></svg>") 6 6, pointer !important` : `inherit`};
    }
`;

const useStyles = makeStyles((theme: Theme) => ({
    whiteboard: {
        "& div": {
            overflow: `hidden`,
            position: `relative`,
        },
        "& canvas": {
            width: `${canvasSize.width}px !important`,
            height: `${canvasSize.height}px !important`,
        },
    },
    whiteboardResizer: {
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
    useLocalDisplay?: boolean;
}

export function Whiteboard ({
    group,
    width,
    height,
    filterUsers,
    filterGroups,
    uniqueId,
    centerHorizontally,
    centerVertically,
    useLocalDisplay,
}: Props): JSX.Element {
    const {
        state: {
            permissions,
            display,
            localDisplay,
        },
    } = useSynchronizedState();
    const classes = useStyles();
    const { sessionId } = useSessionContext();
    const canvasDrawColor = useRecoilValue(canvasDrawColorState);
    const canvasSelectedItem = useRecoilValue(canvasSelectedItemState);

    const canvasUserId = useMemo(() => {
        if (group) {
            return `${sessionId}:${group}`;
        } else {
            return sessionId;
        }
    }, [ sessionId, group ]);

    useEffect(() => {
        window.dispatchEvent(new Event(`resize`));
    }, [ display ]);

    const canvasStyle: CSSProperties = {
        zIndex: whiteboard,
        width: `100%`,
        height: `100%`,
    };

    const cursorColor = canvasSelectedItem === CanvasToolbarItems.PENCIL ? canvasDrawColor.replace(`#`, `%23`) : ``;

    return (
        <div
            id="whiteboard-container"
            style={{
                zIndex: whiteboard + 1,
                display: (useLocalDisplay ? localDisplay : display) ? `block` : `none`,
                position: `absolute`,
                overflow: `hidden`,
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                width: width ? width : `100%`,
                height: height ? height : `100%`,
            }}
            className={`${classes.whiteboard} whiteboard-container-class`}
        >
            <StyledCursor color={cursorColor}>
                <div className={`${classes.whiteboardResizer} whiteboard-resizer`}>
                    <WhiteboardCanvas
                        instanceId={`canvas:user:${sessionId}:${uniqueId}`}
                        userId={canvasUserId}
                        pointerEvents={permissions.allowCreateShapes}
                        initialStyle={canvasStyle}
                        filterUsers={filterUsers}
                        filterGroups={filterGroups}
                        pixelWidth={canvasSize.width}
                        pixelHeight={canvasSize.height}
                        display={useLocalDisplay ? localDisplay : display}
                        scaleMode={`ScaleToFill`}
                        centerHorizontally={centerHorizontally !== undefined ? centerHorizontally : true}
                        centerVertically={centerVertically !== undefined ? centerVertically : false}
                    />
                </div>
            </StyledCursor>
        </div>
    );
}
