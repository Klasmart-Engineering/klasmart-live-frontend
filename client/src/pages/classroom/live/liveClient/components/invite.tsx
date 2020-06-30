import { Button, IconButton } from "@material-ui/core";
import Popover from "@material-ui/core/Popover";
import CopyIcon from "@material-ui/icons/FileCopyTwoTone";
import ShareIcon from "@material-ui/icons/ShareTwoTone";
import React, { useContext, useMemo, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { UserContext } from "../app";

export function InviteButton(): JSX.Element {
    const {roomId} = useContext(UserContext);
    const url = useMemo(() => {
        const url = new URL(window.location.href);
        url.hash = "";
        url.searchParams.set("room", roomId);
        return url.toString();
    }, [window.location.href, roomId]);

    const textField = useRef<HTMLInputElement>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();

    return <>
        <Button aria-label="invite" onClick={(e) => setAnchorEl(e.currentTarget)} style={{padding: "0px"}} size="small">
            <ShareIcon />
            <FormattedMessage id="button_invite_students" />
        </Button>
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(undefined)}
            anchorOrigin={{
                horizontal: "center",
                vertical: "bottom",
            }}
            transformOrigin={{
                horizontal: "center",
                vertical: "top",
            }}
        >
            <div style={{paddingLeft: "15px"}}>
                <input
                    ref={textField}
                    value={url}
                    readOnly
                    onClick={(e) => {(e.target as HTMLInputElement).select(); }}
                />
                <IconButton aria-label="copy" onClick={() => {
                    if (!textField.current) { return; }
                    textField.current.select();
                    document.execCommand("copy");
                }}>
                    <CopyIcon />
                </IconButton>
            </div>
        </Popover>
    </>;
}
