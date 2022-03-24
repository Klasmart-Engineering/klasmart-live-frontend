import { CarouselSlide } from "./carouselSlide";
import { isShowOnBoardingState } from "@/app/model/appModel";
import HomeFunImg from "@/assets/img/onboarding/home_fun.svg";
import LiveImg from "@/assets/img/onboarding/live.svg";
import StudyImg from "@/assets/img/onboarding/study.svg";
import {
    BG_COLOR_CAROUSEL_DOT_INACTIVE,
    BG_COLOR_SIGN_IN_BUTTON,
    THEME_COLOR_BACKGROUND_ON_BOARDING,
} from "@/config";
import {
    Button,
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import Carousel from 'nuka-carousel';
import React,
{ useState } from 'react';
import {
    FormattedMessage,
    useIntl,
} from "react-intl";
import { useHistory } from "react-router-dom";
import { useSetRecoilState } from "recoil";

enum BoardingSliderType {
    STUDY,
    HOME_FUN_STUDY,
    LIVE
}

interface CarouselDotControlsProps {
    currentSlide: number;
    goToSlide: (slide:number) => void;
    slideCount: number;
}

const CAROUSEL_DOT_SIZE = 20;

const useStyles = makeStyles((theme: Theme) => createStyles({
    container: {
        height: `100%`,
        backgroundColor: THEME_COLOR_BACKGROUND_ON_BOARDING,
    },
    fullWidth: {
        width: `100%`,
    },
    carousel: {
        height: `70% !important`,
        outline: `none !important`,
        "& .slide-current" : {
            outline:   `none`,
            height: `100% !important`,
        },
        "& .slider-list" : {
            cursor: `none !important`,
            height: `93% !important`,
        },
    },
    btnSignIn: {
        marginTop: theme.spacing(10),
        borderRadius: theme.spacing(3),
        borderTopRightRadius: theme.spacing(1),
        width: `80%`,
        height: 60,
        backgroundColor: BG_COLOR_SIGN_IN_BUTTON,
        color: theme.palette.common.white,
        [theme.breakpoints.up(`sm`)]: {
            width: 360,
            marginTop: theme.spacing(20),
        },
    },
    fontWeightBold: {
        fontWeight: theme.typography.fontWeightBold as number,
    },
    carouselDotsList: {
        padding: 0,
        position: `relative`,
        top: theme.spacing(2),

        "& li": {
            listStyleType: `none`,
            display: `inline-block`,

            " & div": {
                borderRadius: CAROUSEL_DOT_SIZE,
                width: CAROUSEL_DOT_SIZE,
                height: CAROUSEL_DOT_SIZE,
                margin: theme.spacing(0, 1),
            },
        },
    },
}));

export function OnBoardingPage (): JSX.Element {
    const classes = useStyles();
    const intl = useIntl();
    const history = useHistory();
    const setShowOnBoarding = useSetRecoilState(isShowOnBoardingState);
    const [ autoplay, setAutoplay ] = useState(true);
    const slideArray = [
        {
            id: BoardingSliderType.STUDY,
            title: `onboarding.slider.title.1`,
            body: `onboarding.slider.body.1`,
            image: StudyImg,
        },
        {
            id: BoardingSliderType.HOME_FUN_STUDY,
            title: `onboarding.slider.title.2`,
            body: `onboarding.slider.body.2`,
            image: HomeFunImg,
        },
        {
            id: BoardingSliderType.LIVE,
            title: `onboarding.slider.title.3`,
            body: `onboarding.slider.body.3`,
            image: LiveImg,
        },
    ];

    const renderCarouselDotControls = ({
        currentSlide, goToSlide, slideCount,
    }: CarouselDotControlsProps) => {
        return (
            <ul className={classes.carouselDotsList}>
                {[ ...Array(slideCount) ].map((sc, i) => (
                    <li
                        key={i}
                        onClick={() => goToSlide(i)}
                    >
                        <div style={{
                            background: currentSlide === i ? BG_COLOR_SIGN_IN_BUTTON : BG_COLOR_CAROUSEL_DOT_INACTIVE,
                        }} />
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="flex-start"
            className={classes.container}>
            <Carousel
                wrapAround
                autoplay={autoplay}
                speed={400}
                className={classes.carousel}
                autoplayInterval={3000}
                renderCenterLeftControls={null}
                renderCenterRightControls={null}
                renderBottomCenterControls={(props) => renderCarouselDotControls(props)}
                slidesToScroll={1}
                onDragStart={() => setAutoplay(false)}>
                {slideArray.map(item => (
                    <CarouselSlide
                        key={item.id}
                        id={item.id}
                        title={intl.formatMessage({
                            id: item.title,
                        })}
                        body={intl.formatMessage({
                            id: item.body,
                        })}
                        image={item.image}
                    />
                ))}
            </Carousel>
            <Grid
                item
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                className={classes.fullWidth}>
                <Button
                    disableElevation
                    className={classes.btnSignIn}
                    variant="contained"
                    size="large"
                    onClick={() => {
                        setShowOnBoarding(false);
                        history.push(`/`);
                    }}>
                    <Typography
                        variant="h5"
                        className={classes.fontWeightBold}>
                        <FormattedMessage
                            id={`landingPage.signIn`}
                            defaultMessage={`Sign In`} />
                    </Typography>
                </Button>
            </Grid>
        </Grid>
    );
}
