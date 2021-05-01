import { ClassType } from "../../store/actions";
import Main from '../components/main/main';
import Sidebar from '../components/sidebar/sidebar';
import { LocalSessionContext } from '../providers/providers';
import { Grid } from '@material-ui/core';
import React, { useContext } from 'react';

function Class () {
    const { classtype } = useContext(LocalSessionContext);

    return (
        <Grid container>
            <Grid
                item
                xs>
                <Main />
            </Grid>
            {classtype === ClassType.LIVE &&
             <Grid item>
                 <Sidebar />
             </Grid>
            }
        </Grid>
    );
}

export default Class;
