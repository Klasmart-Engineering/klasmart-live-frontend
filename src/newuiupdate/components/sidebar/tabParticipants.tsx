import React from "react";

import { Grid, Theme, makeStyles, Box, Typography } from "@material-ui/core";

import clsx from "clsx";

import { useRecoilState } from "recoil";
import { usersState } from "../../states/layoutAtoms";
import UserCamera from "../userCamera/userCamera";

const useStyles = makeStyles((theme: Theme) => ({
	cameraGrid: {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr',
		gridGap: '10px'
    },
	cameraGridSingleTeacher:{
		gridTemplateColumns: '1fr',
		minHeight: '130px',
		padding: '0 30px'
	},
	gridContainerTeachers:{
		marginBottom: '15px'
	},
	gridContainerStudents: {
		overflowY : 'scroll',
		marginBottom: -10,
		paddingBottom: 10
	},
	fullheight: {
		height: "100%",
	},
}));

function TabParticipants() {
	const classes = useStyles();
	const [users, setUsers] = useRecoilState(usersState);
	const teachers = users.filter(function (e) {
        return e.role === "teacher"
    });

    const students = users.filter(function (e) {
        return e.role === "student"
    });

	return (
		<Grid container direction="column" className={classes.fullheight}>
			<Grid item className={classes.gridContainerTeachers}>
				<Box className={clsx(classes.cameraGrid, {[classes.cameraGridSingleTeacher] : teachers.length === 1})}>
					{teachers.map((user) => (
						<UserCamera user={user} />
					))}
				</Box>
			</Grid>
			<Grid item xs className={classes.gridContainerStudents}>
				<Box className={classes.cameraGrid}>
					{students.map((user) => (
						<UserCamera user={user} />
					))}
				</Box>
			</Grid>
		</Grid>
	);
}

export default TabParticipants;
