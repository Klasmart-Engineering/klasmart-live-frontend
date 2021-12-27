
import { heightActionButton } from "@/app/utils/fixedValues";
import {
    BG_BUTTON_LIVE_COLOR,
    BG_BUTTON_STUDY_COLOR,
    TEXT_COLOR_LIVE_PRIMARY,
    TEXT_COLOR_STUDY_PRIMARY,
    THEME_COLOR_INACTIVE_BUTTON,
    THEME_COLOR_SECONDARY_DEFAULT,
} from "@/config";
import {
    ButtonBase,
    Grid,
    Typography,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";
import clsx from "clsx";
import React,
{ ReactElement } from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        backgroundColor: theme.palette.background.paper,
        color: THEME_COLOR_INACTIVE_BUTTON,
        height: heightActionButton,
        display: `flex`,
        width: `100%`,
    },
    activeLive : {
        backgroundColor: BG_BUTTON_LIVE_COLOR,
    },
    activeStudy : {
        backgroundColor: BG_BUTTON_STUDY_COLOR,
    },
    titleText: {
        fontWeight: theme.typography.fontWeightBold as number,
    },
    titleLiveColor: {
        color: TEXT_COLOR_LIVE_PRIMARY,
    },
    titleStudyColor: {
        color: TEXT_COLOR_STUDY_PRIMARY,
    },
}));

interface Props {
    onClick: () => void;
    title: string;
    icon: ReactElement<any, string>;
    active: boolean;
    type: string;
}

export function BottomNavigationButton (props: Props) {
    const {
        onClick,
        title,
        icon,
        active,
        type,
    } = props;
    const classes = useStyles();
    return (
        <ButtonBase
            className={clsx(classes.root, {
                [classes.activeLive]: active && type === `live`,
                [classes.activeStudy]: active && type === `study`,
            })}
            onClick={onClick}
        >
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
            >
                <Grid
                    item
                >
                    {icon}
                </Grid>
                <Grid item>
                    <Typography
                        className={clsx(classes.titleText, {
                            [classes.titleLiveColor]: type === `live`,
                            [classes.titleStudyColor]: type === `study`,
                        })}
                        variant="subtitle2">
                        <FormattedMessage id={title} />
                    </Typography>
                </Grid>
            </Grid>
        </ButtonBase>
    );
}
