import {
    interactiveModeState,
    isViewModesOpenState,
    pinnedUserState,
} from "../../../../states/layoutAtoms";
import { StyledPopper } from "../../../utils/utils";
import {
    Box, Grid, makeStyles, Theme, Typography,
} from "@material-ui/core";
import { UserVoice as OnStageIcon } from "@styled-icons/boxicons-solid/UserVoice";
import { Eye as ObserveIcon } from "@styled-icons/fa-regular/Eye";
import { PresentationChartBar as PresentIcon } from "@styled-icons/heroicons-solid/PresentationChartBar";
import clsx from "clsx";
import React, { useContext } from "react";
import { useRecoilState } from "recoil";
import { RoomContext } from "../../../../providers/roomContext";
import { useMutation } from "@apollo/client";
import { LIVE_LINK, LocalSessionContext } from "../../../../providers/providers";
import { MUT_SHOW_CONTENT } from "../../../utils/graphql";
import { ContentType } from "../../../../../pages/room/room";

const useStyles = makeStyles((theme: Theme) => ({
    item:{
        cursor: `pointer`,
        padding: `12px 20px`,
    },
    itemIcon:{
        padding: 10,
        background: `#fff`,
        border: `1px solid`,
        borderRadius: 50,
        marginBottom: 10,
        "& svg":{
            height: 20,
            width: 20,
        },
    },
    active:{
        backgroundColor: theme.palette.background.default,
    },
}));

interface ViewModesMenuProps {
	anchor?: any;
}

function ViewModesMenu (props:ViewModesMenuProps) {
    const { anchor } = props;
    const classes = useStyles();

    const [ interactiveMode, setInteractiveMode ] = useRecoilState(interactiveModeState);
    const [ isViewModesOpen, setIsViewModesOpen ] = useRecoilState(isViewModesOpenState);
    const [ pinnedUser, setPinnedUser ] = useRecoilState(pinnedUserState);

    const { roomId, sessionId } = useContext(LocalSessionContext);
    const { content } = useContext(RoomContext)

    const [ showContent, { loading: loadingShowContent } ] = useMutation(MUT_SHOW_CONTENT, {context: {target: LIVE_LINK}});

    
    const items = [
        {
            id: `1`,
            title: `On Stage`,
            icon: <OnStageIcon />,
            isActive: content?.type === ContentType.Blank|| content?.type === ContentType.Camera,
            onClick: () => {showContent({ variables: { roomId, type: ContentType.Camera, contentId: sessionId } }); setPinnedUser(undefined);},
        },
        {
            id: `2`,
            title: `Observe`,
            icon: <ObserveIcon />,
            isActive: content?.type === ContentType.Activity,
            onClick: () => {showContent({ variables: { roomId, type: ContentType.Activity, contentId: sessionId } }); setPinnedUser(undefined);},
        },
        {
            id: `3`,
            title: `Present`,
            icon: <PresentIcon />,
            isActive: content?.type === ContentType.Stream,
            onClick: () => {showContent({ variables: { roomId, type: ContentType.Stream, contentId: sessionId } }); setPinnedUser(undefined);},
        },
    ];

    return (
        <StyledPopper
            open={isViewModesOpen}
            anchorEl={anchor}>
            <Grid
                container
                alignItems="stretch" >
                {items.map(item => (
                    <Grid
                        key={item.id}
                        item>
                        <Grid
                            container
                            direction="column"
                            alignItems="center"
                            className={clsx(classes.item, item.isActive && classes.active)}
                            onClick={item.onClick}>
                            <Grid item>
                                <Box className={classes.itemIcon}>{item.icon}</Box>
                            </Grid>
                            <Grid item>
                                <Typography>{item.title}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </StyledPopper>
    );
}

export default ViewModesMenu;
