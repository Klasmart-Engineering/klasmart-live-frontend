import { useCordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import { selectedRegionState } from "@/app/model/appModel";
import { THEME_COLOR_PRIMARY_DEFAULT } from "@/config";
import {
    Button,
    createStyles,
    makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import React,
{ useCallback } from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme) => createStyles({
    regionButton: {
        boxShadow: `none`,
        backgroundColor: theme.palette.grey[200],
        marginBottom: theme.spacing(1),
        "&:hover": {
            boxShadow: `none`,
            backgroundColor: theme.palette.grey[200],
        },
    },
    regionButtonActive: {
        backgroundColor: THEME_COLOR_PRIMARY_DEFAULT,
        color: theme.palette.common.white,
    },
}));

export function DevSelectRegion (){
    const classes = useStyles();

    const regions = [
        {
            id: `localhost`,
            name: `Localhost`,
        },
        {
            id: `auth.alpha.kidsloop.dev`,
            name: `Global Alpha`,
        },
        {
            id: `auth.alpha.kidsloop.net`,
            name: `Alpha`,
        },
        {
            id: `auth.stage.kidsloop.live`,
            name: `Staging`,
        },
        {
            id: `auth.kidsloop.live`,
            name: `Production`,
        },
        {
            id: `auth.sso.kidsloop.live`,
            name: `SSO`,
        },
        {
            id: `auth.beta.kidsloop.id`,
            name: `Indonesia Beta`,
        },
        {
            id: `auth.beta.kidsloop.vn`,
            name: `Vietnam Beta`,
        },
        {
            id: `auth.research.kidsloop.live`,
            name: `R&D Korea`,
        },
    ];

    const [ selectedRegion, setSelectedRegion ] = useRecoilState(selectedRegionState);
    const { restart } = useCordovaSystemContext();

    const selectRegionWithId = useCallback((regionId: string) => {
        setSelectedRegion({
            ...selectedRegion,
            regionId,
        });

        if (restart) {
            restart();
        }
    }, [ selectedRegion, restart ]);

    return (
        <>
            {regions.map(region =>
                <Button
                    key={region.id}
                    fullWidth
                    variant="contained"
                    size="large"
                    className={clsx(classes.regionButton, {
                        [classes.regionButtonActive]: region.id === selectedRegion.regionId,
                    })}
                    onClick={() => { selectRegionWithId(region.id); }}
                >
                Select region: {region.name}
                </Button>)}
        </>
    );
}
