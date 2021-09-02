import LiveTab from "../../../assets/img/live_tab.svg";
import StudyTab from "../../../assets/img/study_tab.svg";
import { ClassType } from "../../../store/actions";
import { scheduleState } from "../../model/scheduleModel";
import { heightActionButton } from "../../utils/fixedValues";
import Button from "@material-ui/core/Button/Button";
import Grid from "@material-ui/core/Grid";
import { useTheme } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useRecoilState } from "recoil";

export default function ClassTypeSwitcher () {
    const [ schedule, setSchedule ] = useRecoilState(scheduleState);

    const theme = useTheme();
    function handleClickLiveTab () {
        setSchedule({
            ...schedule,
            viewClassType: ClassType.LIVE,
        });
    }
    function handleClickStudyTab () {
        setSchedule({
            ...schedule,
            viewClassType: ClassType.STUDY,
        });
    }

    return (
        <Grid
            container
            item
            direction="row"
            justify="space-between"
            style={{
                flexGrow: 0,
                height: heightActionButton,
            }}
        >
            <Grid
                item
                xs={6}
                style={{
                    backgroundColor: schedule.viewClassType === ClassType.LIVE ? `#C5E9FB` : theme.palette.background.paper,
                    borderTop: `1px solid ${theme.palette.divider}`,
                }}>
                <Button
                    fullWidth
                    onClick={handleClickLiveTab}>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="center">
                        <Grid item>
                            <img
                                src={LiveTab}
                                height={32} />
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
                style={{
                    backgroundColor: schedule.viewClassType === ClassType.STUDY ? `#C5E9FB` : theme.palette.background.paper,
                    borderTop: `1px solid ${theme.palette.divider}`,
                }}>
                <Button
                    fullWidth
                    onClick={handleClickStudyTab}>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="center">
                        <Grid item>
                            <img
                                src={StudyTab}
                                height={32} />
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
