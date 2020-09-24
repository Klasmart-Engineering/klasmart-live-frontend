import React from "react";
import { FormattedMessage } from "react-intl";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button/Button";

import LiveTab from "../../assets/img/live_tab.svg";
import StudyTab from "../../assets/img/study_tab.svg";

import { State } from "../../store/store";
import { ClassType } from "../../store/actions";
import { setClassType } from "../../store/reducers/session";
import { heightActionButton } from "../../utils/fixedValues";

export default function ClassTypeSwitcher() {
    const theme = useTheme();
    const dispatch = useDispatch();
    function handleClickLiveTab() {
        dispatch(setClassType(ClassType.LIVE));
    }
    function handleClickStudyTab() {
        dispatch(setClassType(ClassType.STUDY));
    }
    const classType = useSelector((state: State) => state.session.classType);

    return (
        <Grid
            container
            direction="row"
            justify="space-between"
            item
            style={{ flexGrow: 0, height: heightActionButton }}
        >
            <Grid item xs={6} style={{
                backgroundColor: classType === ClassType.LIVE ? "#C5E9FB" : theme.palette.background.paper,
                borderTop: `1px solid ${theme.palette.divider}`
            }}>
                <Button fullWidth onClick={handleClickLiveTab}>
                    <Grid container direction="column" justify="center" alignItems="center">
                        <Grid item>
                            <img src={LiveTab} height={32} />
                        </Grid>
                        <Grid item>
                            <Typography variant="subtitle2">
                                <FormattedMessage id="schedule_liveTab" />
                            </Typography>
                        </Grid>
                    </Grid>
                </Button>
            </Grid>
            <Grid item xs={6} style={{
                backgroundColor: classType === ClassType.STUDY ? "#C5E9FB" : theme.palette.background.paper,
                borderTop: `1px solid ${theme.palette.divider}`
            }}>
                <Button fullWidth onClick={handleClickStudyTab}>
                    <Grid container direction="column" justify="center" alignItems="center">
                        <Grid item>
                            <img src={StudyTab} height={32} />
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
    )
}
