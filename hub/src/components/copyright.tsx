import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";

const styles = (theme: Theme) => createStyles({
    responsiveTypography: {
        color: "white",
        display: "inline",
        paddingBottom: theme.spacing(2),
        textAlign: "center",
        [theme.breakpoints.down("sm")]: {
            display: "block",
        },
        [theme.breakpoints.down("xs")]: {
            textAlign: "left",
        },
    },
});

type Props = WithStyles<typeof styles>;

class Copyright extends React.PureComponent<Props, any> {
    public render() {
        return (
            <Grid item className={this.props.classes.responsiveTypography}>
                <Typography variant="caption" color="textSecondary" className={this.props.classes.responsiveTypography}>
                    Copyright
                    {" © "}
                    {new Date().getFullYear()}
                    {". "}
                    <Link color="inherit" target="_blank" href="https://badanamu.com/">
                        Calm Island Limited. All rights reserved.
                    </Link>{" "}
                    Badanamu Zoo and the KidsLoop logo are registered trademarks of Calm Island Limited.
                    {" "}
                </Typography>
                {/* <Typography variant="caption" color="textSecondary" className={this.props.classes.responsiveTypography}>
                    <Link color="inherit" target="_blank" href="https://kidsloop.net/en/policies/privacy-notice" style={{ textDecoration: "underline" }}>
                        <FormattedMessage id="copyright_privacy" />
                    </Link>{" | "}
                    <Link color="inherit" target="_blank" href="https://kidsloop.net/en/policies/terms/" style={{ textDecoration: "underline" }}>
                        <FormattedMessage id="copyright_terms" />
                    </Link>{" | "}
                    <Link color="inherit" target="_blank" href="https://kidsloop.net/en/policies/return-policy/" style={{ textDecoration: "underline" }}>
                        <FormattedMessage id="copyright_refund" />
                    </Link>
                </Typography> */}
            </Grid>
        );
    }
}

export default withStyles(styles)(Copyright);
