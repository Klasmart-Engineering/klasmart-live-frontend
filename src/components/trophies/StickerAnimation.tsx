import starAnimation from "../../assets/stickers/star.json";
import greatJobAnimation from "../../assets/stickers/thumbs-up.json";
import trophyAnimation from "../../assets/stickers/trophy.json";
import TrophyKinds from './trophyKind';
import { useTrophy } from '@/data/live/state/useTrophy';
import { makeStyles } from "@material-ui/core";
import Lottie from "lottie-react";
import React,
{
    useEffect,
    useState,
} from 'react';

export type Trophy = { from: string; user: string; kind: string };

const useStyles = makeStyles(() => ({
    root: {
        position: `fixed`,
        left: 0,
        top: 0,
        width: `100%`,
        height: `100%`,
        zIndex: 2000,
    },
}));

export function StickerAnimation () {
    const [ animationData, setAnimationData ] = useState<unknown>();
    const [ display, setDisplay ] = useState(false);

    const classes = useStyles();
    const trophy = useTrophy();

    const handleTrophy = (trophy: Trophy) => {
        if (TrophyKinds[trophy.kind]) {
            switch(trophy.kind){
            case `star`:
                setAnimationData(starAnimation);
                break;
            case `trophy`:
                setAnimationData(trophyAnimation);
                break;
            case `great_job`:
                setAnimationData(greatJobAnimation);
                break;
            case `awesome`:
                setAnimationData(greatJobAnimation);
                break;
            default:
                break;
            }
            setDisplay(true);
        }
    };

    useEffect(() => {
        if (trophy) {
            handleTrophy(trophy);
        }
    }, [ trophy ]);

    return (
        display ? (
            <Lottie
                loop={false}
                animationData={animationData}
                className={classes.root}
                onComplete={() => setDisplay(false)}
            />
        ) : <></>
    );
}
