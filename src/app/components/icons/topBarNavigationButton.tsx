
import { heightActionButton } from "@/app/utils/fixedValues";
import {
    BG_BUTTON_LIVE_COLOR,
    BG_BUTTON_STUDY_COLOR,
    SCHEDULE_CARD_BACKGROUND_CONTAINER,
    SCHEDULE_HOMEFUN_TOP_BAR,
    SCHEDULE_STUDY_TOP_BAR,
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

const BUTTON_MIN_WIDTH_SMALL = 95;
const BUTTON_MIN_WIDTH_MEDIUM = 135;

const useStyles = makeStyles((theme) => createStyles({
    root: {
        backgroundColor: SCHEDULE_CARD_BACKGROUND_CONTAINER,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        width: `100%`,

    },
    activeLive: {
        backgroundColor: BG_BUTTON_LIVE_COLOR,
    },
    activeStudy: {
        backgroundColor: BG_BUTTON_STUDY_COLOR,
    },
    titleText: {
        color: TEXT_COLOR_SECONDARY_DEFAULT,
        fontSize: `0.8rem`,
        fontWeight: theme.typography.fontWeightMedium as number,
        [theme.breakpoints.up(`md`)]: {
            fontSize: `1.25rem`,
        },
    },
    titleHomeFunColor: {
        color: SCHEDULE_HOMEFUN_TOP_BAR,
        borderBottom: `2px solid ${SCHEDULE_HOMEFUN_TOP_BAR}`,
    },
    titleStudyColor: {
        color: SCHEDULE_STUDY_TOP_BAR,
        borderBottom: `2px solid ${SCHEDULE_STUDY_TOP_BAR}`,
    },
    marginRight: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(`md`)]: {
            marginRight: theme.spacing(2.75),
        },
    },
    hfsButton: {
        minWidth: BUTTON_MIN_WIDTH_SMALL,
        [theme.breakpoints.up(`md`)]: {
            minWidth: BUTTON_MIN_WIDTH_MEDIUM,
        },
    },
}));

interface Props {
  onClick: () => void;
  title: string;
  active: boolean;
  type: ClassType;
  isMarginRight?: boolean;
  isButtonHFS?: boolean;
}

export function TopBarNavigationButton (props: Props) {
    const {
        onClick,
        title,
        active,
        type,
        isMarginRight = false,
        isButtonHFS = false,
    } = props;
    const classes = useStyles();
    return (
        <ButtonBase
            disableRipple
            className={clsx(classes.root, {
                [classes.marginRight]: isMarginRight,
                [classes.hfsButton]: isButtonHFS,
            })}
            onClick={onClick}
        >
            <Typography
                className={clsx(classes.titleText, {
                    [classes.titleHomeFunColor]: type === ClassType.HOME_FUN_STUDY && active,
                    [classes.titleStudyColor]: type === ClassType.STUDY && active,
                })}
                variant="subtitle2"
            >
                <FormattedMessage id={title} />
            </Typography>
        </ButtonBase>
    );
}
