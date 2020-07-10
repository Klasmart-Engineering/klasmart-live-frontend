import useMediaQuery from '@material-ui/core/useMediaQuery';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, useTheme, Theme } from "@material-ui/core/styles";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import React, { useContext, useState } from "react";
import { FormattedMessage } from "react-intl";
import { RecordedIframe } from "../../components/recordediframe";
import CameraContainer from "../../components/cameraContainer";
import { sessionIdContext } from "../../entry";
import { Content, Message } from "../../room";

const drawerWidth = 340;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
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
        drawerRoot: {
            height: 0
        }
    }),
);

interface Props {
    content: Content;
    openDrawer: boolean;
    setOpenDrawer: () => void;
    // teacher: any; // TODO
}

export function Student(props: Props): JSX.Element {
    const { content, openDrawer, setOpenDrawer } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

    const sessionId = useContext(sessionIdContext);
    const [streamId, setStreamId] = useState<string>();
    const [width, setWidth] = useState<string | number>("100%");
    const [height, setHeight] = useState<string | number>("100%");

    return (<>
        <Grid
            container
            style={{ border: "1px solid gray", borderRadius: 12 }}
        >
            <RecordedIframe
                contentId={content.contentId}
                setStreamId={setStreamId}
                parentWidth={width}
                parentHeight={height}
                setParentWidth={setWidth}
                setParentHeight={setHeight}
            />
            <Grid item xs={12}>
                <Grid
                    container
                    justify="flex-end"
                    style={{ width: "100%", margin: "0 auto", borderTop: "1px solid gray" }}
                >
                    <Grid item>
                        <Button
                            aria-label="open preview drawer"
                            onClick={setOpenDrawer}
                            size="small"
                            style={{
                                color: "black",
                                padding: "2px 5px",
                                marginRight: 8,
                                borderRadius: 12,
                                margin: "2px 8px",
                            }}
                        >
                            <MenuOpenIcon style={{ paddingRight: 5 }} />
                            <FormattedMessage id={openDrawer ? "close_preview_drawer" : "open_preview_drawer"} />
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        {isSmDown ? <CameraContainer isTeacher={false} /> : null}
    </>)
}
