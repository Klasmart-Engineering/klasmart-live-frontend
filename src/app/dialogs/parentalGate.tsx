import { useDeviceOrientationValue } from "@/app/model/appModel";
import { THEME_COLOR_SECONDARY_DEFAULT } from "@/config";
import {
    createStyles,
    Input,
    makeStyles,
    Theme,
    useTheme,
} from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import React,
{
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { FormattedMessage } from "react-intl";

interface Props {
    onCompleted: () => void;
    message?: string;
    showHeader?: boolean;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    titleText: {
        color: THEME_COLOR_SECONDARY_DEFAULT,
        fontWeight: theme.typography.fontWeightBold as number,
    },
    errorText: {
        color: red[500],
    },
}));

export function ParentalGate ({
    onCompleted,
    message,
    showHeader,
}: Props): JSX.Element {
    const theme = useTheme();
    const classes = useStyles();
    const deviceOrientation = useDeviceOrientationValue();

    const [ challenge1 ] = useState<number>(Math.ceil(Math.random() * 50));
    const [ challenge2 ] = useState<number>(Math.ceil(Math.random() * 50));

    const correctAnswer = useMemo<number>(() => {
        return challenge1 + challenge2;
    }, [ challenge1, challenge2 ]);

    const [ isShowError, setShowError ]  = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement>();

    const handleChangeInputText = (inputValue:string): void => {
        if(!inputRef.current) return;

        const answer = Number(inputValue);
        if(answer === correctAnswer){
            onCompleted();
            return;
        }

        if(inputValue === ``){
            setShowError(false);
            return;
        }

        if(inputValue.length >= correctAnswer.toString().length){
            setShowError(true);
        }
    };

    useEffect(() => {
        if (!inputRef.current) return;
        inputRef.current.focus();

        const Keyboard = (window as any).Keyboard;
        if (!Keyboard) return;
        Keyboard.show();
    }, []);

    return (
        <Grid
            container
            item
            direction="column"
            justifyContent="center"
            alignItems="center"
            wrap="nowrap"
            style={{
                overflow: `scroll`,
                flex: 1,
                height: deviceOrientation === `portrait` ?  `100%` : `auto`,
                backgroundColor: `white`,
                padding: theme.spacing(2),
            }}
        >
            {showHeader && (
                <Grid item>
                    <Typography
                        gutterBottom
                        variant="h3"
                        align="center"
                        className={classes.titleText}>
                        <FormattedMessage id="parentalGate.title" />
                    </Typography>
                </Grid>)}
            <Grid
                item
                style={{
                    width: `75%`,
                    marginTop: theme.spacing(deviceOrientation === `portrait` ? 3 : 1),
                    marginBottom: theme.spacing(deviceOrientation === `portrait` ? 3 : 1),
                }}>
                <Typography
                    gutterBottom
                    variant="subtitle1"
                    align="center">
                    { message ? message : <FormattedMessage id="parentalGate.body.default" /> }
                </Typography>
            </Grid>
            <Grid
                item
                style={{
                    height: 10,
                }}>
                {isShowError && (
                    <Typography
                        gutterBottom
                        variant="subtitle1"
                        align="center"
                        className={classes.errorText}>
                        <FormattedMessage id="parentalGate.error.incorrect" />
                    </Typography>)}
            </Grid>
            <Grid item>
                <Grid
                    container
                    item
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    style={{
                        flex: 1,
                        margin: theme.spacing(1),
                    }}>
                    <Grid
                        item
                        style={{
                            margin: theme.spacing(1),
                        }}>
                        <FormattedMessage
                            id="parentalGate.challenge"
                            values={{
                                number1: challenge1,
                                number2: challenge2,
                            }} />
                    </Grid>
                    <Grid
                        item
                        style={{
                            margin: theme.spacing(1),
                        }}>
                        <Input
                            autoFocus
                            inputRef={inputRef}
                            type="number"
                            inputProps={{
                                min:`0`,
                                max:`99`,
                                size:`1`,
                                maxLength:`2`,
                                inputMode:`numeric`,
                                pattern:`[0-9]*`,
                                style: {
                                    textAlign: `center`,
                                },
                            }}
                            className={isShowError ? classes.errorText : ``}
                            onBlur={() => inputRef.current?.focus()}
                            onChange={(e) => {
                                handleChangeInputText(e.target.value);
                            }} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
