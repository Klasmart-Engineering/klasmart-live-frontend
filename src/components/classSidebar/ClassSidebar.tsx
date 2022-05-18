import { WBToolbarContainer } from "../classContent/WBToolbar";
import StyledIcon from "@/components/styled/icon";
import {
    CLASS_DRAWER_ZINDEX,
    THEME_COLOR_GREY_400,
    THEME_COLOR_PRIMARY_DEFAULT,
} from "@/config";
import { ActiveClassDrawerState, ClassDrawerSections } from "@/store/layoutAtoms";
import {
    Box,
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import { Person as ParticipantsIcon } from "@styled-icons/material/Person";
import { FilePaper as LessonPlanIcon } from "@styled-icons/remix-fill/FilePaper";
import clsx from "clsx";
import React from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    fullHeight: {
        height: `100%`,
    },
    root: {
        padding: theme.spacing(2, 0),
        backgroundColor: theme.palette.common.white,
        position: `relative`,
        zIndex: CLASS_DRAWER_ZINDEX,
        width: 90,
    },
    fab: {
        marginBottom: theme.spacing(1),
        backgroundColor: theme.palette.common.white,
        color: THEME_COLOR_PRIMARY_DEFAULT,
    },
    fabActive: {
        backgroundColor: THEME_COLOR_GREY_400,
    },
}));

function ClassSidebar () {
    const classes = useStyles();

    const [ activeClassDrawer, setActiveClassDrawer ] = useRecoilState(ActiveClassDrawerState);

    const handleToggle = (section: ClassDrawerSections) => {
        setActiveClassDrawer(activeClassDrawer === section ? '' : section);
    };

    return (
        <Grid
            container
            className={clsx(classes.fullHeight, classes.root)}
            direction="column"
            alignItems="center"
            justifyContent="space-between"
        >
            <Grid item>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                >
                    <Fab
                        aria-label="open lesson plan"
                        className={clsx(classes.fab, {
                            [classes.fabActive]: activeClassDrawer === ClassDrawerSections.LESSON_PLAN,
                        })}
                        size="large"
                        color="inherit"
                        onClick={() => handleToggle(ClassDrawerSections.LESSON_PLAN)}
                    >
                        <StyledIcon
                            size="large"
                            color={THEME_COLOR_PRIMARY_DEFAULT}
                            icon={<LessonPlanIcon />}
                        />
                    </Fab>
                    <Fab
                        aria-label="open list participants"
                        className={clsx(classes.fab, {
                            [classes.fabActive]: activeClassDrawer === ClassDrawerSections.PARTICIPANTS,
                        })}
                        size="large"
                        color="inherit"
                        onClick={() => handleToggle(ClassDrawerSections.PARTICIPANTS)}
                    >
                        <StyledIcon
                            size="large"
                            color={THEME_COLOR_PRIMARY_DEFAULT}
                            icon={<ParticipantsIcon />}
                        />
                    </Fab>
                </Box>
            </Grid>
            <Grid item>
                <WBToolbarContainer useLocalDisplay />
            </Grid>
        </Grid>
    );
}

export default ClassSidebar;
