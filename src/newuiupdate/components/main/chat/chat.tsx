import { isChatOpenState } from "../../../states/layoutAtoms";
import { TabPanel } from "../../utils/utils";
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
import { CloseCircle as CloseIcon } from "@styled-icons/ionicons-solid/CloseCircle";
import React,
{ useState } from "react";
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
                <Typography className={classes.title}>Chat</Typography>
                <div
                    className={classes.closeTab}
                    onClick={() => setIsChatOpen(false)}>
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
