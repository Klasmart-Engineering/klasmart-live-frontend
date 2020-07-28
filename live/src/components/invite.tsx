import React, { useContext, useMemo, useRef } from "react";
import { FormattedMessage } from "react-intl";
import { useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { ContentCopy as CopyIcon } from "@styled-icons/material/ContentCopy";
import { UserContext } from "../entry";
import StyledTextField from "../components/styled/textfield"

export default function InviteButton(): JSX.Element {
    const theme = useTheme();

    const { roomId } = useContext(UserContext);
    const url = useMemo(() => {
        let url = new URL(window.location.href);
        url.href = url.origin + url.pathname;
        url.searchParams.set("roomId", roomId);
        return url.toString();
    }, [window.location.href, roomId]);

    const textField = useRef<HTMLInputElement>(null);

    return (
        <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            item
            xs={12}
            style={{ padding: theme.spacing(2, 2, 0, 2) }}
        >
            <Grid item xs={10}>
                <StyledTextField
                    fullWidth
                    margin="dense"
                    ref={textField}
                    label={<FormattedMessage id="invite_students" />}
                    value={url}
                    onClick={(e) => { (e.target as HTMLInputElement).select(); }}
                    InputProps={{ readOnly: true }}
                    style={{ padding: 0 }}
                />
            </Grid>
            <Grid container justify="flex-end" item xs={2}>
                <IconButton
                    aria-label="copy"
                    onClick={() => {
                        if (!textField.current) { return; }
                        textField.current.select();
                        document.execCommand("copy");
                    }}
                >
                    <CopyIcon color="primary" size="1.25rem" />
                </IconButton>
            </Grid>
        </Grid>
    );
}