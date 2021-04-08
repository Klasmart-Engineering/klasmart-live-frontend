import React from "react";

import { makeStyles, Grid, Theme } from "@material-ui/core";

import { UserVoice as OnStageIcon } from "@styled-icons/boxicons-solid/UserVoice";


const useStyles = makeStyles((theme: Theme) => ({
	root: {
		height: "100%",
        alignItems: 'center',
        justifyContent: 'center',
	},
}));

function OnStage() {
	const classes = useStyles();

	return (
		<Grid container className={classes.root}>
			<Grid item>
                <OnStageIcon size="4rem" />
                <br/> 
				ON STAGE
			</Grid>
		</Grid>
	);
}

export default OnStage;
