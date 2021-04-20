import { isLessonPlanOpenState } from "../../../states/layoutAtoms";
import { TabPanel } from "../../utils/utils";
import Manuals from "./manuals";
import Plan from "./plan";
import {
    Grid,
    makeStyles,
    Tab,
    Tabs,
    Theme,
    Typography,
} from "@material-ui/core";
import { CloseCircle as CloseIcon } from "@styled-icons/ionicons-solid/CloseCircle";
import React, { useState } from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    fullHeight:{
        height: `100%`,
    },
    tabs:{
        margin: `0 -10px`,
        borderTop: `1px solid rgba(0,0,0,0.1)`,
        borderBottom: `1px solid rgba(0,0,0,0.1)`,
    },
    tabsFlexContainer:{
        display: `block`,
        textAlign: `center`,
    },
    title:{
        fontSize: `1rem`,
        fontWeight: 600,
        textAlign: `center`,
        marginTop: -5,
        marginBottom: 5,
    },
    closeTab:{
        cursor: `pointer`,
        position: `absolute`,
        right: 5,
        top: 5,
    },
}));

function LessonPlan () {
    const classes = useStyles();
    const [ isLessonPlanOpen, setIsLessonPlanOpen ] = useRecoilState(isLessonPlanOpenState);

    const [ value, setValue ] = useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Grid
            container
            direction="column"
            className={classes.fullHeight}>
            <Grid item>
                <div
                    className={classes.closeTab}
                    onClick={() => setIsLessonPlanOpen(false)}>
                    <CloseIcon size="1.25rem" />
                </div>
                <Typography className={classes.title}>Lesson Plan</Typography>
                <Tabs
                    value={value}
                    classes={{
                        root: classes.tabs,
                        flexContainer: classes.tabsFlexContainer,
                    }}
                    onChange={handleChange}
                >
                    <Tab
                        disableRipple
                        label="Lesson Plan" />
                    <Tab
                        disableRipple
                        label="Teacher Manuals" />
                </Tabs>
            </Grid>
            <Grid
                item
                xs>
                <TabPanel
                    value={value}
                    index={0}>
                    <Plan />
                </TabPanel>
                <TabPanel
                    value={value}
                    index={1}>
                    <Manuals />
                </TabPanel>
            </Grid>
        </Grid>
    );
}

export default LessonPlan;
