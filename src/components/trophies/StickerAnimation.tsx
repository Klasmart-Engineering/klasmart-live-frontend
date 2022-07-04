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
        position: `absolute`,
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,
        width: `100%`,
    },
}));

export function StickerAnimation () {
    const [ animationAsset, setAnimationAsset ] = useState<unknown>();

    const classes = useStyles();
    const trophy = useTrophy();

    const handleTrophy = (trophy: Trophy) => {
        console.log(trophy);
        if (TrophyKinds[trophy.kind]) {
            switch(trophy.kind){
            case `star`:
                setAnimationAsset(starAnimation);
                break;
            case `trophy`:
                setAnimationAsset(trophyAnimation);
                break;
            case `great_job`:
                setAnimationAsset(greatJobAnimation);
                break;
            case `awesome`:
                setAnimationAsset(greatJobAnimation);
                break;
            default:
                break;
            }
        }
    };

    useEffect(() => {
        if (trophy) {
            handleTrophy(trophy);
        }
    }, [ trophy ]);

    console.log(animationAsset);

    return (
        animationAsset ? (
            <Lottie
                animationData={animationAsset}
                loop={false}
                className={classes.root}
            />
        ) : <></>
    );
}
