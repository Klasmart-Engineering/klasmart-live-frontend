import { BottomNavigationButton } from "../icons/bottomNavigationButton";
import {
    ScheduleAppBarItem,
    useScheduleTab,
} from "@/app/model/scheduleModel";
import {
    createStyles,
    Grid,
    makeStyles,
} from "@material-ui/core";
import { Video as LiveIcon } from "@styled-icons/fa-solid/Video";
import { Book as StudyIcon } from "@styled-icons/fluentui-system-filled/Book";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        borderTop: `1px solid ${theme.palette.divider}`,
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
                    active={selectedItem === ScheduleAppBarItem.LIVE}
                    icon={<LiveIcon size="1.5rem" />}
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
                    active={selectedItem === ScheduleAppBarItem.STUDY}
                    icon={<StudyIcon size="1.5rem" />}
                    data-testid={ScheduleAppBarItem.STUDY}
                    onClick={() => setSelectedItem(ScheduleAppBarItem.STUDY)}
                />
            </Grid>
        </Grid>
    );
}
