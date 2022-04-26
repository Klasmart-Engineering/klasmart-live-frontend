
import { heightActionButton } from "@/app/utils/fixedValues";
import {
    BG_BUTTON_LIVE_COLOR,
    BG_BUTTON_STUDY_COLOR,
    TEXT_COLOR_LIVE_PRIMARY,
    TEXT_COLOR_SECONDARY_DEFAULT,
    TEXT_COLOR_STUDY_PRIMARY,
    THEME_COLOR_SECONDARY_DEFAULT,
} from "@/config";
import { ClassType } from "@/store/actions";
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
        height: heightActionButton,
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
        justifyContent: `center`,
        width: `100%`,
    },
    activeLive : {
        backgroundColor: BG_BUTTON_LIVE_COLOR,
    },
    activeStudy : {
        backgroundColor: BG_BUTTON_STUDY_COLOR,
    },
    titleText: {
        color: TEXT_COLOR_SECONDARY_DEFAULT,
    },
    titleLiveColor: {
        color: TEXT_COLOR_LIVE_PRIMARY,
        fontWeight: theme.typography.fontWeightBold as number,
    },
    titleStudyColor: {
        color: TEXT_COLOR_STUDY_PRIMARY,
        fontWeight: theme.typography.fontWeightBold as number,
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
            disableRipple
            className={classes.root}
            onClick={onClick}
        >
            {icon}
            <Typography
                className={clsx(classes.titleText, {
                    [classes.titleLiveColor]: type === ClassType.LIVE && active,
                    [classes.titleStudyColor]: type === ClassType.STUDY && active,
                })}
                variant="subtitle2"
            >
                <FormattedMessage id={title} />
            </Typography>
        </ButtonBase>
    );
}
