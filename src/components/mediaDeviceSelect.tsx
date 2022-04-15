import { useSessionContext } from "@/providers/session-context";
import { useWebRtcConstraints } from "@kl-engineering/live-state/ui";
import {
    Button,
    Tooltip,
} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";
import { Settings } from "@styled-icons/fluentui-system-filled/Settings";
import React,
{
    useEffect,
    useState,
    VoidFunctionComponent,
} from "react";
import { useAsync } from "react-async-hook";
import { FormattedMessage } from "react-intl";
import {
    atom,
    useRecoilState,
} from 'recoil';

const TEACHER_PREFERED_VIDEO_HEIGHT = 320;
const TEACHER_PREFERED_VIDEO_FRAMERATE = 15;

const STUDENT_PREFERED_VIDEO_HEIGHT = 160;
const STUDENT_PREFERED_VIDEO_FRAMERATE = 10;

const useStyles = makeStyles((theme) => createStyles({
    button: {
        color: theme.palette.grey[700],
        background: `none`,
        boxShadow: `none`,
        border: `1px solid ${theme.palette.grey[300]}`,
        borderRadius: theme.spacing(3),
        padding: theme.spacing(0.75, 2),
        "&:hover": {
            boxShadow: `inherit`,
            backgroundColor: theme.palette.grey[100],
        },
    },
}));

export const preferedAudioInput = atom<string|undefined>({
    key: `preferedAudioInput`,
    default: undefined,
});

export const preferedVideoInput = atom<string|undefined>({
    key: `preferedVideoInput`,
    default: undefined,
});

export const MediaDeviceSelect: VoidFunctionComponent<{
    kind: MediaDeviceKind;
}> = ({ kind }) => {
    const classes = useStyles();
    const { isTeacher } = useSessionContext();
    const [ deviceId, setDeviceId ] = useRecoilState(kind === `videoinput` ? preferedVideoInput : preferedAudioInput);
    const { setMicrophoneConstraints, setCameraConstraints } = useWebRtcConstraints();
    const onSelect = (deviceId?: string) => {
        switch(kind) {
        case `audioinput`:
            setMicrophoneConstraints({
                deviceId,
                echoCancellation: true,
                noiseSuppression: true,
            });
            break;
        case `videoinput`:
            setCameraConstraints({
                deviceId,
                height: isTeacher ? TEACHER_PREFERED_VIDEO_HEIGHT : STUDENT_PREFERED_VIDEO_HEIGHT,
                frameRate: isTeacher ? TEACHER_PREFERED_VIDEO_FRAMERATE : STUDENT_PREFERED_VIDEO_FRAMERATE,
            });
            break;
        }
        setDeviceId(deviceId);
    };

    const {
        execute: enumerateDevices,
        result: devices,
    } = useAsync(async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        if(!deviceId) { onSelect(devices[0]?.deviceId); }
        return devices.filter(d => d.kind === kind);
    }, [ kind ]);

    useEffect(() => {
        const listener = () => enumerateDevices();
        navigator.mediaDevices.addEventListener(`devicechange`, listener);
        return () => navigator.mediaDevices.removeEventListener(`devicechange`, listener);
    }, [ enumerateDevices ]);

    const [ isOpen, setOpen ] = useState(false);
    const open = () => { setOpen(true); enumerateDevices(); };
    const close = () => { setOpen(false); };
    return (
        <>
            <Tooltip title={
                <FormattedMessage
                    id="select_device"
                    values={{
                        device: kind === `videoinput` ? `Camera` : `Microphone`,
                    }}
                />
            }
            >
                <Button
                    className={classes.button}
                    size="small"
                    variant="contained"
                    startIcon={<Settings size="0.75em" />}
                    aria-label={`${kind} settings`}
                    onClick={open}
                >
                    {kind === `videoinput` ? `Camera settings` : `Microphone settings`}
                </Button>
            </Tooltip>
            <Select
                style={{
                    height: 0,
                    width: 0,
                    visibility: `hidden`,
                    display: isOpen ? `inherit` : `none`,
                }}
                disabled={!devices || devices.length <= 0}
                value={deviceId || ``}
                open={isOpen}
                onOpen={open}
                onClose={close}
                onChange={e => {
                    if(typeof e.target.value !== `string`) {
                        console.error(`TypeError: <Select> expected 'string' from <MenuItem> but recieved '${typeof e.target.value}'`);
                    } else {
                        onSelect(e.target.value);
                    }
                }}
            >
                {
                    devices?.map(({ label, deviceId }) => (
                        <MenuItem
                            key={deviceId}
                            value={deviceId}
                        >
                            {
                                `${label
                                    ? `${label.charAt(0).toUpperCase()}${label.slice(1)}`
                                    : `Unknown Device`
                                } (${deviceId.slice(0, 4)})`
                            }
                        </MenuItem>
                    ))
                }
            </Select>
        </>
    );
};
