import { isChatOpenState } from "../../../states/layoutAtoms";
import { TabPanel } from "../../utils/utils";
import Attachments from "./attachments/attachments";
import Messages from "./messages/messages";
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
import { FormattedMessage, useIntl } from "react-intl";
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
    const intl = useIntl();
    const [ isChatOpen, setIsChatOpen ] = useRecoilState(isChatOpenState);
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
                <Typography className={classes.title}>
                    <FormattedMessage id="toolbar_chat" />
                </Typography>
                <div
                    title={intl.formatMessage({
                        id: `common_close_tab`,
                    })}
                    className={classes.closeTab}
                    onClick={() => setIsChatOpen(false)}>
                    <CloseIcon size="1.25rem" />
                </div>
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
                            id: `chat_messages`,
                        })} />
                    <Tab
                        disableRipple
                        label={intl.formatMessage({
                            id: `chat_attachments`,
                        })} />
                </Tabs>
            </Grid>
            <Grid
                item
                xs>
                <TabPanel
                    value={tabValue}
                    index={0}>
                    <Messages />
                </TabPanel>
                <TabPanel
                    value={tabValue}
                    index={1}>
                    <Attachments />
                </TabPanel>
            </Grid>
        </Grid>
    );
}

export default Chat;
