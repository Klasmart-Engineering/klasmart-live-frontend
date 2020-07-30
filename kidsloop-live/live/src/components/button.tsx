import Button from "@material-ui/core/Button";
import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import * as React from "react";

const styles = (theme: Theme) => createStyles({
    btn: {
        "&:hover": {
            "background": "#40b8f4",
            "box-shadow": "0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)",
            "transform": "translateY(-1px)",
        },
        "background": "#1896ea",
        "border-radius": "12px",
        "color": "#FFF",
        "margin": theme.spacing(3, 0, 2),
        "padding": theme.spacing(1, 2),
    },
});

type Props = Parameters<typeof Button>[0] & WithStyles<typeof styles>;

class KidsloopButton extends React.PureComponent<Props, any> {
    public render() {
        const forwardProps = { ...this.props };
        delete forwardProps.classes;
        return <Button className={this.props.classes.btn} {...forwardProps} />;
    }
}

export default withStyles(styles)(KidsloopButton);
