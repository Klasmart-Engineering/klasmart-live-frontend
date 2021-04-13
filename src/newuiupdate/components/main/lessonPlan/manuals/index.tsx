import { materialActiveIndexState } from "../../../../states/layoutAtoms";
import {
    Grid,
    makeStyles,
    Box,
    Theme,
    Typography,
} from "@material-ui/core";
import React from "react";
import { useRecoilState } from "recoil";
import Manual from "./item";

import { Book as ManualIcon } from "@styled-icons/bootstrap/Book";

const useStyles = makeStyles((theme: Theme) => ({
    fullHeight:{
        height: `100%`,
    },
    container:{
        padding : `1rem 10px`,
        paddingBottom: 0,
    },
    noResultContainer:{},
    noResultIcon:{
        color: theme.palette.grey[300],
        marginBottom: 10,
    },
    noResultText:{
        color: theme.palette.grey[700],
    },
}));


const manuals = [
    {
        id: 1,
        title: `Teacher Manual #1`,
        type: `pdf`,
    },
    {
        id: 2,
        title: `Teacher Manual #2`,
        type: `pdf`,
    },
    {
        id: 3,
        title: `Teacher Manual #3`,
        type: `pdf`,
    },
];


function Manuals () {
    const classes = useStyles();

    return (
        <Grid
            container
            direction="column"
            className={classes.fullHeight}>
            <Grid
                item
                xs>
                {manuals.length === 0 ?
                    <NoManuals /> :
                    (<div className={classes.container}>
                        {manuals?.map(manual => (
                            <Manual
                                title={manual.title}
                                type={manual.type} />
                        ))}
                    </div>)
                }
            </Grid>
        </Grid>
    );
}

export default Manuals;


function NoManuals (){
    const classes = useStyles();

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            className={classes.fullHeight}>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center">
                <ManualIcon
                    size="4rem"
                    className={classes.noResultIcon} />
                <Typography className={classes.noResultText}>No manuals</Typography>
            </Box>
        </Box>
    );
}
