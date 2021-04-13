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

import { CloseCircle as CloseIcon } from "@styled-icons/ionicons-solid/CloseCircle";

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
    closeTab:{
        cursor: 'pointer',
        position: 'absolute',
        right: 5,
        top: 5
    }
}));

function Chat () {
    const classes = useStyles();
    const [ isChatOpen, setIsChatOpen ] = useRecoilState(isChatOpenState);
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
                <div className={classes.closeTab} onClick={() => setIsChatOpen(false)}>
                    <CloseIcon size="1.25rem" />
                </div>
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

