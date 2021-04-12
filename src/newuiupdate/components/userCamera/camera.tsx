import React from "react";

import { makeStyles, Grid, Theme, Box, Typography } from "@material-ui/core";

import { UserAvatar } from "kidsloop-px";

const useStyles = makeStyles((theme: Theme) => ({
	avatar: {},
}));

interface CameraType {
    user: any
}

function Camera(props: CameraType) {
    const { user } = props;    

    const classes = useStyles();

	return (
		<Grid container>
			<Grid item xs>
                SHOW CAMERA OF USER
			</Grid>
		</Grid>
	);
}

export default Camera;
