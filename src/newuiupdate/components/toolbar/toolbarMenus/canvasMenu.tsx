import React from "react";

import { makeStyles,  Theme,  } from "@material-ui/core";


import { useRecoilState } from "recoil";
import { isCanvasOpenState } from "../../../states/layoutAtoms";

import { StyledPopper } from "../../utils";

const useStyles = makeStyles((theme: Theme) => ({}));

interface GlobaActionsMenuProps {
	anchor?: any;
}

function CanvasMenu(props: GlobaActionsMenuProps) {
	const { anchor } = props;
	const classes = useStyles();

	const [isCanvasOpen, setIsCanvasOpen] = useRecoilState(isCanvasOpenState);

	return (
		<StyledPopper open={isCanvasOpen} anchorEl={anchor}>
			Canvas
		</StyledPopper>
	);
}

export default CanvasMenu;
