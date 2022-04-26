import NoCamera from "@/components/userCamera/noCamera";
import UserCamera from "@/components/userCamera/UserCamera";
import UserCameraBackground from "@/components/userCamera/UserCameraBackground";
import UserCameraDetails from "@/components/userCamera/userCameraDetails";
import { Session } from "@/pages/utils";
import ContainedWhiteboard from "@/whiteboard/components/ContainedWhiteboard";
import { useStream } from "@kl-engineering/live-state/ui";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles(() => ({
    root:{
        fontSize: `1.5rem`,
        borderRadius: 12,
        transform: `translateZ(0)`, // Apply border-radius for Safari
        width: `100%`,
        height: `100%`,
        minHeight: 250,
        margin: `0 auto`,
        alignItems: `center`,
        textAlign: `center`,
        position: `relative`,
        overflow: `hidden`,
        outline: `0px solid rgba(20,100,200,0.5)`,
        transition: `outline-width 100ms linear`,
    },
    backgroundRoot:{
        position: `absolute`,
    },
    userCameraRoot:{
        objectFit: `contain`,
    },
}));

interface OnStageUserCameraProps {
    user: Session;
}

export default function OnStageUserCamera ({ user }: OnStageUserCameraProps) {
    const classes = useStyles();
    const {
        audio,
        video,
    } = useStream(user.id);

    return (
        <div
            className={clsx(classes.root)}
        >
            <UserCameraBackground className={clsx(classes.backgroundRoot)} />
            <ContainedWhiteboard borderInside>
                <UserCamera
                    user={user}
                    className={clsx(classes.userCameraRoot)}
                />
            </ContainedWhiteboard>
            {
                !video.isConsumable &&
                <NoCamera
                    name={user.name}
                    variant="large"
                />
            }
            <UserCameraDetails
                user={user}
                mic={audio}
                variant="large"
            />
        </div>
    );
}
