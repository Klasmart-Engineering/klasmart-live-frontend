import { AlertPopper } from "@/utils/utils";
import {
    Grid,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { StyledIcon } from '@styled-icons/styled-icon';
import clsx from "clsx";
import React,
{
    useCallback,
    useRef,
    useState,
} from "react";
import {
    LongPressDetectEvents,
    useLongPress,
} from "use-long-press";

const useStyles = makeStyles((theme: Theme) => ({
    item:{
        cursor: `pointer`,
        padding: `12px 20px`,
        "&:hover": {
            backgroundColor: theme.palette.grey[200],
        },
    },
    itemIcon:{
        padding: 10,
        background: `#fff`,
        border: `1px solid`,
        borderRadius: 50,
        marginBottom: 10,
        "& svg":{
            height: 20,
            width: 20,
        },
    },
    active:{
        backgroundColor: theme.palette.background.default,
        pointerEvents: `none`,
    },
    disabled: {
        opacity: `0.3`,
        pointerEvents: `none`,
    },
    disabledShowTooltip: {
        color: grey[400],
        "&:hover": {
            backgroundColor: theme.palette.background.paper,
        },
        userSelect: `none`,
    },
}));

interface ViewModeProps {
	active: boolean;
	onClick: () => void;
	icon: StyledIcon;
	title: string;
    disabled?: boolean;
    disabledTooltip?: React.ReactNode;
}

function ViewMode (props: ViewModeProps) {
    const {
        active,
        onClick,
        icon: Icon,
        title,
        disabled,
        disabledTooltip,
    } = props;

    const buttonRef = useRef<any>();
    const classes = useStyles();
    const [ anchorEl, setAnchorEl ] = useState<HTMLElement>();
    const openAlertPopper = Boolean(anchorEl);

    const onShow = () => {
        if(disabled && disabledTooltip){
            setAnchorEl(buttonRef.current);
        }
        onClick();
    };

    const onHide = useCallback(() => {
        if (!disabledTooltip) return;
        setTimeout(() => {
            setAnchorEl(undefined);
        }, 1500);
    }, [ anchorEl ]);

    const clickEvent = useLongPress(onShow, {
        onStart: () => onShow(),
        onFinish: () => onHide(),
        onCancel: () => onHide(),
        threshold: 500,
        captureEvent: true,
        cancelOnMovement: false,
        detect: LongPressDetectEvents.BOTH,
    });

    return (
        <>
            <Grid item>
                <Grid
                    ref={buttonRef}
                    container
                    direction="column"
                    alignItems="center"
                    className={clsx(classes.item, {
                        [classes.active]: active,
                        [classes.disabled]: !active && disabled && !disabledTooltip,
                        [classes.disabledShowTooltip]: disabledTooltip && disabled,
                    })}
                    {...clickEvent}>
                    <Grid item>
                        <div className={classes.itemIcon}>{<Icon />}</div>
                    </Grid>
                    <Grid item>
                        <Typography>{title}</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <AlertPopper
                open={openAlertPopper}
                anchorEl={anchorEl}
                title={disabledTooltip}
            />
        </>
    );
}

export default ViewMode;
