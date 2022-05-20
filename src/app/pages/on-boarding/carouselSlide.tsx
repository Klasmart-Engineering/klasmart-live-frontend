import { useWindowSize } from "@/utils/viewport";
import { Box, Theme, Typography, useTheme } from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import clsx from "clsx";
import React,
{ useState } from 'react';

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        height: `100%`,
        padding: theme.spacing(0, 4),
        display:  `flex`,
        flexDirection: `column`,
        alignItems: `center`,
        justifyContent: `flex-end`,
    },
    content: {
        textAlign: `center`,
    },
    img: {
        width: 300,
        [theme.breakpoints.up(`sm`)]: {
            width: 550,
        },
    },
    imgSmallHeight: {
        width: 230,
    },
}));

interface Props {
    id: number;
    image: string;
    title: string;
    body: string;
}

export function CarouselSlide (props: Props): JSX.Element {
    const classes = useStyles();
    const theme = useTheme();
    const { height } = useWindowSize();
    const [ isSmallHeight ] = useState<boolean>(height <= 680);
    const {
        image,
        title,
        body,
    } = props;

    return (
        <Box className={classes.root}>
            <img
                alt="Boarding Image"
                src={image}
                className={clsx(classes.img, {
                    [classes.imgSmallHeight] : isSmallHeight,
                })} />
            <Box
                mt={5}
                className={classes.content}>
                <Typography
                    gutterBottom
                    style={{
                        fontWeight: theme.typography.fontWeightBold as number,
                    }}
                    variant="h5"
                >{title}</Typography>
                <Typography variant="h5">{body}</Typography>
            </Box>
        </Box>
    );
}
