import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import React from "react";
import { FormattedMessage } from "react-intl";

export interface Props {
    messageId?: string;
    loaderColor?: string;
}

export default function Loading (props: Props) {
    const { messageId, loaderColor } = props;
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            height="100%"
            width="100%"
        >
            <CircularProgress style={{
                color: loaderColor || ``,
            }}
            />
            {messageId && (
                <Box mt={2}>
                    <Typography variant="subtitle2">
                        <FormattedMessage id={messageId} />
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
