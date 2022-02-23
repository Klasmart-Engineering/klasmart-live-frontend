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
    useState,
} from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

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
        height: `100%`,
        width: `100%`,
        position: `absolute`,
        top: 0,
        left: 0,
        pointerEvents: `none`,
    },
}));

interface Props {
    group?: string;
    width?: number;
    height?: number;
    filterUsers?: string[];
    filterGroups?: string[];
}

export function BaseWhiteboard (props: Props) {
    const {
        group,
        filterUsers,
        filterGroups,
        width = 0,
        height = 0,
    } = props;
    const {
        state: {
            permissions,
            display,
            localDisplay,
        },
    } = useSynchronizedState();
    const classes = useStyles();
    const { sessionId } = useSessionContext();
    const canvasUserId = useMemo(() => group ? `${sessionId}:${group}` : sessionId, [ sessionId, group ]);
    const [ initialSize, setInitialSize ] = useState({
        width: 0,
        height: 0,
    });
    const canvasDrawColor = useRecoilValue(canvasDrawColorState);
    const canvasSelectedItem = useRecoilValue(canvasSelectedItemState);

    useEffect(() => {
        if (initialSize.height || initialSize.width || !width || !height) return;
        setInitialSize({
            width,
            height,
        });
    }, [ width, height ]);

    const canvasStyle: CSSProperties = {
        zIndex: whiteboard,
        width: `100%`,
        height: `100%`,
    };

    if (!initialSize.width || !initialSize.height) return <></>;

    const cursorColor = canvasSelectedItem === CanvasToolbarItems.PENCIL ? canvasDrawColor.replace(`#`, `%23`) : ``;

    return (
        <StyledCursor color={cursorColor}>
            <div className={classes.whiteboard}>
                <WhiteboardCanvas
                    instanceId={canvasUserId}
                    userId={canvasUserId}
                    pointerEvents={permissions.allowCreateShapes}
                    initialStyle={canvasStyle}
                    filterUsers={filterUsers}
                    filterGroups={filterGroups}
                    pixelWidth={initialSize.width}
                    pixelHeight={initialSize.height}
                    display={localDisplay || display}
                    scaleMode="ScaleToFit"
                />
            </div>
        </StyledCursor>
    );
}
