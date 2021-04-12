import React, { useEffect } from "react";

import { Grid, makeStyles, Theme, Box } from "@material-ui/core";
import Toolbar from "../toolbar";

import Chat from "../main/chat/chat";
import { StyledDrawer } from "../utils";

import clsx from "clsx";

import { useRecoilState } from "recoil";
import { isChatOpenState, usersState, mosaicViewSizeState } from "../../states/layoutAtoms";
import UserCamera from "../userCamera/userCamera";

const useStyles = makeStyles((theme: Theme) => ({
	cameraGrid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(4, 1fr)',
		gridGap: 20,
		padding: '0 30px',
		"&>div":{
			minHeight: 260,
			fontSize: '1.35rem'
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
		position: 'relative'
	},
	fullheight: {
		height: "100%",
	},
	viewContainer:{
		height: "100%",
		position: 'relative',
		overflow: 'hidden',
	},
	drawerContainer:{
		paddingBottom: 20
	},
	toolbarContainer:{
		display: 'flex',
		alignItems: 'center'
	},
	cameraGrid3:{gridTemplateColumns: 'repeat(3, 1fr)'},
	cameraGrid4:{gridTemplateColumns: 'repeat(4, 1fr)'},
	cameraGrid5:{gridTemplateColumns: 'repeat(5, 1fr)'},
	cameraGrid6:{gridTemplateColumns: 'repeat(6, 1fr)'},
	cameraGrid7:{gridTemplateColumns: 'repeat(7, 1fr)'},
	cameraGrid8:{gridTemplateColumns: 'repeat(8, 1fr)'},
}));

function TabMosaic() {
	const classes = useStyles();

	const [users, setUsers] = useRecoilState(usersState);
	const [isChatOpen, setIsChatOpen] = useRecoilState(isChatOpenState);
	const [mosaicViewSize, setMosaicViewSize] = useRecoilState(mosaicViewSizeState);

	const teachers = users.filter(function (e) {
        return e.role === "teacher"
    });

    const students = users.filter(function (e) {
        return e.role === "student"
    });

	return (
		<>
		<Grid container direction="column"  className={classes.fullheight}>
			<Grid item xs>
				<Grid container className={classes.viewContainer}>
					<Grid item xs>
						<Grid container direction="column" className={classes.fullheight}>
							<Grid item className={classes.gridContainerTeachers}>
								<Box className={classes.cameraGrid}>
									{teachers.map((user) => (
										<UserCamera key={user.id} user={user} />
									))}
								</Box>
							</Grid>
							<Grid item xs className={classes.gridContainerStudents}>
								<Box className={clsx(classes.cameraGrid, {
										[classes.cameraGrid3] : mosaicViewSize === 3,
										[classes.cameraGrid5] : mosaicViewSize === 5,
										[classes.cameraGrid6] : mosaicViewSize === 6,
										[classes.cameraGrid7] : mosaicViewSize === 7,
										[classes.cameraGrid8] : mosaicViewSize === 8,
									})}>
									{students.map((user) => (
										<UserCamera key={user.id} user={user} />
									))}
								</Box>
							</Grid>
						</Grid>
					</Grid>
					<Grid item className={classes.drawerContainer}>
						<StyledDrawer active={isChatOpen}>
							<Chat />
						</StyledDrawer>
					</Grid>
				</Grid>
			</Grid>
			<Grid item className={classes.toolbarContainer}>
				<Toolbar />
			</Grid>
		</Grid>


		</>
	);
}

export default TabMosaic;
