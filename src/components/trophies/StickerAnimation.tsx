import starAnimation from "../../assets/stickers/star.json";
import thumbsUpAnimation from "../../assets/stickers/thumbs-up.json";
import trophyAnimation from "../../assets/stickers/trophy.json";
import TrophyKinds,
{ TrophyKind } from './trophyKind';
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
    const [ trophyKind, setTrophyKind ] = useState<TrophyKind>(TrophyKinds.trophy);

    const classes = useStyles();
    const trophy = useTrophy();
    // const animationContainerRef = useRef(null);

    // const handleTrophy = (trophy: Trophy) => {
    //     if (TrophyKinds[trophy.kind]) {
    //         setTrophyKind(TrophyKinds[trophy.kind]);
    //     }
    //     setDisplay(true);
    // };

    useEffect(() => {
        if (trophy) {
            setAnimationAsset(starAnimation);
        }
    }, [ trophy, setAnimationAsset ]);

    return (
        animationAsset && (
            <Lottie
                animationData={animationAsset}
                loop={false}
                className={classes.root}
            />
        )
    );
}
