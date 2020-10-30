import LogRocket from 'logrocket';
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

import { Error as ErrorIcon } from "@styled-icons/material/Error";

import KidsLoopTeachers from "../../assets/img/kidsloop_live_teachers.svg";
import KidsLoopStudents from "../../assets/img/kidsloop_live_students.svg";
import { UserContext } from "../../entry";
import StyledButton from "../../components/styled/button";
import StyledTextField from "../../components/styled/textfield";
import Camera from "../../components/media/camera";
import FFT from "../../components/media/fft";
import MediaDeviceSelect, { DeviceInfo } from "../../components/media/mediaDeviceSelect";
import Loading from "../../components/loading";
import { useHistory } from "react-router-dom";
import { FacingType, useCameraContext } from "../../components/media/useCameraContext";

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
    const { name, setName, teacher, sessionId, setCamera } = useContext(UserContext);
    const history = useHistory();

    const [user, setUser] = useState<string>("");

    const [nameError, setNameError] = useState<JSX.Element | null>(null);

    // TODO: If moving to using just front/back camera device for mobile
    // app devices we may not need these arrays. Since they would be constant
    // front/back always (would need to figure out how to determine available
    // cameras though).
    const [videoDevices] = useState<DeviceInfo[]>([
        { label: "Front Facing", kind: "videoinput", id: FacingType.User as string, },
        { label: "Back Facing", kind: "videoinput", id: FacingType.Environment as string }
    ]);
    const [audioDevices] = useState<DeviceInfo[]>([
        { label: "Front Facing", kind: "audioinput", id: FacingType.User as string, },
        { label: "Back Facing", kind: "audioinput", id: FacingType.Environment as string }
    ]);

    const { error, stream, facing, setFacing } = useCameraContext();

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
        if (!name) {
            setName(user);
            LogRocket.identify(user, {sessionId})
        }
        setCamera(stream || null);
        history.push(`/room`);
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
                                        ? <div style={{ position: "relative" }}>
                                            <Camera mediaStream={stream} muted={true} />
                                            <FFT input={stream} output={false} width={700} height={150} color={"#fff"} style={{ position: "absolute", bottom: 12, left: 0, width: "100%", height: 150 }} />
                                        </div>
                                        : error
                                            ? <NoCamera messageId={"connect_camera"} />
                                            : <Loading messageId="allow_media_permission" />
                                }
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Grid container direction="row" justify="center" alignItems="center" spacing={4}>
                                    <Grid item xs={12}>
                                        <img alt="KidsLoop Live" src={teacher ? KidsLoopTeachers : KidsLoopStudents} height="64px" style={{ display: "block", margin: "0 auto" }} />
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
                                                        deviceId={facing as string}
                                                        devices={videoDevices}
                                                        onChange={(e) => setFacing(e.target.value as FacingType)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <MediaDeviceSelect
                                                        disabled={audioDevices.length <= 1}
                                                        deviceType="audio"
                                                        deviceId={facing as string}
                                                        devices={audioDevices}
                                                        onChange={(e) => setFacing(e.target.value as FacingType)}
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

function NoCamera({ messageId }: { messageId: string }) {
    return (
        <Grid
            container
            justify="space-between"
            alignItems="center"
            style={{
                position: "relative",
                width: "100%",
                paddingTop: "56.25%",
                backgroundColor: "#193d6f"
            }}
        >
            <Typography
                variant="caption"
                align="center"
                style={{
                    color: "#FFF",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    whiteSpace: "pre-line",
                    wordBreak: "break-word"
                }}
            >
                <FormattedMessage id={messageId} />
            </Typography>
        </Grid>
    );
}