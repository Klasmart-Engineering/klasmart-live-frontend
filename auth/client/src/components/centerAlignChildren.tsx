import React from "react";

interface Props {
    children?: React.ReactNode;
    className?: string;
}

export default function CenterAlignChildren(props: Props) {
    const {children, className,  ...other } = props;

    return (
        <span style={{ display: "flex", alignItems: "center" }} className={className} {...other}>
            { children || null}
        </span>
    );
}
