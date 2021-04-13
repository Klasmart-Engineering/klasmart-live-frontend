import {
    mosaicViewSizeState,
} from "../../states/layoutAtoms";
import {
    IconButton,
    makeStyles,
    Menu,
    Slider,
    Theme,
} from "@material-ui/core";
import { SmartDisplay as SliderIcon } from "@styled-icons/material-twotone/SmartDisplay";
import React,
{
    useState,useEffect
} from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    sliderIconButton:{
        color: theme.palette.text.primary,
        boxShadow: `0 2px 6px 0px rgba(0,0,0,0.3)`,
        transform: `scale(0.8)`,
    },
    slider:{
        minHeight: 150,
        margin: '10px 3px',
    },
}));


function MosaicSlider () {
    const classes = useStyles();
    const [ mosaicViewSize, setMosaicViewSize ] = useRecoilState(mosaicViewSizeState);
    const [ mosaicGridSettingsEl, setMosaicGridSettingsEl ] = useState<null | HTMLElement>(null);
    const handleSliderGridOpen = (event: React.SyntheticEvent<HTMLAnchorElement>) => { setMosaicGridSettingsEl(event.currentTarget); };
    const handleSliderGridClose = () => { setMosaicGridSettingsEl(null); };

    const handleSliderChange = (event: any, newValue: number | number[]) => {
        setMosaicViewSize(newValue);
    };

    return (
        <>
        <Menu
            id="grid-settings-menu"
            anchorEl={mosaicGridSettingsEl}
            getContentAnchorEl={null}
            anchorOrigin={{
                vertical: `top`,
                horizontal: `center`,
            }}
            transformOrigin={{
                vertical: `bottom`,
                horizontal: `center`,
            }}
            open={Boolean(mosaicGridSettingsEl)}
            MenuListProps={{
                onPointerLeave: handleSliderGridClose,
                disablePadding: true,
            }}
            onClose={handleSliderGridClose}
        >

            <Slider
                orientation="vertical"
                value={typeof mosaicViewSize === 'number' ? mosaicViewSize : 0}
                onChange={handleSliderChange}
                step={1}
                marks
                min={3}
                max={6}
                className={classes.slider}
            />
        </Menu>

        <IconButton
            component="a"
            aria-label="Grid slider button"
            aria-controls="grid-sldier-popover"
            aria-haspopup="true"
            size="small"
            className={classes.sliderIconButton}
            onClick={handleSliderGridOpen}
            >
            <SliderIcon size="1.6rem"/>
        </IconButton>
        </>
    );
}

export default MosaicSlider;
