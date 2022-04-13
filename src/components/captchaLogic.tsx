import {
    THEME_COLOR_BACKGROUND_PAPER,
    THEME_COLOR_PRIMARY_DEFAULT,
} from "@/config";
import {
    createStyles,
    Grid,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import clsx from "clsx";
import React,
{
    useEffect,
    useState,
} from "react";

interface Props {
    setError: (props:boolean) => void;
    setShowParentCaptcha: (props:boolean) => void;
    isUsedForEndClass?: boolean;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    parentChecker:{
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    parentCheckerItem: {
        color: THEME_COLOR_BACKGROUND_PAPER,
        background: THEME_COLOR_PRIMARY_DEFAULT,
        justifyContent: `center`,
        display: `flex`,
        alignItems: `center`,
        borderRadius: `50%`,
        cursor: `pointer`,
        margin: `0 10px`,
    },
    smallChecker: {
        width: 50,
        height: 50,
    },
    largeChecker: {
        width: 70,
        height: 70,
    },
    parentCheckerItemActive:{
        opacity: 0.4,
    },
}));

function CaptchaLogic ({
    setError, setShowParentCaptcha, isUsedForEndClass,
}:Props){
    const classes = useStyles();
    const [ checkNumbers, setCheckNumbers ] = useState<any[]>([]);

    const generateRandomNumbers = () => {
        const randomNumbers:any[] = [];
        while(randomNumbers.length < 3){
            const number = Math.floor(Math.random() * 100) + 1;
            if(randomNumbers.indexOf(number) === -1) randomNumbers.push(number);
        }

        setCheckNumbers([
            {
                value: randomNumbers[0],
                checked: false,
                selected: 0,
            },
            {
                value: randomNumbers[1],
                checked: false,
                selected: 0,
            },
            {
                value: randomNumbers[2],
                checked: false,
                selected: 0,
            },
        ]);
    };

    const handleSelectNumber = (value:number, index: number) => {
        const updatedNumbers = [ ...checkNumbers ];

        updatedNumbers[index].checked = true;

        if (updatedNumbers[index].selected === 0) {
            updatedNumbers[index].selected = updatedNumbers.filter(number => number.checked === true).length;
        }

        setCheckNumbers(updatedNumbers);
        setError(false);
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
                    setError(false);
                }else{
                    setError(true);
                }

                generateRandomNumbers();
                return;
            }
        }

    }, [ checkNumbers ]);

    return(
        <Grid
            container
            justifyContent={isUsedForEndClass ? `center` : `space-around`}
            className={classes.parentChecker}>
            {checkNumbers.map((number, index) => (
                <Grid
                    key={`numer-${index}`}
                    item>
                    <Typography
                        variant="h4"
                        className={clsx(classes.parentCheckerItem, {
                            [classes.parentCheckerItemActive] : number.checked,
                            [classes.smallChecker] : isUsedForEndClass,
                            [classes.largeChecker] : !isUsedForEndClass,
                        })}
                        onClick={() => handleSelectNumber(number.value, index)} >{number.value}</Typography>
                </Grid>
            ))}
        </Grid>
    );
}
export { CaptchaLogic };
