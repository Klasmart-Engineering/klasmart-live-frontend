import React from "react";

interface Props {
    center?: boolean;
    children?: React.ReactNode;
    className?: string;
}

export default function CenterAlignChildren(props: Props) {
    const { center, children,  className, ...other } = props;

    return (
        <span style={{ display: "flex", alignItems: "center", justifyContent: center ? "center" : "normal" }} className={className} {...other}>
            { children || null}
        </span>
    );
}
