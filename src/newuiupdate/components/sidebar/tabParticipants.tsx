import React from "react";
import Layout from "./components/Layout";
import { themeProvider } from "./themeProvider";

import { makeStyles, useTheme, Box, Grid, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({}));

function TabParticipants() {
	const classes = useStyles();

	return (
		<Grid container>
			<Grid item xs>
				Participants
			</Grid>
		</Grid>
	);
}

export default TabParticipants;
