import {
    Button,
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) => createStyles({
    btnTryAgain: {
        marginTop: theme.spacing(8),
        fontWeight: theme.typography.fontWeightBold as number,
        borderRadius: theme.spacing(2),
    },
    titleLoadingText: {
        fontWeight: theme.typography.fontWeightBold as number,
        marginBottom: theme.spacing(1),
    },
}));

export default function LoadingWithRetry ({ messageId, retryCallback }: { messageId?: string; retryCallback?: () => void }) {
    const classes = useStyles();
    return (
        <Grid
            item
            xs={12}
            style={{
                textAlign: `center`,
                backgroundColor: `white`,
            }}>
            <Grid
                container
                item
                direction="row"
                alignItems="center"
                spacing={2}
            >
                <Grid
                    item
                    xs={12}>
                    <Typography
                        className={classes.titleLoadingText}
                        variant="h6"
                        color="secondary"
                    >
                        <FormattedMessage id="signin.title.loading" />
                    </Typography>
                </Grid>
                {messageId ?
                    <Grid
                        item
                        xs={12}>
                        <Typography variant="subtitle2">
                            <FormattedMessage id={messageId} />
                        </Typography>
                    </Grid> : null}
                {retryCallback ?
                    <Grid
                        item
                        xs={12}>
                        <Button
                            className={classes.btnTryAgain}
                            variant="contained"
                            size="large"
                            color="secondary"
                            onClick={() => { retryCallback(); }}>
                            <FormattedMessage id={`loading_try_again`} />
                        </Button>
                    </Grid> : null}
            </Grid>
        </Grid>
    );
}
