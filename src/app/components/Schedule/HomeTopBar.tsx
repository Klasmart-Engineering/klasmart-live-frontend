import { useSelectedUserValue } from "@/app/data/user/atom";
import ParentsDashboardMobile from "@/assets/img/home/parents-dashboard.svg";
import {
    THEME_BACKGROUND_SIGN_OUT_BUTTON,
    THEME_COLOR_LIGHT_BLACK_TEXT,
} from "@/config";
import { UserAvatar } from "@kl-engineering/kidsloop-px";
import {
    Box,
    ButtonBase,
    createStyles,
    makeStyles,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) =>
    createStyles({
        header: {
            width: `100%`,
            display: `flex`,
            alignItems: `center`,
            justifyContent: `space-between`,
            padding: theme.spacing(2, 2, 0),
            background: THEME_BACKGROUND_SIGN_OUT_BUTTON,
        },
        headerLeft: {
            display: `flex`,
            alignItems: `center`,
            justifyContent: `center`,
        },
        selectProfile: {
            display: `flex`,
            alignItems: `center`,
            justifyContent: `center`,
            margin: theme.spacing(0, 1.5),
            borderRadius: theme.spacing(4),
            padding: theme.spacing(0.5),
            background: theme.palette.common.white,
        },
        nameText: {
            fontWeight: theme.typography.fontWeightBold as number,
            textAlign: `center`,
            color: THEME_COLOR_LIGHT_BLACK_TEXT,
            marginLeft: theme.spacing(0.5),
            display: `-webkit-box`,
            overflow: `hidden`,
            WebkitBoxOrient: `vertical`,
            WebkitLineClamp: 1,
            paddingRight: theme.spacing(1.5),
            fontSize: `0.85rem`,
            [theme.breakpoints.up(`md`)]: {
                fontSize: `1.12rem`,
            },
        },
        selectUserButton: {
            borderRadius: `50%`,
        },
        parentsButton: {
            width: 36,
            [theme.breakpoints.up(`md`)]: {
                width: 46,
            },
        },
    }));

interface Props {
    onProfileClick: () => void;
    onParentsDashboardClick: () => void;
}

export default function HomeTopBar (props: Props) {
    const { onProfileClick, onParentsDashboardClick } = props;
    const classes = useStyles();
    const selectedUser = useSelectedUserValue();
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up(`md`));

    return (
        <Box className={classes.header}>
            <Box className={classes.headerLeft}>
                <Box
                    className={classes.selectProfile}
                    onClick={onProfileClick}
                >
                    <ButtonBase
                        className={classes.selectUserButton}
                        onClick={onProfileClick}
                    >
                        <UserAvatar
                            maxInitialsLength={2}
                            name={`${selectedUser?.given_name} ${selectedUser?.family_name}`}
                            size={isMdUp ? `medium` : `small`}
                        />
                    </ButtonBase>
                    <Typography
                        className={classes.nameText}
                        variant="h5"
                    >
                        {selectedUser?.given_name}
                    </Typography>
                </Box>
            </Box>
            <img
                className={classes.parentsButton}
                alt="parent dashboard icon"
                src={ParentsDashboardMobile}
                onClick={onParentsDashboardClick}
            />
        </Box>
    );
}
