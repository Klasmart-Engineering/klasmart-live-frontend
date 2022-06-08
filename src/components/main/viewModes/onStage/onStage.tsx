import OnStageUserCamera from "./UserCamera";
import { useSessions } from "@/data/live/state/useSessions";
import { useSessionContext } from "@/providers/session-context";
import {
    Box,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import React,
{ useMemo } from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) => ({
    bold: {
        fontWeight: theme.typography.fontWeightBold as number,
    },
}));

interface Props {
}

export default function OnStage (props: Props) {
    const classes = useStyles();
    const sessions = useSessions();
    const { name, type } = useSessionContext();

    const host = useMemo(() => {
        const teachers = [ ...sessions.values() ].filter(session => session.isTeacher).sort((a, b) => a.joinedAt - b.joinedAt);
        const host = teachers.find(session => session.isHost);
        return host;
    }, [ sessions ]);

    if(type === `preview`){
        return(
            <Box textAlign="center">
                <Typography className={classes.bold}>
                    <FormattedMessage id="preview_guide_text_1" />
                </Typography>
                <Typography>
                    <FormattedMessage id="preview_guide_text_2" />
                </Typography>
            </Box>
        );
    }

    if (!host) {
        return (
            <Box textAlign="center">
                <Typography variant="h4">
                    <FormattedMessage
                        id="hello"
                        values={{
                            name,
                        }}
                    />
                </Typography>
                <Typography>
                    <FormattedMessage id="waiting_for_class" />
                </Typography>
            </Box>
        );
    }

    return <OnStageUserCamera user={host} />;
}
