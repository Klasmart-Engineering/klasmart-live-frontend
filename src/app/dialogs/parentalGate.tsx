import StyledButton from "../../components/styled/button";
import {
    Input,
    useTheme,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import React,
{
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

interface Props {
    onCompleted: () => void;
    message?: string;
}

export function ParentalGate ({ onCompleted, message }: Props): JSX.Element {
    const theme = useTheme();

    const [ challenge1 ] = useState<number>(Math.ceil(Math.random() * 50));
    const [ challenge2 ] = useState<number>(Math.ceil(Math.random() * 50));

    const correctAnswer = useMemo<number>(() => {
        return challenge1 + challenge2;
    }, [ challenge1, challenge2 ]);

    const [ completed, setCompleted ] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement>();

    useEffect(() => {
        if(!inputRef.current) return;
        inputRef.current.focus();

        const Keyboard = (window as any).Keyboard;
        if(!Keyboard) return;
        Keyboard.show();
    }, []);

    useEffect(() => {
        if(!completed) return;
        onCompleted();
    }, [ completed ]);

    return (
        <Grid
            container
            item
            direction="column"
            justify="center"
            alignItems="center"
            style={{
                flex: 1,
                height: `100%`,
                backgroundColor: `white`,
                padding: theme.spacing(2),
            }}
        >
            <Grid item>
                <Typography
                    gutterBottom
                    variant="h3"
                    align="center">
                    Notice for parents
                </Typography>
            </Grid>
            <Grid
                item
                style={{
                    width: `75%`,
                }}>
                <Typography
                    gutterBottom
                    variant="subtitle1"
                    align="center">
                    { message ? message : `This application contains user generated content. The content have been approved by qualified lesson material administrators. Please acknowlege this by completing the challenge below.` }
                </Typography>
            </Grid>
            <Grid item>
                <Grid
                    container
                    item
                    direction="row"
                    justify="center"
                    alignItems="center"
                    style={{
                        flex: 1,
                        margin: theme.spacing(2),
                    }}>
                    <Grid
                        item
                        style={{
                            margin: theme.spacing(1),
                        }}>
                        What is {challenge1} + {challenge2}?
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
                            }}
                            error={!completed && inputRef.current && inputRef.current.value.length > 0}
                            onBlur={() => inputRef.current && inputRef.current.focus()}
                            onChange={(e) => {
                                const answer = Number(e.target.value);
                                setCompleted(answer === correctAnswer);
                            }} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
