import { isChatOpenState } from "../../../states/layoutAtoms";
import Attachments from "./attachments";
import Messages from "./messages";
import {
    Grid,
    makeStyles,
    Tab,
    Tabs,
    Theme,
    Typography,
} from "@material-ui/core";

import React,
{ useState } from "react";
import { useRecoilState } from "recoil";
import { TabPanel } from "../../utils";

const useStyles = makeStyles((theme: Theme) => ({
    fullHeight:{
        height: `100%`,
    },
    tabs:{
        paddingTop: 0,
    },
    tabsFlexContainer:{
        display: `block`,
        textAlign: `right`,
    },
    title:{
        position: `absolute`,
        fontSize: `1.25rem`,
        top: 13,
        fontWeight: 600,
    },
}));

function Chat () {
    const [ drawerWidth, setDrawerWidth ] = useState<number | string | any>(340);
    const [ isChatOpen, setIsChatOpen ] = useRecoilState(isChatOpenState);

    const classes = useStyles();

    const [ value, setValue ] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Grid
            container
            direction="column"
            className={classes.fullHeight}>
            <Grid item>
                <Typography className={classes.title}>Class Chat</Typography>
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
                        label="Messages" />
                    <Tab
                        disableRipple
                        label="Attachments" />
                </Tabs>
            </Grid>
            <Grid
                item
                xs>
                <TabPanel
                    value={value}
                    index={0}>
                    <Messages />
                </TabPanel>
                <TabPanel
                    value={value}
                    index={1}>
                    <Attachments />
                </TabPanel>
            </Grid>
        </Grid>
    );
}

export default Chat;

