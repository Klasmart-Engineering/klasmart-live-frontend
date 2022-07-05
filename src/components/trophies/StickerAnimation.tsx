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

enum TrophyKind {
    STAR = `star`,
    TROPHY = `trophy`,
    GREAT_JOB = `great_job`,
    AWESOME = `awesome`,
}
interface Trophy {
    from: string;
    user: string;
    kind: TrophyKind;
}

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
            case TrophyKind.STAR:
                setAnimationData(starAnimation);
                break;
            case TrophyKind.TROPHY:
                setAnimationData(trophyAnimation);
                break;
            case TrophyKind.GREAT_JOB:
                setAnimationData(greatJobAnimation);
                break;
            case TrophyKind.AWESOME:
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
            handleTrophy(trophy as Trophy);
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
