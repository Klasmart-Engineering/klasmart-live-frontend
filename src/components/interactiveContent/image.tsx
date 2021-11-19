
import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
    imageBackground: {
        height: `100%`,
        position: `absolute`,
        left: 0,
        right: 0,
        zIndex: 1,
        filter: `blur(8px)`,
        WebkitFilter: `blur(8px)`,
        backgroundPosition: `center`,
        backgroundRepeat: `no-repeat`,
        backgroundSize: `cover`,
        opacity: `0.8`,
    },
    image: {
        position: `absolute`,
        zIndex: 2,
        objectFit: `contain`,
        width: `100%`,
        textAlign: `center`,
        maxHeight: `100%`,
        padding: theme.spacing(1),
        boxSizing: `border-box`,

        "&[draggable='false']": {
            pointerEvents: `none`,
        },
    },
}));

interface Props {
    material: string;
}

function ActivityImage (props: Props) {
    const classes = useStyles();
    const { material } = props;

    return(
        <Grid
            container
            alignItems="center"
            justifyContent="center"
        >
            <img
                draggable="false"
                className={classes.image}
                src={material}
            />
            <div
                className={classes.imageBackground}
                style={{
                    backgroundImage: `url(${material})`,
                }}
            />
        </Grid>
    );

}

export default ActivityImage;
