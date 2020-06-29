import React from "react";

interface Props {
    children?: React.ReactNode;
}

export default function CenterAlignChildren(props: Props) {
    const {children,  ...other } = props;

    return (
        <span style={{ display: "flex", alignItems: "center" }} {...other}>
            { children || null}
        </span>
    );
}
