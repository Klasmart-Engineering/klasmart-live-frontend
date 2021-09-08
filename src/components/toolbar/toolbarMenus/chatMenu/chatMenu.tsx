import { isChatOpenState } from "@/store/layoutAtoms";
import { StyledPopper } from "@/utils/utils";
import Chat from "@/main/chat/chat";
import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
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

interface ChatMenuProps {
	anchor?: any;
}

function ChatMenu (props: ChatMenuProps) {
    const { anchor } = props;
    const classes = useStyles();

    const [ isChatOpen, setIsChatOpen ] = useRecoilState(isChatOpenState);

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
