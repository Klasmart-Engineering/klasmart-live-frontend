import {
    ScheduleAppBarItem,
    useScheduleTab,
} from "@/app/model/scheduleModel";
import { heightActionButton } from "@/app/utils/fixedValues";
import LiveTab from "@/assets/img/live_tab.svg";
import StudyTab from "@/assets/img/study_tab.svg";
import {
    Button,
    createStyles,
    Grid,
    makeStyles,
    Typography,
} from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    appBarItem: {
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        "&.selected": {
            backgroundColor: `#C5E9FB`,
        },
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
            style={{
                flexGrow: 0,
                height: heightActionButton,
            }}
        >
            <Grid
                item
                xs={6}
                data-testid={`${ScheduleAppBarItem.LIVE}-container`}
                className={clsx(classes.appBarItem, {
                    selected: selectedItem === ScheduleAppBarItem.LIVE,
                })}
            >
                <Button
                    fullWidth
                    data-testid={ScheduleAppBarItem.LIVE}
                    onClick={() => setSelectedItem(ScheduleAppBarItem.LIVE)}
                >
                    <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Grid item>
                            <img
                                src={LiveTab}
                                height={32}
                            />
                        </Grid>
                        <Grid item>
                            <Typography variant="subtitle2">
                                <FormattedMessage id="schedule_liveTab" />
                            </Typography>
                        </Grid>
                    </Grid>
                </Button>
            </Grid>
            <Grid
                item
                xs={6}
                data-testid={`${ScheduleAppBarItem.STUDY}-container`}
                className={clsx(classes.appBarItem, {
                    selected: selectedItem === ScheduleAppBarItem.STUDY,
                })}
            >
                <Button
                    fullWidth
                    data-testid={ScheduleAppBarItem.STUDY}
                    onClick={() => setSelectedItem(ScheduleAppBarItem.STUDY)}
                >
                    <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Grid item>
                            <img
                                src={StudyTab}
                                height={32}
                            />
                        </Grid>
                        <Grid item>
                            <Typography variant="subtitle2">
                                <FormattedMessage id="schedule_studyTab" />
                            </Typography>
                        </Grid>
                    </Grid>
                </Button>
            </Grid>
        </Grid>
    );
}
