import { useCordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import { isKeyboardVisibleState } from "@/app/model/appModel";
import Chat from "@/components/main/chat/chat";
import { isChatOpenState } from "@/store/layoutAtoms";
import { StyledPopper } from "@/utils/utils";
import {
    useMediaQuery,
    useTheme,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import React from "react";
import {
    useRecoilState,
    useRecoilValue,
} from "recoil";

const useStyles = makeStyles((theme) => ({}));

interface Props {
	anchor: HTMLElement;
}

function ChatMenu (props: Props) {
    const { anchor } = props;

    const [ isChatOpen, setisChatOpen ] = useRecoilState(isChatOpenState);
    const isKeyboardVisible = useRecoilValue(isKeyboardVisibleState);
    const { isAndroid } = useCordovaSystemContext();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));
    const isLgDown = useMediaQuery(theme.breakpoints.down(`lg`));
    const popperHeight = isLgDown ? (isKeyboardVisible ? `100vh` : `calc(100vh - 95px)`) : 400;

    return (
        <StyledPopper
            placement="top-end"
            modifiers={isKeyboardVisible ? [] : undefined}
            showScrollbar={isAndroid}
            height={popperHeight}
            open={isChatOpen}
            anchorEl={anchor}
            isKeyboardVisible={isKeyboardVisible}
            dialog={isSmDown}
            dialogClose={() => setisChatOpen(open => !open)}
        >
            <Chat dialog={isSmDown} />
        </StyledPopper>
    );
}

export default ChatMenu;
