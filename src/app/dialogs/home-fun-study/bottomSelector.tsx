import StyledIcon from "../../../components/styled/icon";
import { CordovaSystemContext } from "../../context-provider/cordova-system-context";
import { THEME_COLOR_SECONDARY_DEFAULT } from "@/config";
import {
    Box,
    Button,
    Grid,
    SwipeableDrawer,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
    Camera as CameraIcon,
    File as FileIcon,
    Image as ImageIcon,
} from "@styled-icons/feather";
import React,
{ useContext } from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(() => ({
    drawer_paper: {
        borderRadius: `12px 12px 0 0`,
    },
    top_bar: {
        borderRadius: 15,
        backgroundColor: THEME_COLOR_SECONDARY_DEFAULT,
        width: `50px`,
        height: `5px`,

    },
}));

interface Props {
    onClose: React.ReactEventHandler<{}>;
    onOpen: React.ReactEventHandler<{}>;
    open: boolean;
    onSelectFile: React.ReactEventHandler<{}>;
    onSelectCamera: React.ReactEventHandler<{}>;
    onSelectGallery: React.ReactEventHandler<{}>;
}

export function BottomSelector ({
    open,
    onOpen,
    onClose,
    onSelectFile,
    onSelectCamera,
    onSelectGallery,
}: Props): JSX.Element {
    const classes = useStyles();

    const { isAndroid } = useContext(CordovaSystemContext);

    return (
        <React.Fragment>
            <SwipeableDrawer
                disableSwipeToOpen
                anchor={`bottom`}
                classes={{
                    paper: classes.drawer_paper,
                }}
                open={open}
                onClose={onClose}
                onOpen={onOpen}>
                <Grid
                    container
                    justifyContent="center">
                    <Grid item>
                        <Box
                            mt={1}
                            className={classes.top_bar}/>
                    </Grid>
                </Grid>
                <Grid
                    container
                    direction={`row`}
                    justifyContent={`space-between`}
                >
                    <Grid
                        item
                        xs>
                        <Button
                            fullWidth
                            onClick={onSelectFile}>
                            <Box py={5}>
                                <Grid
                                    container
                                    direction={`column`}
                                    alignItems={`center`}
                                >
                                    <Grid item>
                                        <StyledIcon
                                            icon={<FileIcon/>}
                                            size={`3rem`}
                                            color={THEME_COLOR_SECONDARY_DEFAULT}/>
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            variant={`body2`}
                                            color={`textSecondary`}><FormattedMessage
                                                id={`button_file`}/></Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Button>
                    </Grid>
                    <Grid
                        item
                        xs>
                        <Button
                            fullWidth
                            onClick={onSelectCamera}>
                            <Box py={5}>
                                <Grid
                                    container
                                    direction={`column`}
                                    alignItems={`center`}
                                >
                                    <Grid item>
                                        <StyledIcon
                                            icon={<CameraIcon/>}
                                            size={`3rem`}
                                            color={THEME_COLOR_SECONDARY_DEFAULT}/>
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            variant={`body2`}
                                            color={`textSecondary`}><FormattedMessage
                                                id={`button_camera`}/></Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Button>
                    </Grid>
                    { !isAndroid ? <Grid
                        item
                        xs>
                        <Button
                            fullWidth
                            onClick={onSelectGallery}>
                            <Box py={5}>
                                <Grid
                                    container
                                    direction={`column`}
                                    alignItems={`center`}
                                >
                                    <Grid item>
                                        <StyledIcon
                                            icon={<ImageIcon/>}
                                            size={`3rem`}
                                            color={THEME_COLOR_SECONDARY_DEFAULT}/>
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            variant={`body2`}
                                            color={`textSecondary`}><FormattedMessage
                                                id={`button_gallery`}/></Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Button>
                    </Grid> : <></> }
                </Grid>
            </SwipeableDrawer>
        </React.Fragment>
    );
}
