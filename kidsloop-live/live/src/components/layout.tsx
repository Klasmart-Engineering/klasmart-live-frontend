import clsx from "clsx";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Button from '@material-ui/core/Button';
import Drawer from "@material-ui/core/Drawer";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, useTheme, Theme } from "@material-ui/core/styles";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as React from "react";
import CameraContainer from "./cameraContainer";
import { Session, Message } from "../room";
import { Messages } from "../messages";
import { SendMessage } from "../sendMessage";

const drawerWidth = 340;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        layout: {
            flex: 1,
        },
        root: {
            padding: theme.spacing(4, 5),
            [theme.breakpoints.down("sm")]: {
                padding: theme.spacing(2, 2),
            },
        },
        container: {
            display: "flex",
            height: "100%",
        },
        content: {
            flexGrow: 1,
            marginRight: -drawerWidth,
            padding: theme.spacing(2),
            transition: theme.transitions.create("margin", {
                duration: theme.transitions.duration.leavingScreen,
                easing: theme.transitions.easing.sharp,
            }),
        },
        contentShift: {
            marginRight: 0,
            transition: theme.transitions.create("margin", {
                duration: theme.transitions.duration.enteringScreen,
                easing: theme.transitions.easing.easeOut,
            }),
        },
        drawer: {
            flexShrink: 0,
            width: drawerWidth,
            overflowX: "hidden",
            overflowY: "auto",
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerMobile: { 
            flexShrink: 0,
            width: "100%",
            overflowX: "hidden",
        },
        drawerPaperMobile: {
            overflowY: "auto",
            width: "100%",
            height: "100%",
        },
        drawerOpened: {
            height: 0
        },
        drawerClosed: {
            height: "100%"
        }
    }),
);

interface Props {
    children?: React.ReactNode;
    isTeacher: boolean;
    users: Map<string, Session>;
    messages: Map<string, Message>;
    openDrawer: boolean;
    setOpenDrawer: () => void;
}

export default function Layout(props: Props): JSX.Element {
    const { children, isTeacher, users, messages, openDrawer, setOpenDrawer } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

    console.log("users: ", users);

    return (
        <Grid
            container
            direction="column"
            justify="space-between"
            wrap="nowrap"
            className={classes.layout}
        >
            <Grid item xs={12}>
                <Container
                    disableGutters
                    maxWidth={"xl"}
                    className={classes.root}
                >
                    <div className={classes.container}>
                        <main
                            id="iframe-container"
                            className={isSmDown ? classes.contentShift :
                                clsx(classes.content, { [classes.contentShift]: openDrawer })
                            }
                        >
                        { children || null }
                        </main>
                        <Drawer
                            className={isSmDown ? classes.drawerMobile : classes.drawer}
                            variant={isSmDown ? "temporary" : "persistent"}
                            anchor={isSmDown ? "bottom" : "right"}
                            open={openDrawer}
                            classes={{
                                root: openDrawer ? classes.drawerOpened : classes.drawerClosed,
                                paper: isSmDown ? classes.drawerPaperMobile : classes.drawer,
                            }}
                            ModalProps={{
                                hideBackdrop: true
                            }}
                        >
                            {isSmDown ?
                                <Button onClick={setOpenDrawer}>
                                    <ExpandMoreIcon />
                                </Button>
                                : <CameraContainer isTeacher={isTeacher} />
                            }
                            <Grid item xs={12} style={{ flex: 1, overflowY: "auto" }}>
                                <Messages messages={messages} />
                            </Grid>
                            <SendMessage />
                        </Drawer>
                    </div>
                </Container>
            </Grid>
        </Grid>
    );
}
