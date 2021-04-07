import React, { useState } from "react";

import { makeStyles, Grid, Theme, Box, Drawer } from "@material-ui/core";

import { useRecoilState } from "recoil";
import { isCanvasOpenState,} from "../../states/layoutAtoms";

const useStyles = makeStyles((theme: Theme) => ({
	styledDrawerRoot: {
		flexShrink: 0,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.shortest,
		}),

		paddingLeft: theme.spacing(2),
	},
	styledDrawerPaper: {
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.shortest,
		}),
		border: 0,
		backgroundColor: theme.palette.grey[200],
		borderRadius: 12,
	},
	styledDrawerInner: {
		padding: 10,
	},
	popperRoot:{
		zIndex: 99,
	},
	popperPapper: {
		borderRadius: 12,
		overflow: 'hidden'
	},
}));


function CanvasDrawer() {
	const [isCanvasOpen, setIsCanvasOpen] = useRecoilState(isCanvasOpenState);
    const classes = useStyles();
    const [drawerWidth, setDrawerWidth] = useState<any>(340);

	return (
		<>
			<Drawer
                anchor="bottom"
                open={isCanvasOpen}
                classes={{
                    root: classes.styledDrawerRoot,
                    paper: classes.styledDrawerPaper,
                }}
                PaperProps={{
                    style: { position: "absolute", width: drawerWidth },
                }}
                BackdropProps={{ style: { position: "absolute" } }}
                ModalProps={{
                    container: document.getElementById("main-content"),
                    style: { position: "absolute" },
                }}
                variant="persistent"
                style={{ width: isCanvasOpen ? drawerWidth : 0 }}
            >
                <Box className={classes.styledDrawerInner}>CANVAS</Box>
            </Drawer>
		</>
	);
}

export default CanvasDrawer;
