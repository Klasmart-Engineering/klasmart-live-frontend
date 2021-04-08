import React, { useState } from "react";

import { makeStyles, Box, Grid, Theme, Typography } from "@material-ui/core";

import { UserAvatar } from "kidsloop-px"

import { useRecoilState } from "recoil";
import { usersState } from "../../../states/layoutAtoms";
import User from "./User";

const useStyles = makeStyles((theme: Theme) => ({
	fullHeight:{
		height: '100%',
	},
	head:{
		borderBottom: "1px solid lightgrey",
		padding: '6px 0'
	},
	container:{
		padding : `1rem 10px`,
		paddingBottom: 0,
		overflowY: 'scroll'
	},
	title:{
		fontSize: '1.25rem',
		fontWeight: 600
	},
	titleGroup:{
		fontSize: '1rem',
		fontWeight: 600
	},
	userItem:{
        marginRight: 15,
        display:"flex",
        flexDirection:"row",
        alignItems:"center"
    },
    avatar:{
        marginRight: 5
    }
}));

function PinUser() {
	const classes = useStyles();


	// TODO : Switch to real data 
	const [users, setUsers] = useRecoilState(usersState);
	const teachers = users.filter(function (e) {
        return e.role === "teacher"
    });

    const students = users.filter(function (e) {
        return e.role === "student"
    });


	return (
		<Grid container direction="column" className={classes.fullHeight}>
			<Grid item className={classes.head}>
				<Typography className={classes.title}>Pin User</Typography>
			</Grid>
			<Grid item xs className={classes.container}>
				<Box mb={2}>
					<Typography variant="h4" className={classes.titleGroup}>Teachers</Typography>
					<Box>
						{teachers.map((user) => (
							<User key={user.id} id={user.id} name={user.name} />
						))}
					</Box>
				</Box>
				<Box mb={2}>
					<Typography variant="h4" className={classes.titleGroup}>Students</Typography>
					<Box>
						{students.map((user) => (
							<User key={user.id} id={user.id} name={user.name} />
						))}
					</Box>
				</Box>
			</Grid>
		</Grid>
	);
}

export default PinUser;
