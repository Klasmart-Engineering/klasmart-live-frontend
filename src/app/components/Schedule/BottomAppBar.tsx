import { BottomNavigationButton } from "../icons/bottomNavigationButton";
import {
    ScheduleAppBarItem,
    useScheduleTab,
} from "@/app/model/scheduleModel";
import LiveIcon from "@/assets/img/schedule-icon/live_icon.svg";
import StudyIcon from "@/assets/img/schedule-icon/study_icon.svg";
import {
    createStyles,
    Grid,
    makeStyles,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        borderTop: `1px solid ${theme.palette.divider}`,
    },
    icon: {
        marginTop: theme.spacing(1),
    },
}));

export default function ScheduleBottomAppBar () {

    const classes = useStyles();
    const [ selectedItem, setSelectedItem ] = useScheduleTab();

    return (
        <Grid
            container
            item
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className={classes.root}
        >
            <Grid
                item
                xs={6}
                data-testid={`${ScheduleAppBarItem.LIVE}-container`}
            >
                <BottomNavigationButton
                    title={`schedule_liveTab`}
                    type="live"
                    active={selectedItem === ScheduleAppBarItem.LIVE}
                    icon={
                        <img
                            alt="Live Icon"
                            src={LiveIcon}
                            className={classes.icon}
                            width={71}
                            height={45}
                        />}
                    data-testid={`${ScheduleAppBarItem.LIVE}-container`}
                    onClick={() => setSelectedItem(ScheduleAppBarItem.LIVE)}

                />
            </Grid>
            <Grid
                item
                xs={6}
                data-testid={`${ScheduleAppBarItem.STUDY}-container`}
            >
                <BottomNavigationButton
                    title={`schedule_studyTab`}
                    type="study"
                    active={selectedItem === ScheduleAppBarItem.STUDY}
                    icon={ <img
                        alt="Study Icon"
                        src={StudyIcon}
                        className={classes.icon}
                        width={71}
                        height={45}
                    />}
                    data-testid={ScheduleAppBarItem.STUDY}
                    onClick={() => setSelectedItem(ScheduleAppBarItem.STUDY)}
                />
            </Grid>
        </Grid>
    );
}
