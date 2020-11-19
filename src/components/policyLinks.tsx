import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

const styles = (theme: Theme) => createStyles({
    links: {
        padding: theme.spacing(4, 0),
        textAlign: "right",
        [theme.breakpoints.down("sm")]: {
            textAlign: "center",
        },
    },
});

type Props = WithStyles<typeof styles>;

class PolicyLink extends React.PureComponent<Props, any> {
    public render() {
        return (
            <Grid container spacing={2} justify="flex-end" className={this.props.classes.links}>
                <Grid item xs={4}>
                    <Link
                        color="inherit"
                        href="https://kidsloop.net/en/faq"
                        target="_blank"
                        variant="caption"
                    >
                        <FormattedMessage id="privacy_helpLink" />
                    </Link>
                </Grid>
                <Grid item xs={4}>
                    <Link
                        color="inherit"
                        href="https://kidsloop.net/en/policies/privacy-notice"
                        target="_blank"
                        variant="caption"
                    >
                        <FormattedMessage id="privacy_privacyLink" />
                    </Link>
                </Grid>
                <Grid item xs={4}>
                    <Link
                        color="inherit"
                        href="https://kidsloop.net/en/policies/terms"
                        target="_blank"
                        variant="caption"
                    >
                        <FormattedMessage id="privacy_termsLink" />
                    </Link>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(PolicyLink);
