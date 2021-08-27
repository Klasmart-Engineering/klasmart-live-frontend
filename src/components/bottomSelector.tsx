import React, { useContext } from "react";
import {Box, Button, Grid, SwipeableDrawer, Typography} from "@material-ui/core";
import {Camera as CameraIcon, File as FileIcon, Image as ImageIcon} from "@styled-icons/feather"
import {FormattedMessage} from "react-intl";
import {makeStyles, Theme} from "@material-ui/core/styles";
import StyledIcon from "./styled/icon";
import { CordovaSystemContext } from "../context-provider/cordova-system-context";

const useStyles = makeStyles((theme: Theme) => ({
    drawer_paper: {
        borderRadius: "12px 12px 0 0",
    },
    top_bar: {
        borderRadius: 15,
        backgroundColor: "#3676CE",
        width: "50px",
        height: "5px"

    }
}));

interface Props {
    onClose: React.ReactEventHandler<{}>;
    onOpen: React.ReactEventHandler<{}>;
    open: boolean;
    onSelectFile: React.ReactEventHandler<{}>;
    onSelectCamera: React.ReactEventHandler<{}>;
    onSelectGallery: React.ReactEventHandler<{}>;
}

export function BottomSelector({
                                   open,
                                   onOpen,
                                   onClose,
                                   onSelectFile,
                                   onSelectCamera,
                                   onSelectGallery
                               }: Props): JSX.Element {
    const classes = useStyles();

    const { isAndroid } = useContext(CordovaSystemContext);

    return (
        <React.Fragment>
            <SwipeableDrawer
                anchor={"bottom"}
                disableSwipeToOpen
                classes={{
                    paper: classes.drawer_paper
                }}
                onClose={onClose} onOpen={onOpen} open={open}>
                <Grid container justify="center">
                    <Grid item>
                        <Box mt={1} className={classes.top_bar}/>
                    </Grid>
                </Grid>
                <Grid
                    container
                    direction={"row"}
                    justify={"space-between"}
                >
                    <Grid item xs>
                        <Button fullWidth onClick={onSelectFile}>
                            <Box py={5}>
                                <Grid
                                    container
                                    direction={"column"}
                                    alignItems={"center"}
                                >
                                    <Grid item>
                                        <StyledIcon icon={<FileIcon/>} size={"3rem"} color={"#3676CE"}/>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant={"body2"} color={"textSecondary"}><FormattedMessage
                                            id={"button_file"} defaultMessage={"File"}/></Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Button>
                    </Grid>
                    <Grid item xs>
                        <Button fullWidth onClick={onSelectCamera}>
                            <Box py={5}>
                                <Grid
                                    container
                                    direction={"column"}
                                    alignItems={"center"}
                                >
                                    <Grid item>
                                        <StyledIcon icon={<CameraIcon/>} size={"3rem"} color={"#3676CE"}/>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant={"body2"} color={"textSecondary"}><FormattedMessage
                                            id={"button_camera"} defaultMessage={"Camera"}/></Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Button>
                    </Grid>
                    { !isAndroid ? <Grid item xs>
                        <Button fullWidth onClick={onSelectGallery}>
                            <Box py={5}>
                                <Grid
                                    container
                                    direction={"column"}
                                    alignItems={"center"}
                                >
                                    <Grid item>
                                        <StyledIcon icon={<ImageIcon/>} size={"3rem"} color={"#3676CE"}/>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant={"body2"} color={"textSecondary"}><FormattedMessage
                                            id={"button_gallery"} defaultMessage={"Gallery"}/></Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Button>
                    </Grid> : <></> }
                </Grid>
            </SwipeableDrawer>
        </React.Fragment>
    )
}
