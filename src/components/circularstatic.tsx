import React, { useEffect } from "react";
import Box from '@material-ui/core/Box';
import CircularProgress, { CircularProgressProps } from '@material-ui/core/CircularProgress';
import Typography from "@material-ui/core/Typography";

function CircularProgressWithLabel(props: CircularProgressProps & { sec: number, value: number }) {
    return (
        <Box position="relative" display="inline-flex">
            <CircularProgress variant="static" {...props} />
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="caption" component="div" color="textSecondary">{props.sec} s</Typography>
            </Box>
        </Box>
    );
}

export default function CircularStatic() {
    const [sec, setSec] = React.useState(3);
    let progress: number = sec * 33;

    useEffect(() => {
        const timer = setInterval(() => {
            setSec((sec) => (sec <= 0 ? 3 : sec - 1));
        }, 900);
        return () => { clearInterval(timer); };
    }, []);

    return <CircularProgressWithLabel value={progress} sec={sec} />;
}