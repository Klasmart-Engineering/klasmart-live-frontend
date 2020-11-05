import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button/Button";

import { State } from "../../store/store";
import { ClassType } from "../../store/actions";
import { setClassType } from "../../store/reducers/session";

import LiveTab from "../../assets/img/live_tab.svg";
import StudyTab from "../../assets/img/study_tab.svg";

export default function SwitchClassType() {
    const theme = useTheme();
    const dispatch = useDispatch();
    function handleClickLiveTab() {
        dispatch(setClassType(ClassType.LIVE));
    }
    function handleClickStudyTab() {
        dispatch(setClassType(ClassType.STUDY));
    }
    const classType = useSelector((state: State) => state.session.classType);

    return (<>
        <Grid item xs={6} style={{
            backgroundColor: classType === ClassType.LIVE ? "#C5E9FB" : theme.palette.background.paper,
            borderTop: `1px solid ${theme.palette.divider}`
        }}>
            <Button fullWidth onClick={handleClickLiveTab}>
                <Grid container direction="column" justify="center" alignItems="center">
                    <Grid item>
                        <img src={LiveTab} height={40} />
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle2">Live</Typography>
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
                        <img src={StudyTab} height={40} />
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle2">Study</Typography>
                    </Grid>
                </Grid>
            </Button>
        </Grid>
    </>)
}
