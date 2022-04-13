import {
    PARENTAL_LOCK_CIRCLE_BLUE_BG_COLOR,
    PARENTAL_LOCK_CIRCLE_BORDER_COLOR,
    PARENTAL_LOCK_CIRCLE_PINK_BG_COLOR,
    PARENTAL_LOCK_CIRCLE_YELLOW_BG_COLOR,
    TEXT_COLOR_SECONDARY_DEFAULT,
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
    setError: (props: boolean) => void;
    setShowCloseButton: (props: boolean) => void;
    setShowParentCaptcha: (props: boolean) => void;
    isUsedForEndClass?: boolean;
}

interface CheckNumber {
    value: number;
    checked: boolean;
    selected: number;
    color: string;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    parentChecker: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    parentCheckerItem: {
        justifyContent: `center`,
        display: `flex`,
        alignItems: `center`,
        borderRadius: `50%`,
        cursor: `none`,
        margin: theme.spacing(0, 1.2),
        background: theme.palette.common.white,
        border: `2px solid ${PARENTAL_LOCK_CIRCLE_BORDER_COLOR}`,
        color: TEXT_COLOR_SECONDARY_DEFAULT,
        outline: `none`,
        "&:focus": {
            outline: `none`,
        },
    },
    smallChecker: {
        width: 50,
        height: 50,
    },
    largeChecker: {
        width: 70,
        height: 70,
    },
    yellow: {
        backgroundColor: PARENTAL_LOCK_CIRCLE_YELLOW_BG_COLOR,
        border: 0,
        color: theme.palette.common.white,
    },
    pink: {
        backgroundColor: PARENTAL_LOCK_CIRCLE_PINK_BG_COLOR,
        border: 0,
        color: theme.palette.common.white,
    },
    blue: {
        backgroundColor: PARENTAL_LOCK_CIRCLE_BLUE_BG_COLOR,
        border: 0,
        color: theme.palette.common.white,
    },
}));

function ParentalGateCaptchaLogic({
    setError, setShowCloseButton, setShowParentCaptcha, isUsedForEndClass,
}: Props) {
    const classes = useStyles();
    const [checkNumbers, setCheckNumbers] = useState<CheckNumber[]>([]);

    const generateRandomNumbers = () => {
        const randomNumbers: number[] = [];
        while (randomNumbers.length < 3) {
            const number = Math.floor(Math.random() * 100) + 1;
            if (randomNumbers.indexOf(number) === -1) randomNumbers.push(number);
        }

        setCheckNumbers([
            {
                value: randomNumbers[0],
                checked: false,
                selected: 0,
                color: ``,
            },
            {
                value: randomNumbers[1],
                checked: false,
                selected: 0,
                color: ``,
            },
            {
                value: randomNumbers[2],
                checked: false,
                selected: 0,
                color: ``,
            },
        ]);
    };

    const handleSelectNumber = (value: number, index: number) => {
        const updatedNumbers = [...checkNumbers];

        updatedNumbers[index].checked = true;

        if (updatedNumbers[index].selected === 0) {
            updatedNumbers[index].selected = updatedNumbers.filter(number => number.checked === true).length;
        }

        if (updatedNumbers[index].color === ``) {
            updatedNumbers[index].color = getColor(updatedNumbers.filter(number => number.checked === true).length);
        }

        setCheckNumbers(updatedNumbers);
        setError(false);
        setShowCloseButton(false);
    };

    const getColor = (number: number) => {
        switch (number) {
        case 1:
            return classes.yellow;
        case 2:
            return classes.pink;
        case 3:
            return classes.blue;
        default:
            return ``;
        }
    };

    useEffect(() => {
        generateRandomNumbers();
    }, []);

    useEffect(() => {
        if (checkNumbers.length) {
            const findUnchecked = checkNumbers.find(number => number.checked === false);

            if (findUnchecked === undefined) {
                const unSortedNumbers = [...checkNumbers];
                const sortedNumbers = unSortedNumbers
                    .sort((a, b) => a.selected - b.selected)
                    .map(number => number.value);

                const isValid = sortedNumbers.filter((a, i) => a > sortedNumbers[i + 1]).length === 0;

                if (isValid) {
                    setShowParentCaptcha(!isValid);
                    setError(false);
                } else {
                    setError(true);
                }

                setTimeout(() => {
                    // Waited 1.5s on the last number before generate new numbers
                    generateRandomNumbers();
                }, 1500);

                return;
            }
        }

    }, [checkNumbers]);

    return (
        <Grid
            container
            justifyContent={isUsedForEndClass ? `center` : `space-around`}
            className={classes.parentChecker}>
            {checkNumbers.map((number, index) => (
                <Grid
                    key={`number-${index}`}
                    item>
                    <Typography
                        variant="h4"
                        className={clsx(classes.parentCheckerItem, number.color, {
                            [classes.smallChecker]: isUsedForEndClass,
                            [classes.largeChecker]: !isUsedForEndClass,
                        })}
                        onClick={() => handleSelectNumber(number.value, index)}
                    >
                        {number.value}
                    </Typography>
                </Grid>
            ))}
        </Grid>
    );
}
export { ParentalGateCaptchaLogic };
