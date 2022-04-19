import WhiteboardBorder from "./Border";
import { CANVAS_RESOLUTION_MAX } from "@/config";
import { BaseWhiteboard } from "@/whiteboard/components/BaseWhiteboard";
import React,
{
    useCallback,
    useMemo,
    useState,
} from "react";
import { useResizeDetector } from "react-resize-detector";

export type OnLoadEventHandler = ({ height, width }: { width: number; height: number }) => void;

export interface WhiteboardLoadableElement {
    onLoad?: OnLoadEventHandler;
    maxWidth?: number | string;
    maxHeight?: number | string;
}

interface Props {
    children: Omit<React.ReactElement, "onLoad"> & WhiteboardLoadableElement;
}

export default function (props: Props) {
    const { children } = props;
    const [ initialContentSize, setInitialContentSize ] = useState({
        width: 0,
        height: 0,
    });

    const {
        ref: containerRef,
        width: containerWidth = 0,
        height: containerHeight = 0,
    } = useResizeDetector<HTMLDivElement>();

    const activityAreaScale = useMemo(() => {
        if (!containerHeight || !containerWidth || !initialContentSize.height || !initialContentSize.width) return 1;
        const scaleHeight = containerHeight / initialContentSize.height;
        const scaleWidth = containerWidth / initialContentSize.width;
        return Math.min(scaleHeight, scaleWidth);
    }, [
        containerHeight,
        containerWidth,
        initialContentSize,
    ]);

    const onLoad: OnLoadEventHandler = useCallback(({ height, width }) => {
        setInitialContentSize({
            height,
            width,
        });
    }, [ containerHeight, containerWidth ]);

    return (
        <>
            <div
                ref={containerRef}
                style={{
                    width: `100%`,
                    height: `100%`,
                    display: `flex`,
                    alignItems: `center`,
                    justifyContent: `center`,
                    position: `relative`,
                }}
            >
                <div
                    style={{
                        transformOrigin: `center`,
                        transform: `scale(${activityAreaScale})`,
                        height: initialContentSize.height,
                        width: initialContentSize.width,
                        position: `absolute`,
                    }}
                >
                    {React.cloneElement(children, {
                        onLoad,
                    })}
                    <BaseWhiteboard
                        key={`${initialContentSize.height}:${initialContentSize.width}`}
                        height={initialContentSize.height * (CANVAS_RESOLUTION_MAX / initialContentSize.width)}
                        width={initialContentSize.width * (CANVAS_RESOLUTION_MAX / initialContentSize.width)}
                    />
                </div>
                <WhiteboardBorder
                    height={initialContentSize.height * activityAreaScale}
                    width={initialContentSize.width * activityAreaScale}
                />
            </div>
        </>
    );
}
