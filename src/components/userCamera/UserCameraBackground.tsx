import { BG_COLOR_CAMERA } from "@/config";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles(() => ({
    root: {
        backgroundColor: BG_COLOR_CAMERA,
        width: `100%`,
        height: `100%`,
    },
}));

interface UserCameraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
}

const UserCameraBackground = ({ className, ...rest }: UserCameraBackgroundProps) => {
    const classes = useStyles();

    return (
        <div
            className={clsx(className, classes.root)}
            {...rest}
        />
    );
};

export default UserCameraBackground;
