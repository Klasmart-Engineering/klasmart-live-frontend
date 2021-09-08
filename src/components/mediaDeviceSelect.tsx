import StyledIcon from "./styled/icon";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";
import { Mic as MicIcon } from "@styled-icons/material/Mic";
import { Videocam as CameraIcon } from "@styled-icons/material/Videocam";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(() =>
    createStyles({
        formControl: {
            width: `100%`,
        },
    }));

interface Props {
    disabled: boolean;
    deviceType: "video" | "audio";
    deviceId?: string;
    devices: MediaDeviceInfo[];
    onChange: ((event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>, child: React.ReactNode) => void) | undefined;
}

export default function MediaDeviceSelect (props: Props) {
    const {
        disabled,
        deviceType,
        deviceId,
        devices,
        onChange,
    } = props;
    const classes = useStyles();

    return (
        <FormControl className={classes.formControl}>
            <InputLabel>
                {disabled && !deviceId ? <FormattedMessage id="no_device_available" /> :
                    <FormattedMessage
                        id="select_device"
                        values={{
                            device: deviceType === `video` ? `Camera` : `Audio`,
                        }}
                    />
                }
            </InputLabel>
            <Select
                disabled={disabled}
                IconComponent={deviceType === `video`
                    ? () => <StyledIcon
                        icon={<CameraIcon />}
                        size="xlarge"
                        color={disabled ? `disabled` : `primary`} />
                    // <CameraIcon size="2rem" color={disabled ? "disabled" : "primary"} />
                    : () => <StyledIcon
                        icon={<MicIcon />}
                        size="xlarge"
                        color={disabled ? `disabled` : `primary`} />
                    // <MicIcon size="2rem" color={disabled ? "disabled" : "primary"} />
                }
                value={deviceId || ``}
                onChange={onChange}
            >
                {
                    devices.map((device: MediaDeviceInfo) => (
                        <MenuItem
                            key={device.kind + `:` + device.label + `:` + device.deviceId}
                            value={device.deviceId}
                        >
                            {`${device.label ? device.label.charAt(0).toUpperCase() + device.label.slice(1) : `Unknown Device`}(${device.deviceId.slice(0, 4)})`}
                        </MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    );
}
