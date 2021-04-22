import Main from '../components/main/main';
import Sidebar from '../components/sidebar/sidebar';
import { Grid } from '@material-ui/core';
import React from 'react';

function Class () {
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

export default Class;
