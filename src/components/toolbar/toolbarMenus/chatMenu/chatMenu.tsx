import Chat from "@/components/main/chat/chat";
import { isChatOpenState } from "@/store/layoutAtoms";
import { StyledPopper } from "@/utils/utils";
import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import React from "react";
import { useRecoilValue } from "recoil";

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

interface ChatMenuProps {
	anchor?: HTMLElement;
}

function ChatMenu (props: ChatMenuProps) {
    const { anchor } = props;
    const classes = useStyles();

    const isChatOpen = useRecoilValue(isChatOpenState);

    return (
        <StyledPopper
            open={isChatOpen}
            anchorEl={anchor}>
            <Grid
                container
                alignItems="stretch"
                className={classes.root}>
                <Grid
                    item
                    xs>
                    <Chat />
                </Grid>
            </Grid>
        </StyledPopper>
    );
}

export default ChatMenu;
