import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    DialogActions,
    Grid,
    makeStyles,
    Theme,
    Button
} from "@material-ui/core";
import React,
{ useState, useEffect } from "react";

import red from "@material-ui/core/colors/red";

import { Admin as ParentIcon } from "@styled-icons/remix-line/Admin";
import { Warning as WarningIcon } from "@styled-icons/entypo/Warning";

import clsx from "clsx";
import { classEndedState } from "../../states/layoutAtoms";
import { useRecoilState } from "recoil";


const useStyles = makeStyles((theme: Theme) => ({
    dialogTitle:{
        textAlign: 'center'
    },
    dialogContent:{
        textAlign: 'center'
    },
    dialogIcon:{
        display: 'inline-block',
        background: theme.palette.grey[200],
        borderRadius: 40,
        padding: 20,
        marginBottom: 20,
    },
    warningIcon:{
        color: '#ffca00',
        background: '#f9f7e8',
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
    },
    error: {
        color: red[500]
    }
}));

function DialogEndCall(props:any){
    const classes = useStyles();
    const { open, onClose, user } = props;
    const [ classEnded, setClassEnded ] = useRecoilState(classEndedState);
    const [ showParentCaptcha, setShowParentCaptcha ] = useState(false);
      
    let dialogTitle = 'End class'
    let dialogContent = 'Are you sure to end the class?'

    if(user.role === 'student'){
         dialogTitle = 'Leave class'
         dialogContent = 'Leaving class will close the session window tab, close your camera and turn off your microphone'

        useEffect(() => {
            setShowParentCaptcha(true)
        }, [open]);
    }

    return(
        <Dialog open={open} onClose={onClose} aria-labelledby="leave-class-dialog" maxWidth="xs">
            <DialogTitle id="leave-class-dialog" className={classes.dialogTitle}>{dialogTitle}</DialogTitle>
            <DialogContent className={classes.dialogContent}>
                {showParentCaptcha ? 
                    <ParentCaptcha setShowParentCaptcha={setShowParentCaptcha} /> : (
                    <>  
                        <div className={clsx(classes.dialogIcon, classes.warningIcon)}>
                            <WarningIcon size="2rem" />
                        </div>
                        <Typography>{dialogContent}</Typography>
                    </>
                )}
            </DialogContent>
            
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancel</Button>
                {!showParentCaptcha && <Button onClick={() => setClassEnded(true)} variant="contained" color="primary">{dialogTitle}</Button>}
            </DialogActions>
        </Dialog>
    )
}

export { DialogEndCall }


function ParentCaptcha(props:any){
    const classes = useStyles();
    const {  setShowParentCaptcha } = props;
    const [checkNumbers, setCheckNumbers] = useState<any[]>([]);
    const [error, setError] = useState(false);
    
     const generateRandomNumbers = () => {
        const randomNumbers:any[] = [];
        while(randomNumbers.length < 3){
            var number = Math.floor(Math.random() * 100) + 1;
            if(randomNumbers.indexOf(number) === -1) randomNumbers.push(number);
        }

        setCheckNumbers([
            {value: randomNumbers[0], checked: false, selected: 0},
            {value: randomNumbers[1], checked: false, selected: 0},
            {value: randomNumbers[2], checked: false, selected: 0},
        ])
    }
    
    const handleSelectNumber = (value:number, index: number) => {
        let updatedNumbers = [...checkNumbers];
        updatedNumbers[index] = {...checkNumbers[index], checked: true, selected: updatedNumbers.filter(number => number.checked === true).length};
        setCheckNumbers(updatedNumbers);
    };
 
    useEffect(() => {
        generateRandomNumbers();
    }, []);

     useEffect(() => {
         if(checkNumbers.length){
            const findUnchecked = checkNumbers.find(number => number.checked === false);
        
            if(findUnchecked === undefined){
                const selectedNumbers = checkNumbers
                .sort((a, b) => a.selected - b.selected)
                .map(number => number.value);
    
                const isValid = selectedNumbers.filter((a, i) => a > selectedNumbers[i + 1]).length === 0;

                if(isValid){
                    setShowParentCaptcha(!isValid);
                    setError(false)
                }else{
                    setError(true)
                }
                 
                generateRandomNumbers();
            }
         }
        
     }, [checkNumbers]);

    return(
        <div>
            <div className={classes.dialogIcon}>
                <ParentIcon size="2rem"  />
            </div>
            <Typography variant="h5">Parents only </Typography>
            <Typography>To continue, please tap the numbers in ascending order </Typography>
            <Grid container justify="center" className={classes.parentChecker}>
                {checkNumbers.map((number, index) => (
                    <Grid item key={`numer-${index}`}>
                        <Typography className={clsx(classes.parentCheckerItem, {[classes.parentCheckerItemActive] : number.checked})} onClick={() => handleSelectNumber(number.value, index)} >{number.value}</Typography>
                    </Grid>
                ))}
            </Grid>
            {error && <Typography className={classes.error}>Please try again</Typography>}
        </div>
    )
}

export { ParentCaptcha }
