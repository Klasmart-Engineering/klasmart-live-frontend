import {
    CLASS_DRAWER_ZINDEX,
    CLASS_SIDEBAR_WIDTH,
    THEME_COLOR_GREY_200,
} from "@/config";
import { ActiveClassDrawerState } from "@/store/layoutAtoms";
import {
    Box,
    Drawer,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import { ChevronLeft as ArrowBackIcon } from "@styled-icons/entypo/ChevronLeft";
import clsx from "clsx";
import React from "react";
import { useSetRecoilState } from "recoil";

const DRAWER_WIDTH = 340;

interface Props {
	children?: React.ReactNode;
	active?: boolean;
    title: string | React.ReactNode;
    titleAction?: React.ReactNode;
    isMobileWeb?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        background: `transparent`,
        padding: theme.spacing(3),
        left: CLASS_SIDEBAR_WIDTH,
        boxSizing: `border-box`,
        boxShadow: `none`,
        width: DRAWER_WIDTH,
    },
    paperMobile: {
        background: `transparent`,
        padding: theme.spacing(3),
        bottom: CLASS_SIDEBAR_WIDTH,
        boxSizing: `border-box`,
        boxShadow: `none`,
        width: DRAWER_WIDTH,
    },
    inner: {
        padding: theme.spacing(2),
        borderRadius: theme.spacing(1),
        height: `100%`,
        boxSizing: `border-box`,
        backgroundColor: THEME_COLOR_GREY_200,
        display: `flex`,
        flexDirection: `column`,
    },
    innerMobile: {
        height: `calc(100vh - ${CLASS_SIDEBAR_WIDTH + theme.spacing(4)}px)`,
    },
    drawerContent: {
        overflowY: `auto`,
    },
    iconTitle: {
        cursor: `pointer`,
        width: 50,
    },
    fontWeightBold: {
        fontWeight: theme.typography.fontWeightBold as number,
    },
}));

function ClassDrawer (props: Props) {
    const classes = useStyles();

    const {
        title,
        titleAction,
        children,
        active,
        isMobileWeb,
    } = props;
    const setActiveClassDrawer = useSetRecoilState(ActiveClassDrawerState);

    return (
        <Drawer
            anchor={isMobileWeb ? `bottom` : `left`}
            open={active}
            classes={{
                paper: isMobileWeb ? classes.paperMobile : classes.paper,
            }}
            style={{
                zIndex: CLASS_DRAWER_ZINDEX - 1,
            }}
            onClose={() => setActiveClassDrawer(``)}
        >
            <div
                className={clsx(classes.inner, {
                    [classes.innerMobile]: isMobileWeb,
                })}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                >
                    <Box
                        className={classes.iconTitle}
                        onClick={() => setActiveClassDrawer(``)}
                    >
                        {!isMobileWeb && <ArrowBackIcon size="1.5em" />}
                    </Box>
                    <Typography
                        variant="h6"
                        className={classes.fontWeightBold}
                    >{title}
                    </Typography>
                    <Box
                        className={classes.iconTitle}
                        textAlign="right"
                    >
                        {titleAction}
                    </Box>
                </Box>
                <div className={classes.drawerContent}>{children}</div>
            </div>
        </Drawer>
    );
}

export default ClassDrawer;
