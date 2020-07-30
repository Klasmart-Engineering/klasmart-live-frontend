import React, { useState, useContext, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { createStyles, makeStyles, useTheme, Theme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import KidsloopLogo from "../assets/img/kidsloop.svg";
import CenterAlignChildren from "../components/centerAlignChildren";
import StyledButton from "../components/styled/button";
import StyledTextField from "../components/styled/textfield";
import { UserContext } from "../entry";
import { webRTCContext, Camera } from "../webRTCState";
import Loading from "../components/loading";
import NoCamera from "../components/noCamera";
import MediaDeviceSelect from "../components/mediaDeviceSelect";
import { Error as ErrorIcon } from "@styled-icons/material/Error";
import { FFT } from "../components/fft";

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
        errorIcon: {
            fontSize: "1em",
            marginRight: theme.spacing(1),
        },
    })
);

export function Join(): JSX.Element {
    const classes = useStyles();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
    const states = useContext(webRTCContext);
    const { name, setName } = useContext(UserContext);

    const url = new URL(window.location.href);

    const [user, setUser] = useState<string>("");

    const [nameError, setNameError] = useState<JSX.Element | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [videoDevices, setVideoDeviceOptions] = useState<MediaDeviceInfo[]>([]);
    const [audioDevices, setAudioDeviceOptions] = useState<MediaDeviceInfo[]>([]);
    const [videoDeviceId, setVideoDeviceId] = useState<string>();
    const [audioDeviceId, setAudioDeviceId] = useState<string>();
    const [stream, setStream] = useState<MediaStream>();

    async function detectDevices() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();

            const videoDevices = devices.filter((d) => d.kind == "videoinput");
            const audioDevices = devices.filter((d) => d.kind == "audioinput");

            setAudioDeviceOptions(audioDevices);
            setVideoDeviceOptions(videoDevices);

            setAudioDeviceId(audioDevices.length > 0 ? audioDevices[0].deviceId : undefined);
            setVideoDeviceId(videoDevices.length > 0 ? videoDevices[0].deviceId : undefined);
        } catch (err) {
            setError(true);
            console.log("ERROR: ", err.name + ": " + err.message); // TODO: It cannot handle permission issue
        }
    }

    useEffect(() => {
        if (!navigator.mediaDevices) { return; }
        navigator.mediaDevices.addEventListener("devicechange", (e) => detectDevices());
        return () => { navigator.mediaDevices.removeEventListener("devicechange", (e) => detectDevices()); };
    }, []);


    useEffect(() => {
        if (!navigator.mediaDevices) { return; }
        if (videoDeviceId === undefined && audioDeviceId === undefined) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(() => detectDevices());
            return;
        }
        setStream(undefined);
        const stream = navigator.mediaDevices.getUserMedia({ video: { deviceId: videoDeviceId }, audio: { deviceId: audioDeviceId } });
        stream
            .then((s) => { setStream(s); })
            .catch((e) => { setError(true); console.error(e); });
    }, [videoDeviceId, audioDeviceId]);

    function join(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setNameError(null);
        if (!user) {
            setNameError(
                <span style={{ display: "flex", alignItems: "center" }}>
                    <ErrorIcon className={classes.errorIcon} />
                    <FormattedMessage id="error_empty_name" />
                </span>
            );
        }
        if (!name) { setName(user); }
        states.setCamera(stream || null);
    }

    return (
        <Grid
            container
            direction="column"
            justify="space-around"
            alignItems="center"
            className={classes.pageWrapper}
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
                            <Grid item xs={12} md={8} style={{ width: "100%" }}>
                                {
                                    stream && stream.getVideoTracks().length > 0 && stream.getVideoTracks().every((t) => t.readyState === "live") && stream.active
                                        ? <>
                                            <FFT stream={stream} width={700} height={150}/>
                                            <Camera mediaStream={stream} muted={true}/>
                                        </>
                                        : error
                                            ? <NoCamera messageId={"connect_camera"} />
                                            : <Loading messageId="allow_media_permission" />
                                }
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Grid container direction="row" justify="center" alignItems="center" spacing={4}>
                                    <Grid item xs={12}>
                                        <CenterAlignChildren center>
                                            <img alt="KidsLoop" src={KidsloopLogo} height="50px" />
                                            <Typography variant="h6" style={{ paddingLeft: theme.spacing(1) }}>
                                                Live <Typography variant="body2" component="span">{ (url.searchParams.get("teacher") !== null) ? <sub>for Teachers</sub> : <sub>for Students</sub> }</Typography>
                                            </Typography>
                                        </CenterAlignChildren>
                                    </Grid>
                                    <Grid item xs={12} className={classes.formContainer}>
                                        <form onSubmit={join}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    {name ?
                                                        <Tooltip placement="top" title={name}>
                                                            <Typography align="center" variant="body1" noWrap>
                                                                <FormattedMessage id="hello" values={{ name }} />
                                                            </Typography>
                                                        </Tooltip> :
                                                        <StyledTextField
                                                            fullWidth
                                                            label={<FormattedMessage id="what_is_your_name" />}
                                                            value={user}
                                                            error={nameError !== null}
                                                            helperText={nameError}
                                                            onChange={(e) => setUser(e.target.value)}
                                                        />
                                                    }
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <MediaDeviceSelect
                                                        disabled={videoDevices.length <= 1}
                                                        deviceType="video"
                                                        deviceId={videoDeviceId}
                                                        devices={videoDevices}
                                                        onChange={(e) => setVideoDeviceId(e.target.value as string)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <MediaDeviceSelect
                                                        disabled={audioDevices.length <= 1}
                                                        deviceType="audio"
                                                        deviceId={audioDeviceId}
                                                        devices={audioDevices}
                                                        onChange={(e) => setAudioDeviceId(e.target.value as string)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <StyledButton
                                                        fullWidth
                                                        type="submit"
                                                        size="large"
                                                    >
                                                        <Typography>
                                                            <FormattedMessage id="join_room" />
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
