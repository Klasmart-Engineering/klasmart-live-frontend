import { useCordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import { isKeyboardVisibleState } from "@/app/model/appModel";
import Chat from "@/components/main/chat/chat";
import { isChatOpenState } from "@/store/layoutAtoms";
import { StyledPopper } from "@/utils/utils";
import {
    Grid,
    makeStyles,
    Theme,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import React from "react";
import {
    isBrowser,
    isTablet,
} from "react-device-detect";
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
	anchor: HTMLElement;
}

function ChatMenu (props: ChatMenuProps) {
    const { anchor } = props;
    const classes = useStyles();

    const isChatOpen = useRecoilValue(isChatOpenState);

    const isKeyboardVisible = useRecoilValue(isKeyboardVisibleState);
    const { isAndroid } = useCordovaSystemContext();
    const theme = useTheme();
    const isMdDown = useMediaQuery(theme.breakpoints.down(`md`));
    const popperHeight = isMdDown ? (isKeyboardVisible ? `100vh` : `calc(100vh - 95px)`) : 400;

    return (
        <StyledPopper
            placement="top-end"
            modifiers={{
                preventOverflow: {
                    boundariesElement: isKeyboardVisible ? null : document.getElementById(`main-content`),
                },
            }}
            showScrollbar={isAndroid}
            height={popperHeight}
            open={isChatOpen}
            anchorEl={anchor}
            isKeyboardVisible={isKeyboardVisible}>
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
