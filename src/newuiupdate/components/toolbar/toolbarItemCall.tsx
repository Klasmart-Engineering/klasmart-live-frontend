import { classEndedState } from "../../states/layoutAtoms";
import { useRecoilState } from "recoil";

import {
    Badge,
    makeStyles,
    Theme,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Grid,
    Typography
} from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import LockIcon from "@material-ui/icons/Lock";
import clsx from "clsx";
import React, {useState, useEffect} from "react";

import { Admin as ParentIcon } from "@styled-icons/remix-line/Admin";

const useStyles = makeStyles((theme: Theme) => ({
    itemRoot: {
        position: `relative`,
    },
    root: {
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
        color: `#fff`,
        backgroundColor: red[500],
        boxShadow: `0 3px 6px #fe434361`,
        borderRadius: 50,
        cursor: `pointer`,
        padding: 15,
        transition: `all 100ms ease-in-out`,
        margin: '0 7px',
        "&:hover": {
            transform: `scale(1.1)`,
        },
        "& svg" : {
            width: `1.25em`,
    		height: `1.25em`,
        },
    },
    disabled: {
        opacity: 0.4,
        pointerEvents: `none`,
        cursor: `default`,
    },
    locked: {},
    active: {},
    badgeRoot: {
        position: `absolute`,
        top: 0,
        right: 10,
    },
    badge: {
        background: `#fff`,
        color: `#000`,
        boxShadow: `0px 2px 4px rgba(0,0,0,0.25)`,
    },
    badgeContent: {
        fontSize: `1em`,
    },
    dialogTitle:{
        textAlign: 'center'
    },
    dialogContent:{
        textAlign: 'center'
    },
    dialogIcon:{
        background: theme.palette.grey[200],
        borderRadius: 40,
        padding: 20,
        marginBottom: 20,
    },
    parentChecker:{
        marginTop: 20,
        marginBottom: 20,
    },
    parentCheckerItem:{
        color: '#fff',
        width: 50,
        height: 50,
        background: '#252961',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        borderRadius: 50,
        fontSize: '1.5rem',
        cursor: 'pointer',
        margin: '0 10px',
    },
    parentCheckerItemActive:{
        opacity: 0.4
    }
}));

interface ToolbarItemCallProps {
	icon?: any;
	onClick?: any;
	disabled?: boolean;
	active?: boolean;
	locked?: boolean;
	tooltip?: string;
}

function ToolbarItemCall (props: ToolbarItemCallProps) {
    const {
        icon,
        onClick,
        disabled,
        active,
        locked,
        tooltip = false,
    } = props;
    const classes = useStyles();
    const hasTooltip = tooltip ? true : false;

    const [openModal, setOpenModal] = useState(false);
    const [ classEnded, setClassEnded ] = useRecoilState(classEndedState);

    const randomNumbers = [];
    while(randomNumbers.length < 3){
        var number = Math.floor(Math.random() * 100) + 1;
        if(randomNumbers.indexOf(number) === -1) randomNumbers.push(number);
    }

    const [checkNumbers, setCheckNumbers] = useState([
        {value: randomNumbers[0], checked: false, selected: 0},
        {value: randomNumbers[1], checked: false, selected: 0},
        {value: randomNumbers[2], checked: false, selected: 0},
    ]);

    const handleCloseDialog = () => {
        setOpenModal(false);
    };

    const handleSelectNumber = (value:number, index: number) => {
        let updatedNumbers = [...checkNumbers];
        updatedNumbers[index] = {...checkNumbers[index], checked: true};
        setCheckNumbers(updatedNumbers);
    };

    useEffect(() => {
       const findUnchecked = checkNumbers.find(number => number.checked === false);

       if(findUnchecked === undefined){
            setClassEnded(true)
       }

    }, [checkNumbers]);

    return (
        <>
            <Tooltip
                title={tooltip}
                disableFocusListener={!hasTooltip}
                disableHoverListener={!hasTooltip}
                disableTouchListener={!hasTooltip}>
                <div className={classes.itemRoot}>
                    {locked && (
                        <Badge
                            classes={{
                                badge: classes.badge,
                                root: classes.badgeRoot,
                            }}
                            badgeContent={<LockIcon className={classes.badgeContent} />}
                        ></Badge>
                    )}

                    <div
                        className={clsx(classes.root, disabled && classes.disabled, active && classes.active, locked && classes.locked)}
                        // onClick={onClick}
                        onClick={() => setOpenModal(true)}
                    >
                        {icon}
                    </div>
                </div>
            </Tooltip>
            <Dialog onClose={handleCloseDialog} aria-labelledby="leave-class-dialog" open={openModal}>
                <DialogTitle id="leave-class-dialog" className={classes.dialogTitle}>Leave class</DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <ParentIcon size="2rem" className={classes.dialogIcon} />
                    <Typography variant="h5">Parents only </Typography>
                    <Typography> To continue, please tap the numbers in ascending order </Typography>
                    <Grid container justify="center" className={classes.parentChecker}>
                        {checkNumbers.map((number, index) => (
                            <Grid item key={`numer-${index}`}>
                                <Typography className={clsx(classes.parentCheckerItem, {[classes.parentCheckerItemActive] : number.checked})} onClick={() => handleSelectNumber(number.value, index)} >{number.value}</Typography>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
               
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ToolbarItemCall;
