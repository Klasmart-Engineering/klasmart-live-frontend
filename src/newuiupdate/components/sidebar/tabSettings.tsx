import React from "react";

import { makeStyles, useTheme, Box, Grid, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({}));

function TabSettings() {
	const classes = useStyles();

	return (
		<Grid container>
			<Grid item xs>
				Settings
			</Grid>
		</Grid>
	);
}

export default TabSettings;
