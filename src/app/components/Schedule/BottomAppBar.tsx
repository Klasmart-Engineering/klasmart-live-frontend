import { BottomNavigationButton } from "../icons/bottomNavigationButton";
import {
    ScheduleAppBarItem,
    useScheduleTab,
} from "@/app/model/scheduleModel";
import LiveIconClosed from "@/assets/img/schedule-icon/live_icon_closed.svg";
import LiveIconOpen from "@/assets/img/schedule-icon/live_icon_open.svg";
import StudyIconClosed from "@/assets/img/schedule-icon/study_icon_closed.svg";
import StudyIconOpen from "@/assets/img/schedule-icon/study_icon_open.svg";
import {
    createStyles,
    Grid,
    makeStyles,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        borderTop: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(0, 8),
    },
}));

export default function ScheduleBottomAppBar () {

    const classes = useStyles();
    const [ selectedItem, setSelectedItem ] = useScheduleTab();

    return (
        <Grid
            container
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
                            src={selectedItem === ScheduleAppBarItem.LIVE ? LiveIconOpen : LiveIconClosed}
                            width={30}
                            height={30}
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
                    icon={<img
                        alt="Study Icon"
                        src={selectedItem === ScheduleAppBarItem.STUDY ? StudyIconOpen : StudyIconClosed}
                        width={23}
                        height={30}
                    />}
                    data-testid={ScheduleAppBarItem.STUDY}
                    onClick={() => setSelectedItem(ScheduleAppBarItem.STUDY)}
                />
            </Grid>
        </Grid>
    );
}
