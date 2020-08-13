import heart2 from '../../assets/img/trophies/heart2.png';
import star3 from '../../assets/img/trophies/star3.png';
import rewardSound1 from '../../assets/audio/trophies/reward1.mp3';
import rewardSound2 from '../../assets/audio/trophies/reward2.mp3';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

export type TrophyKind = {
    name: string,
    image: string,
    audio: string,
    style: CSSProperties,
}

const TrophyKinds: Record<string, TrophyKind> = {
    'default': {
        name: "Star",
        image: star3,
        audio: rewardSound2,
        style: {
            width: 320,
        }
    },
    'heart2': {
        name: "Heart",
        image: heart2,
        audio: rewardSound1,
        style: {
            width: 320,
        }
    }
};

export const getRandomKind = () => {
    const keys = Object.keys(TrophyKinds);
    return keys[keys.length * Math.random() << 0];
}

export default TrophyKinds;