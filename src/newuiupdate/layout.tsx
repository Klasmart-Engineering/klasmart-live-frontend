import Main from './components/main';
import Sidebar from './components/sidebar';
import { Grid } from '@material-ui/core';
import React from 'react';

import { classEndedState } from "./states/layoutAtoms";
import { useRecoilState } from "recoil";
import ClassEnded from './components/others/classEnded';

function Layout () {
    const [ classEnded, setClassEnded ] = useRecoilState(classEndedState);

    if(classEnded){
        return(<ClassEnded />)
    }

    return (
        <Grid container>
            <Grid
                item
                xs>
                <Main />
            </Grid>
            <Grid item>
                <Sidebar />
            </Grid>
        </Grid>
    );
}

export default Layout;