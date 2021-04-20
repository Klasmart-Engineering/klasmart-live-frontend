import { isCanvasOpenState } from "../../../states/layoutAtoms";
import { StyledPopper } from "../../utils/utils";
import {
    Grid, makeStyles,  Theme,
} from "@material-ui/core";
import { Eraser as EraserIcon } from "@styled-icons/boxicons-solid/Eraser";
import { Pencil as PencilIcon } from "@styled-icons/entypo/Pencil";
import { PeopleCommunity as PeopleCommunityIcon } from "@styled-icons/fluentui-system-filled/PeopleCommunity";
import clsx from "clsx";
import React from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: 4,
    },
    item:{
        padding: `8px 16px`,
        margin: `0 4px`,
        cursor: `pointer`,
        borderRadius: 10,
        transition: `100ms all ease-in-out`,
        "&:hover": {
            backgroundColor: theme.palette.grey[200],
        },
    },
    itemClear:{},
    itemToggleCanvas:{},
}));

const items = [
    {
        id: `1`,
        color: `black`,
    },
    {
        id: `2`,
        color: `blue`,
    },
    {
        id: `4`,
        color: `green`,
    },
    {
        id: `5`,
        color: `yellow`,
    },
    {
        id: `6`,
        color: `red`,
    },
];
interface GlobaActionsMenuProps {
	anchor?: any;
}

function CanvasMenu (props: GlobaActionsMenuProps) {
    const { anchor } = props;
    const classes = useStyles();

    const [ isCanvasOpen, setIsCanvasOpen ] = useRecoilState(isCanvasOpenState);

    return (
        <StyledPopper
            open={isCanvasOpen}
            anchorEl={anchor}>
            <Grid
                container
                alignItems="stretch"
                className={classes.root}>
                {items.map((item) => (
                    <Grid
                        key={item.id}
                        item
                        style={{
                            color: item.color,
                        }}
                        className={classes.item}
                    >
                        <PencilIcon size="2rem"/>
                    </Grid>
                ))}
                <Grid
                    item
                    className={clsx(classes.item, classes.itemClear)}
                >
                    <EraserIcon size="2rem"/>
                </Grid>
                <Grid
                    item
                    className={clsx(classes.item, classes.itemToggleCanvas)}
                >
                    <PeopleCommunityIcon size="2rem"/>
                </Grid>
            </Grid>
        </StyledPopper>
    );
}

export default CanvasMenu;
