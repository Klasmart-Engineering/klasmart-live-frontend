import {
    CordovaSystemContext,
    PermissionType,
    useCordovaSystemContext,
} from "@/app/context-provider/cordova-system-context";
import { useServices } from "@/app/context-provider/services-provider";
import StyledIcon from "@/components/styled/icon";
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
import { useSnackbar } from "@kl-engineering/kidsloop-px";
import React,
{
    useContext,
    useMemo,
} from "react";
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
    onSelectedFile: (file: File) => void;
}

export default function BottomSelector (props: Props) {
    const {
        open,
        onOpen,
        onClose,
        onSelectedFile,
    } = props;
    const classes = useStyles();
    const { requestPermissions } = useCordovaSystemContext();
    const { fileSelectService } = useServices();
    const { isAndroid } = useContext(CordovaSystemContext);
    const { enqueueSnackbar } = useSnackbar();

    const showError = (msg: string) => {
        enqueueSnackbar(msg, {
            variant: `error`,
            anchorOrigin: {
                vertical: `bottom`,
                horizontal: `center`,
            },
        });
    };

    const selectFile = () => {
        requestPermissions({
            permissionTypes: [ PermissionType.READ_STORAGE ],
            onSuccess: async (hasPermission) => {
                if (!hasPermission) {
                    showError(`Couldn't request permissions`);
                    return;
                }
                try {
                    if(!fileSelectService) return;
                    const file = await fileSelectService.selectFile();
                    onSelectedFile(file);
                } catch (error) {
                    console.error(error);
                }
            },
            onError: () => {
                showError(`Couldn't request permissions`);
            },
        });
    };

    const selectGallery = () => {
        requestPermissions({
            permissionTypes: [ PermissionType.READ_STORAGE ],
            onSuccess: async (hasPermission) => {
                if (!hasPermission) {
                    showError(`Couldn't request permissions`);
                    return;
                }
                try {
                    if(!fileSelectService) return;
                    const file = await fileSelectService.selectFromGallery(isAndroid);
                    onSelectedFile(file);
                } catch (error) {
                    console.error(error);
                }
            },
            onError: () => {
                showError(`Couldn't request permissions`);
            },
        });
    };

    const selectCamera = () => {
        requestPermissions({
            permissionTypes: [ PermissionType.CAMERA ],
            onSuccess: async (hasPermission) => {
                if (!hasPermission) {
                    showError(`Couldn't request permissions`);
                    return;
                }
                try {
                    if(!fileSelectService) return;
                    const file = await fileSelectService.selectFromCamera();
                    onSelectedFile(file);
                } catch (error) {
                    console.error(error);
                }
            },
            onError: () => {
                showError(`Couldn't request permissions`);
            },
        });
    };

    const fileSelector = useMemo(() => {
        return [
            {
                enable: true,
                onClick: selectFile,
                icon: <FileIcon/>,
                labelId: `button_file`,
                defaultLabel: `File`,
            },
            {
                enable: true,
                onClick: selectCamera,
                icon: <CameraIcon/>,
                labelId: `button_camera`,
                defaultLabel: `Camera`,
            },
            {
                enable: !isAndroid,
                onClick: selectGallery,
                icon: <ImageIcon/>,
                labelId: `button_gallery`,
                defaultLabel: `Gallery`,
            },
        ];
    }, [
        isAndroid,
        selectFile,
        selectGallery,
        selectCamera,
    ]);

    return (
        <>
            <SwipeableDrawer
                disableSwipeToOpen
                anchor="bottom"
                classes={{
                    paper: classes.drawer_paper,
                }}
                open={open}
                onClose={onClose}
                onOpen={onOpen}
            >
                <Box
                    mt={1}
                    display="flex"
                    justifyContent="center">
                    <span className={classes.top_bar}></span>
                </Box>
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                >
                    {
                        fileSelector.map(selector =>
                            selector.enable && <Grid
                                key={selector.labelId}
                                item
                                xs
                            >
                                <Button
                                    fullWidth
                                    onClick={selector.onClick}
                                >
                                    <Box
                                        py={5}
                                        flexDirection="colum">
                                        <StyledIcon
                                            icon={selector.icon}
                                            size="3rem"
                                            color={THEME_COLOR_SECONDARY_DEFAULT}
                                        />
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            <FormattedMessage
                                                id={selector.labelId}
                                                defaultMessage={selector.defaultLabel}/>
                                        </Typography>
                                    </Box>
                                </Button>
                            </Grid>)
                    }
                </Grid>
            </SwipeableDrawer>
        </>
    );
}
