import React, { useMemo, useRef, useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import Tooltip from "@material-ui/core/Tooltip";

import { ContentCopy as CopyIcon } from "@styled-icons/material/ContentCopy";

import StyledTextField from "../../components/styled/textfield"
import { useUserContext } from "../../context-provider/user-context";

export default function InviteButton(): JSX.Element {
    const theme = useTheme();
    const [openSnackbar, toggleSnackbar] = useState(false);

    const { roomId } = useUserContext();
    const url = useMemo(() => {
        let url = new URL(window.location.href);
        url.href = url.origin + url.pathname;
        url.searchParams.set("roomId", roomId);
        return url.toString();
    }, [window.location.href, roomId]);

    const textField = useRef<HTMLInputElement>(null);

    const selectShareLinkText = async (e: MouseEvent) => {
        const inputEl = e.target as HTMLInputElement;
        inputEl.select();
    }

    useEffect(() => {
        if (!textField.current) { return; }
        textField.current.addEventListener("click", selectShareLinkText);
        return textField.current.removeEventListener("click", selectShareLinkText);
    }, [textField.current])

    return (
        <>
            <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
                item
                xs={12}
                style={{ flexGrow: 0 }}
            >
                <StyledTextField
                    fullWidth
                    margin="dense"
                    label={<FormattedMessage id="invite_students" />}
                    inputRef={textField}
                    value={url}
                    inputProps={{ style: { verticalAlign: "center", fontFamily: "monospace" } }}
                    InputProps={{
                        endAdornment:
                            <Tooltip placement="bottom" title="Copy to clipboard">
                                <IconButton
                                    aria-label="copy"
                                    onClick={() => {
                                        if (!textField.current) { return; }
                                        textField.current.select();
                                        document.execCommand("copy");
                                        toggleSnackbar(true);
                                    }}
                                >
                                    <CopyIcon size="1rem" color="#0E78D5" />
                                </IconButton>
                            </Tooltip>,
                        readOnly: true,
                    }}
                />
            </Grid>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => toggleSnackbar(false)}
                message={<FormattedMessage id="copy_clipboard" />}
            />
        </>
    );
}