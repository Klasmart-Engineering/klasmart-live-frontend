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
import React from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({}));

interface GlobaActionsMenuProps {
	anchor?: any;
}

function ClassDetailsMenu (props: GlobaActionsMenuProps) {
    const { anchor } = props;
    const classes = useStyles();

    const [ isClassDetailsOpen, setIsClassDetailsOpen ] = useRecoilState(isClassDetailsOpenState);

    const [ value, setValue ] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <StyledPopper
            open={isClassDetailsOpen}
            anchorEl={anchor}>
            <Tabs
                value={value}
                aria-label="simple tabs example"
                onChange={handleChange}
            >
                <Tab
                    disableRipple
                    label="Class details" />
                <Tab
                    disableRipple
                    label="Class roster" />
            </Tabs>
            <TabPanel
                value={value}
                index={0}>
                <ClassDetails />
            </TabPanel>
            <TabPanel
                value={value}
                index={1}>
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
