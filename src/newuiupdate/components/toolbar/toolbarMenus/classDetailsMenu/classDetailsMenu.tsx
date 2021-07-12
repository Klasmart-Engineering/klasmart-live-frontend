import { isClassDetailsOpenState } from "../../../../states/layoutAtoms";
import { StyledPopper } from "../../../utils/utils";
import ClassDetails from "./classDetails";
import ClassRoster from "./classRoster";
import {
    Box,
    makeStyles,
    Tab,
    Tabs,
    Theme,
} from "@material-ui/core";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({}));

interface GlobaActionsMenuProps {
	anchor?: any;
}

function ClassDetailsMenu (props: GlobaActionsMenuProps) {
    const { anchor } = props;
    const classes = useStyles();
    const intl = useIntl();

    const [ isClassDetailsOpen, setIsClassDetailsOpen ] = useRecoilState(isClassDetailsOpenState);
    const [ tabValue, setTabValue ] = useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newTabValue: number) => {
        setTabValue(newTabValue);
    };

    return (
        <StyledPopper
            open={isClassDetailsOpen}
            anchorEl={anchor}>
            <Tabs
                value={tabValue}
                aria-label="Class Details Tabs"
                onChange={handleChange}
            >
                <Tab
                    disableRipple
                    label={intl.formatMessage({
                        id: `classdetails_details`,
                    })} />
                {/* TODO : Class Roster */}
                <Tab
                    disableRipple
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
                {/* TODO : Class Roster */}
                <ClassRoster />
            </TabPanel>
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
    const {
        children, value, index, ...other
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
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}
