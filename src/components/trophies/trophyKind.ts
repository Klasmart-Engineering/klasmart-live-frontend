import rewardSound1 from "../../assets/audio/trophies/reward1.mp3";
import rewardSound2 from "../../assets/audio/trophies/reward2.mp3";
import awesome from "../../assets/img/trophies/encourage/awesome.png";
import greatJob from "../../assets/img/trophies/encourage/great_job.png";
import looksGreat from "../../assets/img/trophies/encourage/looks_great.png";
import wellDone from "../../assets/img/trophies/encourage/well_done.png";
import heart2 from "../../assets/img/trophies/heart2.png";
import goldMedal from "../../assets/img/trophies/medals/medal_gold_2.png";
import star3 from "../../assets/img/trophies/star3.png";
import trophy from "../../assets/img/trophies/trophy.png";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

export type TrophyKind = {
    name: string;
    image: string;
    audio: string;
    style: CSSProperties;
    confetti?: boolean;
}

const TrophyKinds: Record<string, TrophyKind> = {
    trophy: {
        name: `Trophy`,
        image: trophy,
        audio: rewardSound1,
        confetti: true,
        style: {
            width: 360,
        },
    },
    star: {
        name: `Star`,
        image: star3,
        audio: rewardSound1,
        confetti: true,
        style: {
            width: 420,
        },
    },
    medal: {
        name: `Gold Medal`,
        image: goldMedal,
        audio: rewardSound1,
        confetti: true,
        style: {
            width: 380,
        },
    },
    heart: {
        name: `Heart`,
        image: heart2,
        audio: rewardSound1,
        confetti: true,
        style: {
            width: 380,
        },
    },
    awesome: {
        name: `Awesome`,
        image: awesome,
        audio: rewardSound2,
        style: {
            width: 580,
        },
    },
    great_job: {
        name: `Great Job`,
        image: greatJob,
        audio: rewardSound2,
        style: {
            width: 580,
        },
    },
    looks_great: {
        name: `Looks Great`,
        image: looksGreat,
        audio: rewardSound2,
        style: {
            width: 580,
        },
    },
    well_done: {
        name: `Well Done`,
        image: wellDone,
        audio: rewardSound2,
        style: {
            width: 580,
        },
    },
};

export const getRandomKind = (kinds?: string[]) => {
    let keys: string[] = [];
    if (kinds ) {
        keys = kinds;
    } else{
        keys = Object.keys(TrophyKinds);
    }
    return keys[keys.length * Math.random() << 0];
};

export default TrophyKinds;
