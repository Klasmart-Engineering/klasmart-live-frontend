import React, { useState, useContext, useEffect, useRef } from "react";
import { FormattedMessage } from "react-intl";
import { createStyles, makeStyles, useTheme, Theme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import KidsloopLogo from "../assets/img/kidsloop.svg";
import CenterAlignChildren from "../components/centerAlignChildren";
import StyledButton from "../components/styled/button";
import StyledTextField from "../components/styled/textfield";
import { UserContext } from "../entry";
import { webRTCContext, Camera } from "../webRTCState";
import Loading from "../components/loading";
import NoCamera from "../components/noCamera";
import StyledSelect from "../components/selectMediaDevice";
import { Room } from "../room";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            margin: "auto 0"
        },
        card: {
            display: "flex",
            alignItems: "center",
            padding: "48px 40px !important",
            [theme.breakpoints.down("sm")]: {
                maxWidth: 400,
                margin: "0 auto",
            },
        },
        formContainer: {
            width: "100%"
        },
        pageWrapper: {
            display: "flex",
            flexGrow: 1,
            height: "100vh",
        },
    })
);

export function Join(): JSX.Element {
    const classes = useStyles();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
    const states = useContext(webRTCContext);
    const {teacher, name, setName} = useContext(UserContext);

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<string>("");

    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoDisabled, setVideoDisabled] = useState(false);
    const [videoDeviceOptions, setVideoDeviceOptions] = useState<MediaDeviceInfo[]>([]);
    const [videoDeviceId, setVideoDeviceId] = useState<string>("");
    const [videoStream, setVideoStream] = useState<MediaStream>();
    const [audioDisabled, setAudioDisabled] = useState(false);
    const [audioDeviceOptions, setAudioDeviceOptions] = useState<MediaDeviceInfo[]>([]);
    const [audioDeviceId, setAudioDeviceId] = useState<string>("");

    async function detectDevices() {
        return navigator.mediaDevices.enumerateDevices();
    }

    // TODO: UI don't rerender by listener when connecting and disconnecting the device.
    // useEffect(() => {
    //     navigator.mediaDevices.addEventListener("devicechange", (e) => detectDevices());
    //     return () => { navigator.mediaDevices.removeEventListener("devicechange", (e) => detectDevices()); };
    // }, [it should be once]);

    useEffect(() => {
        let prepared = true;
        (async () => {
            setLoading(true);
            const devices = await detectDevices();
            // No device ID should not be selected
            const videoDevices = devices.filter(d => d.kind == "videoinput").filter(d => d.deviceId !== "");
            const audioDevices = devices.filter(d => d.kind == "audioinput").filter(d => d.deviceId !== "");
            if (videoDevices.length === 0 || audioDevices.length === 0) {
                setVideoDisabled(videoDevices.length === 0);
                setAudioDisabled(audioDevices.length === 0);
            } else {
                // console.log("devices: ", devices);
                // console.log("videoDevices: ", videoDevices);
                // console.log("audioDevices: ", audioDevices);
                setVideoDeviceOptions(videoDevices);
                setVideoDeviceId(videoDevices[0].deviceId);
                setAudioDeviceOptions(audioDevices);
                setAudioDeviceId(audioDevices[0].deviceId);
            }
            if (prepared) { setLoading(false); }
        })();
        return () => { prepared = false; };
    }, []);

    useEffect(() => {
        setVideoStream(undefined);
        const stream = navigator.mediaDevices.getUserMedia({
            audio: false,
            video: { deviceId: videoDeviceId }
        });
        stream
            .then((s) => { setVideoStream(s); })
            .catch((e) => { console.error(e); });

        return () => {
            stream.then((s) => { for (const track of s.getTracks()) { track.stop(); } });
        };
    }, [videoDeviceId]);

    useEffect(() => {
        if (!videoRef.current || !videoStream) { return; }
        videoRef.current.srcObject = videoStream.active ? videoStream : null;
    }, [videoStream, videoRef.current]);

    async function join(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!name) { setName(user); }
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: { deviceId: audioDeviceId },
            video: { deviceId: videoDeviceId },
        });
        states.setCamera(stream);
        return <Room teacher={false} />;
    }

    return (
        <Grid
            container
            direction="column"
            justify="space-around"
            alignItems="center"
            className={ classes.pageWrapper }
        >
            <Container maxWidth="lg">
                <Card>
                    <CardContent className={classes.card}>
                        <Grid
                            container
                            direction={isSmDown ? "column-reverse" : "row"}
                            justify="center"
                            alignItems="center"
                            spacing={4}
                        >
                            <Grid item xs={12} md={8}>
                                {loading ? <Loading /> :
                                    <>
                                        {videoStream
                                            ? <Camera mediaStream={videoStream}/>
                                            : <NoCamera messageId={videoDisabled ? "connect_camera" : "select_camera"} />
                                        }
                                    </>
                                }
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Grid container direction="row" justify="center" alignItems="center" spacing={4}>
                                    <Grid item xs={12}>
                                        <CenterAlignChildren center>
                                            <img alt="KidsLoop" src={KidsloopLogo} height="50px" />
                                            <Typography variant="h6" style={{ paddingLeft: theme.spacing(1) }}>
                                                Live
                                            </Typography>
                                        </CenterAlignChildren>
                                    </Grid>
                                    <Grid item xs={12} className={classes.formContainer}>
                                        <form onSubmit={join}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    {name ?
                                                        <Typography align="center" variant="body1">
                                                            <FormattedMessage id="hello" values={{ name }} />
                                                        </Typography> : 
                                                        <StyledTextField
                                                            fullWidth
                                                            value={user}
                                                            label={"What is your name?"}
                                                            onChange={(e) => setUser(e.target.value)}
                                                        />
                                                    }
                                                </Grid>
                                                { loading ?  <Loading /> :
                                                    <>
                                                        <Grid item xs={12}>
                                                            <StyledSelect
                                                                disabled={videoDisabled}
                                                                deviceType="video"
                                                                deviceId={videoDeviceId}
                                                                devices={videoDeviceOptions}
                                                                onChange={(e) => setVideoDeviceId(e.target.value as string)}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <StyledSelect
                                                                disabled={audioDisabled}
                                                                deviceType="audio"
                                                                deviceId={audioDeviceId}
                                                                devices={audioDeviceOptions}
                                                                onChange={(e) => setAudioDeviceId(e.target.value as string)}
                                                            />
                                                        </Grid>
                                                    </>
                                                }
                                                <Grid item xs={12}>
                                                    <StyledButton
                                                        fullWidth
                                                        type="submit"
                                                        size="large"
                                                    >
                                                        <Typography>
                                                            {teacher ? <FormattedMessage id="create_room" /> : <FormattedMessage id="join_room" />}
                                                        </Typography>
                                                    </StyledButton>
                                                </Grid>
                                            </Grid>
                                        </form>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Container>
        </Grid>
    );
}
