import React, { useState, useContext, useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector, useDispatch } from "react-redux";
import { createStyles, makeStyles, useTheme, Theme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Popover from "@material-ui/core/Popover";

import { Close as CloseIcon } from "@styled-icons/material/Close";
import { Share as ShareIcon } from "@styled-icons/material/Share";

import { Settings } from "./settings";
import InviteButton from "../invite";
import StyledIcon from "../../components/styled/icon";
import CenterAlignChildren from "../../components/centerAlignChildren";
import { LocalSessionContext } from "../../entry";
import { MaterialTypename } from "../../lessonMaterialContext";
import { State } from "../../store/store";
import { ClassType } from "../../store/actions";
import { setDrawerOpen, setContentIndex } from "../../store/reducers/control";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        drawerContentRoot: {
            flex: 1,
            overflowX: "hidden",
            overflowY: "auto",
            maxHeight: `calc(100vh - ${theme.spacing(6)}px)`,
        },
        step: {
            cursor: "pointer",
        },
        toolbar: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 48,
            paddingLeft: theme.spacing(2),
        },
    }),
);

interface TabPanelProps {
    index: number;
    tab: { icon: JSX.Element, title: string };
    value: number;
}

export function TabPanel(props: TabPanelProps) {
    const { index, tab, value, ...other } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
    const { isTeacher } = useContext(LocalSessionContext);

    const dispatch = useDispatch();
    const isMobileOnly = useSelector((state: State) => state.session.userAgent.isMobileOnly);
    const drawerOpen = useSelector((state: State) => state.control.drawerOpen);

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => { setAnchorEl(null); }
    const open = Boolean(anchorEl);
    const id = open ? "share-popover" : undefined;

    const isLocalFile = useMemo<boolean>(() => {
        return new URL(window.location.href).origin === 'file://';
    }, [window.location.href]);

    return (
        <>
            <div
                aria-labelledby={`vertical-tab-${index}`}
                id={`vertical-tabpanel-${index}`}
                hidden={!drawerOpen || (value !== index)}
                role="tabpanel"
                {...other}
            >
                <Grid item className={classes.toolbar}>
                    <Typography variant="body1" style={{ fontSize: isSmDown ? "unset" : "1rem" }}>
                        <CenterAlignChildren>
                            <FormattedMessage id={tab.title} />
                            {isTeacher && tab.title === "title_participants" && !isLocalFile ?
                                <IconButton aria-label="share popover" onClick={handleClick}>
                                    <ShareIcon size="1rem" />
                                </IconButton> : null
                            }
                        </CenterAlignChildren>
                    </Typography>
                    {isMobileOnly ? null :
                        <IconButton aria-label="minimize drawer" onClick={() => dispatch(setDrawerOpen(false))}>
                            <StyledIcon icon={<CloseIcon />} size="medium" color={"#000"} />
                        </IconButton>
                    }
                </Grid>
                <Divider />
                <TabInnerContent title={tab.title} />
            </div>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <InviteButton />
            </Popover>
        </>
    );
}

function TabInnerContent({ title }: { title: string }) {
    const { classtype, materials } = useContext(LocalSessionContext);
    const classes = useStyles();
    const dispatch = useDispatch();
    const contentIndex = useSelector((store: State) => store.control.contentIndex);

    switch (title) {
        case "title_lesson_plan":
            return (
                <Grid item className={classes.drawerContentRoot}>
                    <Stepper
                        style={{ overflowX: "hidden", overflowY: "auto" }}
                        activeStep={contentIndex}
                        orientation="vertical"
                    >
                        {classtype === ClassType.LIVE ?
                            materials.map((material, index) => (
                                <Step
                                    key={`step-${material.name}`}
                                    onClick={() => dispatch(setContentIndex(index))}
                                    disabled={false}
                                    className={classes.step}
                                >
                                    <StepLabel key={`label-${material.name}`}>{material.name}</StepLabel>
                                </Step>
                            )) :
                            materials
                                .map((material, index) => (
                                    <Step
                                        key={`step-${material.name}`}
                                        onClick={() => dispatch(setContentIndex(index))}
                                        disabled={false}
                                        className={classes.step}
                                    >
                                        <StepLabel key={`label-${material.name}`}>{material.name}</StepLabel>
                                    </Step>
                                ))}
                    </Stepper>
                </Grid>
            );
        case "title_settings":
            return <Settings />
        default:
            return (<Typography>Item <FormattedMessage id={title} /></Typography>);
    }
}