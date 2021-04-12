import React from "react";

import { makeStyles, Grid, Theme, Box, Typography } from "@material-ui/core";

import { UserAvatar } from "kidsloop-px";

const useStyles = makeStyles((theme: Theme) => ({
	avatar: {
        pointerEvents: 'none'
    },
}));

interface NoCameraType {
    name: string
}

function NoCamera(props: NoCameraType) {
    const { name } = props;    

    const classes = useStyles();

	return (
		<Grid container justify="center">
			<Grid item>
                <UserAvatar
                    name={name}
                    className={classes.avatar}
                    size="medium"
                    maxInitialsLength={2}
                />
			</Grid>
		</Grid>
	);
}

export default NoCamera;
