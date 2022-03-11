import { THEME_COLOR_BACKGROUND_PAPER } from "@/config";
import {
    Box,
    Fab,
    makeStyles,
    Theme,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

const FAB_SIZE = 104;

const useStyles = makeStyles((theme: Theme) => ({
    titleStyle:{
        fontWeight: theme.typography.fontWeightBold as number,
        color: theme.palette.background.paper,
        marginBottom: theme.spacing(2),
        [theme.breakpoints.down(`sm`)]: {
            marginBottom: theme.spacing(1),
        },
    },
    icon: {
        width: FAB_SIZE-theme.spacing(7),
        height:FAB_SIZE-theme.spacing(7),
        [theme.breakpoints.down(`sm`)]: {
            width: FAB_SIZE-theme.spacing(7) - 12,
            height: FAB_SIZE-theme.spacing(7) - 12,
        },
    },
    fab: {
        boxShadow: `none`,
        backgroundColor: THEME_COLOR_BACKGROUND_PAPER,
        width: FAB_SIZE,
        height: FAB_SIZE,
        [theme.breakpoints.down(`sm`)]: {
            width: FAB_SIZE-theme.spacing(5.5),
            height:FAB_SIZE-theme.spacing(5.5),
        },
    },
}));

export interface Props {
  onClick: () => void;
  alt: string;
  src: string;
  id: string;
}

export default function RoundButton (props: Props){
    const classes = useStyles();
    const {
        onClick,
        alt,
        src,
        id,
    } = props;
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));

    return (
        <Box
            display="flex"
            alignItems="center"
            flexDirection="column"
            mx={isSmDown ? 4 : 6}
        >
            <Typography
                variant= {isSmDown ? `subtitle2` : `h6`}
                className={classes.titleStyle}><FormattedMessage id={id} /></Typography>
            <Fab
                className={classes.fab}
                onClick={onClick}
            >
                <img
                    className={classes.icon}
                    alt={alt}
                    src={src}
                />
            </Fab>
        </Box>
    );
}
