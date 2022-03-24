import {
    Badge,
    Button,
    CircularProgress,
    makeStyles,
    Theme,
    Tooltip,
} from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import { alpha } from "@material-ui/core/styles";
import LockIcon from "@material-ui/icons/Lock";
import { CameraVideoFill as CameraVideoFillIcon } from "@styled-icons/bootstrap/CameraVideoFill";
import { CameraVideoOffFill as CameraDisabledIcon } from "@styled-icons/bootstrap/CameraVideoOffFill";
import clsx from "clsx";
import { useCamera } from "kidsloop-live-state/ui";
import React from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme: Theme) => ({
    itemRoot: {
        position: `relative`,
    },
    root: {
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
        fontSize: `0.75em`,
        borderRadius: 12,
        cursor: `pointer`,
        padding: 15,
        transition: `all 100ms ease-in-out`,
        color: red[500],
        backgroundColor: alpha(red[500], 0.1),
        margin: `0 7px`,
        "&:hover": {
            backgroundColor: alpha(red[500], 0.2),
        },
        position: `relative`,
    },
    active: {
        color: `inherit`,
        backgroundColor: `inherit`,
        "&:hover": {
            color: `inherit`,
            backgroundColor: alpha(theme.palette.background.default, 0.3),
        },
    },
    locked: {
        opacity: 0.4,
        pointerEvents: `none`,
        backgroundColor: `#e2e7ec`,
        cursor: `default`,
    },
    disabled: {
        opacity: 0.4,
        pointerEvents: `none`,
        cursor: `default`,
    },
    label: {
        marginTop: 10,
    },
    badgeRoot: {
        position: `absolute`,
        top: 0,
        right: 10,
    },
    badge: {
        background: `#fff`,
        color: `#000`,
        boxShadow: `0px 2px 4px rgba(0,0,0,0.25)`,
    },
    badgeContent: {
        fontSize: `1em`,
    },
    loadingSpinner: {
        position: `absolute`,
    },
    icon: {
        width: `1.75em`,
        height: `1.75em`,
    },
}));

interface ToolbarItemCameraProps {
	disabled?: boolean;
	locked?: boolean;
}

function ToolbarItemCamera (props: ToolbarItemCameraProps) {
    const {
        disabled,
        locked,
    } = props;
    const classes = useStyles();
    const intl = useIntl();

    const camera = useCamera();

    const onClick = () => camera.setSending.execute(camera.isPausedLocally);
    const active = !camera.isPausedLocally;
    const tooltip = intl.formatMessage({
        id: active ? `toggle_camera_off` :  `toggle_camera_on`,
    });
    return (
        <>
            <div
                className={classes.itemRoot}>
                {locked && (
                    <Badge
                        classes={{
                            badge: classes.badge,
                            root: classes.badgeRoot,
                        }}
                        badgeContent={<LockIcon className={classes.badgeContent} />}
                    ></Badge>
                )}
                <Tooltip title={tooltip}>
                    <Button
                        disableRipple
                        id="toolbar-item-camera"
                        className={clsx(classes.root, (disabled || camera.setSending.loading) && classes.disabled, active && classes.active, locked && classes.locked)}
                        onClick={onClick}
                    >
                        {active ? <CameraVideoFillIcon className={classes.icon} /> : <CameraDisabledIcon className={classes.icon} />}
                        {camera.setSending.loading && <CircularProgress
                            className={classes.loadingSpinner}
                            size={25}
                            color="inherit"
                        />}
                    </Button>
                </Tooltip>
            </div>
        </>
    );
}

export default ToolbarItemCamera;
