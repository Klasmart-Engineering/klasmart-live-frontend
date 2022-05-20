import LanguageCard from "./languageCard";
import { Grid, Theme } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
    grid: {
        display: `grid`,
        gridTemplateColumns: `repeat(3,1fr)`,
    },
}));

function Settings () {
    const classes = useStyles();

    return (
        <>
            <div className={classes.grid}>
                <LanguageCard />
            </div>
        </>
    );
}

export default Settings;
