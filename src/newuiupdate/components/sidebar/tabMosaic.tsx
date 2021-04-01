import React from "react";

import { makeStyles, useTheme, Box, Grid, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({}));

function TabMosaic() {
	const classes = useStyles();

	return (
		<Grid container>
			<Grid item xs>
				Mosaiccc
			</Grid>
		</Grid>
	);
}

export default TabMosaic;
