/* eslint-disable react/no-multi-comp */
import ClassActiveUser from "@/components/classActiveUser/ClassActiveUser";
import ClassAttendeesList from "@/components/classAttendeesList/ClassAttendeesList";
import ClassDrawer from "@/components/classDrawer/ClassDrawer";
import ClassSidebar from "@/components/classSidebar/ClassSidebar";
import { ClassContent } from "@/components/main/classContent";
import Plan from "@/components/main/lessonPlan/plan/plan";
import StyledIcon from "@/components/styled/icon";
import { THEME_COLOR_PRIMARY_DEFAULT } from "@/config";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import {
    ActiveClassDrawerState,
    classActiveUserIdState,
    ClassDrawerSections,
    selectedAttendeesState,
    showEndStudyState,
    showSelectAttendeesState,
} from "@/store/layoutAtoms";
import {
    Box,
    Grid,
    IconButton,
    makeStyles,
    Theme,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { PencilFill as SelectAttendeesIcon } from "@styled-icons/bootstrap/PencilFill";
import clsx from "clsx";
import React from "react";
import { FormattedMessage } from "react-intl";
import {
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    safeArea: {
        marginLeft: `env(safe-area-inset-left)`,
        marginRight: `env(safe-area-inset-right)`,
    },
    fullHeight: {
        width: `100%`,
        height: `100%`,
    },
    closeButton: {
        position: `fixed`,
        top: theme.spacing(1.5),
        right: theme.spacing(3),
    },
    iconButton: {
        backgroundColor: THEME_COLOR_PRIMARY_DEFAULT,
        padding: theme.spacing(1),
        "& svg": {
            color: theme.palette.common.white,
        },
        "&:hover": {
            backgroundColor: THEME_COLOR_PRIMARY_DEFAULT,
        },
    },
    mobileWeb: {
        flexDirection: `column-reverse`,
    },
}));

function MainClass () {
    const classes = useStyles();
    const showEndStudy = useRecoilValue(showEndStudyState);
    const selectedAttendees = useRecoilValue(selectedAttendeesState);
    const classActiveUserId = useRecoilValue(classActiveUserIdState);
    const setShowSelectParticipants = useSetRecoilState(showSelectAttendeesState);
    const [ activeClassDrawer, setActiveClassDrawer ] = useRecoilState(ActiveClassDrawerState);

    const { classType } = useSessionContext();

    const theme = useTheme();
    const isApp = process.env.IS_CORDOVA_BUILD;
    const isMobileWeb = useMediaQuery(theme.breakpoints.down(`xs`)) && !isApp;

    const ButtonSelectAttendees = () => {
        return (
            <IconButton
                className={classes.iconButton}
                onClick={()=> {
                    setShowSelectParticipants(true);
                    setActiveClassDrawer(``);
                }}
            >
                <StyledIcon
                    icon={<SelectAttendeesIcon />}
                    size="1rem"
                />
            </IconButton>
        );
    };

    const activeUser = selectedAttendees.find(attendee => attendee.id === classActiveUserId);

    return (
        <>
            <Grid
                container
                className={clsx(classes.fullHeight, {
                    [classes.safeArea]: !isApp,
                    [classes.mobileWeb]: isMobileWeb,
                })}
            >
                {!showEndStudy && classType === ClassType.CLASSES && (
                    <Grid item>
                        <ClassSidebar
                            isMobileWeb={isMobileWeb}
                        />
                    </Grid>
                )}
                <Grid
                    item
                    xs
                >
                    <Box
                        pt={activeUser ? 0 : 4}
                        pb={!isMobileWeb && 4}
                        display="flex"
                        flexDirection="column"
                        height="100%"
                        boxSizing="border-box"
                    >
                        {!showEndStudy && activeUser && (
                            <Box
                                display="flex"
                                justifyContent="center"
                                my={2}
                            >
                                <ClassActiveUser user={activeUser} />
                            </Box>
                        )}
                        <Box flex="1">
                            <ClassContent />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <>
                <ClassDrawer
                    active={Boolean(activeClassDrawer === ClassDrawerSections.PARTICIPANTS)}
                    title={<FormattedMessage id="title_participants" />}
                    titleAction={<ButtonSelectAttendees />}
                    isMobileWeb={isMobileWeb}
                >
                    <ClassAttendeesList attendees={selectedAttendees} />
                </ClassDrawer>
                <ClassDrawer
                    active={Boolean(activeClassDrawer === ClassDrawerSections.LESSON_PLAN)}
                    title={<FormattedMessage id="title_lesson_plan" />}
                    isMobileWeb={isMobileWeb}
                >
                    <Plan />
                </ClassDrawer>
            </>
        </>
    );
}

export default MainClass;
