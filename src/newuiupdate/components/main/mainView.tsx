import React from "react";

import { makeStyles, Grid, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		background: theme.palette.background.default,
		borderRadius: 12,
		display: "flex",
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
}));

function MainView() {
	const classes = useStyles();

	return (
		<Grid container className={classes.root} id="main-content">
			<Grid item>main view</Grid>
		</Grid>
	);
}

export default MainView;
