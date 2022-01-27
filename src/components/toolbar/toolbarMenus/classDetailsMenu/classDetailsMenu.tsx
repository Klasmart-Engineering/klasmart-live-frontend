import ClassDetails from "./classDetails";
import ClassRoster from "./classRoster";
import { isClassDetailsOpenState } from "@/store/layoutAtoms";
import { StyledPopper } from "@/utils/utils";
import {
    Box,
    makeStyles,
    Tab,
    Tabs,
    Theme,
} from "@material-ui/core";
import RosterIcon from '@material-ui/icons/AccessibilityNew';
import { Info as InfoIcon } from "@styled-icons/evaicons-solid/Info";
import React,
{ useState } from "react";
import { useIntl } from "react-intl";
import { useRecoilValue } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    boxStyle: {
        padding: `22px 18px`,
    },
    tabsWrap: {
        "& button": {
            paddingTop: `5px`,
            width: `50%`,

            "& span": {
                flexDirection: `row`,

                "& svg": {
                    height: `14px`,
                    margin: `0 6px 0 0 !important`,
                },
            },
        },
    },
    popperStyle: {
        width: `calc(500/1920 * 100vw)`,
        minWidth: `400px`,
        maxWidth: `500px`,

        [theme.breakpoints.down(`sm`)]: {
            width: `100vw`,
            minWidth: `0`,
            maxWidth: `calc(100vw - 30px)`,
        },
    },
}));

interface GlobaActionsMenuProps {
	anchor: HTMLElement;
}

function ClassDetailsMenu (props: GlobaActionsMenuProps) {
    const { anchor } = props;
    const classes = useStyles();
    const intl = useIntl();

    const isClassDetailsOpen = useRecoilValue(isClassDetailsOpenState);
    const [ tabValue, setTabValue ] = useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newTabValue: number) => {
        setTabValue(newTabValue);
    };

    return (
        <StyledPopper
            open={isClassDetailsOpen}
            anchorEl={anchor}>
            <div className={classes.popperStyle}>
                <Tabs
                    centered
                    className={classes.tabsWrap}
                    value={tabValue}
                    aria-label="Class Details Tabs"
                    onChange={handleChange}
                >
                    <Tab
                        disableRipple
                        icon={<InfoIcon />}
                        label={intl.formatMessage({
                            id: `classdetails_details`,
                        })} />

                    <Tab
                        disableRipple
                        icon={<RosterIcon />}
                        label={intl.formatMessage({
                            id: `classdetails_roster`,
                        })} />
                </Tabs>

                <TabPanel
                    value={tabValue}
                    index={0}>
                    <ClassDetails />
                </TabPanel>

                <TabPanel
                    value={tabValue}
                    index={1}>
                    <ClassRoster />
                </TabPanel>
            </div>
        </StyledPopper>
    );
}

export default ClassDetailsMenu;

interface TabPanelProps {
	children?: React.ReactNode;
	index: any;
	value: any;
}

function TabPanel (props: TabPanelProps) {
    const classes = useStyles();

    const {
        children,
        value,
        index,
        ...other
    } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box
                    className={classes.boxStyle}>
                    {children}
                </Box>
            )}
        </div>
    );
}
