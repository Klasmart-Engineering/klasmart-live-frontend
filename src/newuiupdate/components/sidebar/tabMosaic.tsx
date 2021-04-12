import React from "react";

import { Grid, makeStyles, Theme, Box } from "@material-ui/core";
import Toolbar from "../toolbar";

import { useRecoilState } from "recoil";
import { usersState } from "../../states/layoutAtoms";
import UserCamera from "../userCamera/userCamera";

const useStyles = makeStyles((theme: Theme) => ({
	cameraGrid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(4, 1fr)',
		gridGap: 20,
		padding: '0 30px',
		"&>div":{
			minHeight: 260,
		}
    },
	gridContainerTeachers:{
		marginBottom: 15,
		"& $cameraGrid":{
			gridTemplateColumns: 'repeat(5, 1fr)',
			"&>div":{
				minHeight: 190,
			}
		}
	},
	gridContainerStudents: {
		overflowY : 'scroll',
		marginBottom: -10
	},
	fullheight: {
		height: "100%",
	},
	toolbarContainer:{
		position: 'absolute',
		zIndex: 9,
		left: 0,
		bottom: 20,
		width: '100%'
	}
}));

function TabMosaic() {
	const classes = useStyles();

	const [users, setUsers] = useRecoilState(usersState);
	const teachers = users.filter(function (e) {
        return e.role === "teacher"
    });

    const students = users.filter(function (e) {
        return e.role === "student"
    });

	return (
		<>
			<Grid container direction="column" className={classes.fullheight}>
				<Grid item className={classes.gridContainerTeachers}>
					<Box className={classes.cameraGrid}>
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
			<Box className={classes.toolbarContainer}>
				<Toolbar />
			</Box>
		</>
	);
}

export default TabMosaic;
