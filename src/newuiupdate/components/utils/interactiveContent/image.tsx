
import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import React, { useContext } from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    container:{
        height: `calc(100vh - 140px)`, // TODO replace with toolbar height
    },
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
    image:{
        zIndex: 9,
        objectFit: `contain`,
        width: `100%`,
        textAlign: `center`,
        maxHeight: `100%`,
    },
}));

function ActivityImage (props: any) {
    const classes = useStyles();
    const { material } = props;

    return(
        <Grid
            container
            alignItems="center"
            justify="center"
            className={classes.container}
        >
            <Grid
                item
                className={classes.imageBackground}
                style={{
                    backgroundImage: `url(${material.url})`,
                }}
            />
            <img
                className={classes.image}
                src={material.url}
            />
        </Grid>
    );

}

export default ActivityImage;
