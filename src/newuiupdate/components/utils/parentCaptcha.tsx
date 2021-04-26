
import {
    Grid,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import { Admin as ParentIcon } from "@styled-icons/remix-line/Admin";
import clsx from "clsx";
import React,
{ useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) => ({
    dialogIcon:{
        display: `inline-block`,
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
        color: `#fff`,
        width: 50,
        height: 50,
        background: `#252961`,
        justifyContent: `center`,
        display: `flex`,
        alignItems: `center`,
        borderRadius: 50,
        fontSize: `1.5rem`,
        cursor: `pointer`,
        margin: `0 10px`,
    },
    parentCheckerItemActive:{
        opacity: 0.4,
    },
    error: {
        color: red[500],
    },
}));

function ParentCaptcha (props:any){
    const classes = useStyles();
    const {  setShowParentCaptcha } = props;
    const [ checkNumbers, setCheckNumbers ] = useState<any[]>([]);
    const [ error, setError ] = useState(false);

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
        updatedNumbers[index] = {
            ...checkNumbers[index],
            checked: true,
            selected: updatedNumbers.filter(number => number.checked === true).length,
        };
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
                    setError(false);
                }else{
                    setError(true);
                }

                generateRandomNumbers();
            }
        }

    }, [ checkNumbers ]);

    return(
        <div>
            <div className={classes.dialogIcon}>
                <ParentIcon size="2rem"  />
            </div>
            <Typography variant="h5"><FormattedMessage id="parents_captcha_title" /></Typography>
            <Typography><FormattedMessage id="parents_captcha_description" /></Typography>
            <Grid
                container
                justify="center"
                className={classes.parentChecker}>
                {checkNumbers.map((number, index) => (
                    <Grid
                        key={`numer-${index}`}
                        item>
                        <Typography
                            className={clsx(classes.parentCheckerItem, {
                                [classes.parentCheckerItemActive] : number.checked,
                            })}
                            onClick={() => handleSelectNumber(number.value, index)} >{number.value}</Typography>
                    </Grid>
                ))}
            </Grid>
            {error && <Typography className={classes.error}><FormattedMessage id="parents_captcha_error" /></Typography>}
        </div>
    );
}
export { ParentCaptcha };
