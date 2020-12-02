import React, { useContext } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector, useDispatch } from "react-redux";
import { createStyles, makeStyles, useTheme, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import Lightswitch from "../../components/lightswitch";
import LanguageSelect from "../../components/languageSelect";
import { State } from "../../store/store";
import { ClassType } from "../../store/actions";
import { setColsCamera, setColsObserve } from "../../store/reducers/control";
import { UserContext } from "../../entry";

const OPTION_COLS_CAMERA = [
    { id: "option-cols-camera-2", title: <FormattedMessage id="two_columns" />, value: 2 },
    { id: "option-cols-camera-3", title: <FormattedMessage id="three_columns" />, value: 3 },
]

const OPTION_COLS_OBSERVE = [
    { id: "option-cols-observe-2", title: <FormattedMessage id="two_columns" />, value: 2 },
    { id: "option-cols-observe-4", title: <FormattedMessage id="four_columns" />, value: 4 },
    { id: "option-cols-observe-6", title: <FormattedMessage id="six_columns" />, value: 6 },
]

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        spacing: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 48,
            paddingLeft: theme.spacing(2),
        },
        formControlSelect: {
            width: "100%"
        }
    }),
);

export function Settings() {
    const theme = useTheme();
    const { spacing, formControlSelect } = useStyles();
    const { classType, teacher } = useContext(UserContext);
    const dispatch = useDispatch();
    const colsCamera = useSelector((state: State) => state.control.colsCamera);
    const colsObserve = useSelector((state: State) => state.control.colsObserve);
    const isMobileOnly = useSelector((store: State) => store.session.userAgent.isMobileOnly)

    return (
        <Grid
            container
            direction="column"
            style={{ overflow: "hidden", padding: theme.spacing(2) }}
        >
            {/* Toggle button for testing in dev environment */}
            {/* {new URL(window.location.href).hostname === "localhost" ? <button onClick={toggleClassType}>Toggle classType for Testing</button> : null} */}

            <Lightswitch type="text" />

            <Grid container direction="row" alignItems="center">
                <Grid item xs={6}>
                    <Typography variant="body2">
                        <FormattedMessage id="language" />
                    </Typography>
                </Grid>
                <Grid item xs={6} style={{ textAlign: "right" }}>
                    <LanguageSelect />
                </Grid>
            </Grid>

            {classType !== ClassType.LIVE ? null : <>
                {/* Mobile always display 2 Cameras per row */}
                {isMobileOnly ? null : <>
                    <div className={spacing} />
                    <Grid item xs={12}>
                        <Typography variant="caption" color="textSecondary">
                            <FormattedMessage id="cols_camera_per_row" />
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl className={formControlSelect}>
                            <Select
                                value={colsCamera}
                                onChange={(e) => dispatch(setColsCamera(Number(e.target.value)))}
                            >
                                {OPTION_COLS_CAMERA.map((option) => <MenuItem key={option.id} value={option.value}>{option.title}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                </>}

                {!teacher ? null : <>
                    <div className={spacing} />
                    <Grid item xs={12}>
                        <Typography variant="caption" color="textSecondary">
                            <FormattedMessage id="cols_observe_per_row" />
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl className={formControlSelect}>
                            <Select
                                value={colsObserve}
                                onChange={(e) => dispatch(setColsObserve(Number(e.target.value)))}
                            >
                                {OPTION_COLS_OBSERVE.map((option) => <MenuItem key={option.id} value={option.value}>{option.title}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                </>}
            </>}
        </Grid >
    )
}
