import React from "react";

import { makeStyles, Grid, Theme } from "@material-ui/core";

import { PresentationChartBar as PresentIcon } from "@styled-icons/heroicons-solid/PresentationChartBar";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		height: "100%",
        alignItems: 'center',
        justifyContent: 'center',
	},
}));

function Present() {
	const classes = useStyles();

	return (
		<Grid container className={classes.root}>
			<Grid item>
				<PresentIcon size="4rem" />
                <br/> 
				OBSERVE
			</Grid>
		</Grid>
	);
}

export default Present;
