import React from "react";
import { FormattedMessage } from "react-intl";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";

import { Videocam as CameraIcon } from "@styled-icons/material/Videocam";
import { Mic as MicIcon } from "@styled-icons/material/Mic";
import StyledIcon from "./styled/icon";

const useStyles = makeStyles(() =>
    createStyles({
        formControl: {
            width: "100%"
        }
    }),
);

export interface DeviceInfo {
    id: string,
    label: string,
    kind: string,
}

interface Props {
    disabled: boolean;
    deviceType: "video" | "audio";
    deviceId?: string;
    devices: DeviceInfo[];
    onChange: ((event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>, child: React.ReactNode) => void) | undefined;
}

export default function MediaDeviceSelect(props: Props) {
    const { disabled, deviceType, deviceId, devices, onChange } = props;
    const classes = useStyles();

    return (
        <FormControl className={classes.formControl}>
            <InputLabel>
                {disabled && !deviceId ? <FormattedMessage id="no_device_available" /> :
                    <FormattedMessage
                        id="select_device"
                        values={{ device: deviceType === "video" ? "Camera" : "Audio" }}
                    />
                }
            </InputLabel>
            <Select
                disabled={disabled}
                IconComponent={deviceType === "video"
                    ? () => <StyledIcon icon={<CameraIcon />} size="xlarge" color={disabled ? "disabled" : "primary"} />
                    // <CameraIcon size="2rem" color={disabled ? "disabled" : "primary"} />
                    : () => <StyledIcon icon={<MicIcon />} size="xlarge" color={disabled ? "disabled" : "primary"} />
                    // <MicIcon size="2rem" color={disabled ? "disabled" : "primary"} />
                }
                onChange={onChange}
                value={deviceId || ""}
            >
                {
                    devices.map((device: DeviceInfo, index: number) => (
                        <MenuItem
                            key={device.kind + ":" + device.label + ":" + device.id}
                            value={device.id}
                        >
                            {`${device.label ? device.label.charAt(0).toUpperCase() + device.label.slice(1) : deviceType === "video" ? "Camera " + (index + 1) : "Microphone " + (index + 1)}`}
                        </MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    );
}