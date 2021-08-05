import { isLessonPlanOpenState } from "../../../../store/layoutAtoms";
import { TabPanel } from "../../utils/utils";
import Manuals from "./manuals/manuals";
import Plan from "./plan/plan";
import {
    Grid,
    makeStyles,
    Tab,
    Tabs,
    Theme,
    Typography,
} from "@material-ui/core";
import { CloseCircle as CloseIcon } from "@styled-icons/ionicons-solid/CloseCircle";
import React,
{ useState } from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";
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
        display: `none`,
    },
}));

function LessonPlan () {
    const classes = useStyles();
    const intl = useIntl();

    const [ isLessonPlanOpen, setIsLessonPlanOpen ] = useRecoilState(isLessonPlanOpenState);
    const [ tabValue, setTabValue ] = useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newTabValue: number) => {
        setTabValue(newTabValue);
    };

    return (
        <Grid
            container
            direction="column"
            className={classes.fullHeight}>
            <Grid item>
                <div
                    title={intl.formatMessage({
                        id: `common_close_tab`,
                    })}
                    className={classes.closeTab}
                    onClick={() => setIsLessonPlanOpen(false)}>
                    <CloseIcon size="1.25rem" />
                </div>
                <Typography className={classes.title}>
                    <FormattedMessage id="toolbar_lesson_plan" />
                </Typography>
                <Tabs
                    value={tabValue}
                    classes={{
                        root: classes.tabs,
                        flexContainer: classes.tabsFlexContainer,
                    }}
                    onChange={handleChange}
                >
                    <Tab
                        disableRipple
                        label={intl.formatMessage({
                            id: `lessonplan_content`,
                        })} />
                    {/* TODO : NKL-546 (Show teacher manuals), see with Jubilee for more details
                    <Tab
                        disableRipple
                        label={intl.formatMessage({
                            id: `lessonplan_manuals`,
                        })} /> */}
                </Tabs>
            </Grid>
            <Grid
                item
                xs>
                <TabPanel
                    value={tabValue}
                    index={0}>
                    <Plan />
                </TabPanel>
                <TabPanel
                    value={tabValue}
                    index={1}>
                    <Manuals />
                </TabPanel>
            </Grid>
        </Grid>
    );
}

export default LessonPlan;
