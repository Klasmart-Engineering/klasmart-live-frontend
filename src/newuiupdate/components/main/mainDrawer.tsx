import React from "react";

import { makeStyles, useTheme, Box, Grid, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({}));

function MainDrawer() {
	const classes = useStyles();

	return (
		<>
			<Box>Chat drawer</Box>
			<Box>Pin User drawer</Box>
			<Box>Lesson Material drawer</Box>
			<Box>Teacher manual drawer</Box>
		</>
	);
}

export default MainDrawer;
