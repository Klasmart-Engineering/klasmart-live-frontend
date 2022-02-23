import { useSessionContext } from "@/providers/session-context";
import { useSynchronizedState } from "@/whiteboard/context-providers/SynchronizedStateProvider";
import { IconButton } from "@material-ui/core";
import Grid from "@material-ui/core/Grid/Grid";
import useTheme from "@material-ui/core/styles/useTheme";
import { Move as MoveIcon } from "@styled-icons/boxicons-regular/Move";
import { Eraser as EraserIcon } from "@styled-icons/boxicons-solid/Eraser";
import { Trash as TrashIcon } from "@styled-icons/boxicons-solid/Trash";
import { Brush as BrushIcon } from "@styled-icons/material/Brush";
import { TextFields as TextIcon } from "@styled-icons/material/TextFields";
import { useToolbarContext } from "@kl-engineering/kidsloop-canvas/lib/components/toolbar/toolbar-context-provider";
import React,
{
    FunctionComponent,
    ReactChild,
    ReactChildren,
    useCallback,
    useContext,
} from "react";

type Props = {
    children?: ReactChild | ReactChildren | null | any;
}

export const Toolbar: FunctionComponent<Props> = ({ children }: Props): JSX.Element => {
    const { state: { display, permissions } } = useSynchronizedState();

    const {
        state: { tools }, actions: {
            selectTool, selectColorByValue, clear,
        },
    } = useToolbarContext();

    const { sessionId } = useSessionContext();

    const theme = useTheme();

    const selectObjectEraser = useCallback(() => {
        const eraserOptions = tools.eraser.options;
        if (eraserOptions) {
            selectTool(`eraser`, eraserOptions[0]);
        }
    }, [ selectTool, tools.eraser.options ]);

    const ColorButton = ({ colorValue }: { colorValue: string }) => (
        <Grid
            container
            item
            xs={2}
            md={2}
            style={{
                textAlign: `center`,
            }}>
            <Grid
                item
                xs={6}>
                <IconButton
                    color={`primary`}
                    style={{
                        backgroundColor: colorValue,
                    }}
                    onClick={() => { selectColorByValue(colorValue); }}
                >
                </IconButton>
            </Grid>
        </Grid>
    );

    type ToolButtonOnClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;

    const ToolButton = ({ children, clicked }: { children: any; clicked: ToolButtonOnClick }) => (
        <Grid
            container
            item
            xs={2}
            md={2}
            style={{
                textAlign: `center`,
            }}>
            <Grid
                item
                xs={6}>
                <IconButton
                    color={`primary`}
                    style={{
                        backgroundColor: `#f6fafe`,
                    }}
                    onClick={clicked}
                >
                    {children}
                </IconButton>
            </Grid>
        </Grid>
    );

    const VisibleToolbar = () => (
        <div id={`toolbar`}>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                style={{
                    flexGrow: 0,
                    padding: theme.spacing(2),
                }}>
                <ToolButton clicked={() => selectTool(`move`)}><MoveIcon size="1.5rem" /></ToolButton>
                <ToolButton clicked={() => selectTool(`line`)}><BrushIcon size="1.5rem" /></ToolButton>
                <ToolButton clicked={() => selectTool(`text`)}><TextIcon size="1.5rem" /></ToolButton>
                <ToolButton clicked={() => selectObjectEraser()}><EraserIcon size="1.5rem" /></ToolButton>
                <ToolButton clicked={() => clear([ sessionId ])}><TrashIcon size="1.5rem" /></ToolButton>
            </Grid>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                style={{
                    flexGrow: 0,
                    padding: theme.spacing(2),
                }}>
                <ColorButton colorValue={`#ff0000`} />
                <ColorButton colorValue={`#00ff00`} />
                <ColorButton colorValue={`#0000ff`} />
                <ColorButton colorValue={`#000000`} />
                <ColorButton colorValue={`#8880fc`} />
                <ColorButton colorValue={`#fbe739`} />
            </Grid>
            {children}
        </div>
    );

    return display && permissions.allowCreateShapes ? <VisibleToolbar /> : <></>;
};

export default Toolbar;
