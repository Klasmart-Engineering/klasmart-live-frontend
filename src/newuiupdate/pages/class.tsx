import { ClassType } from "../../store/actions";
import Main from '../components/main/main';
import Sidebar from '../components/sidebar/sidebar';
import { LocalSessionContext } from '../providers/providers';
import {
    Grid, useMediaQuery, useTheme,
} from '@material-ui/core';
import React, { useContext } from 'react';

function Class () {
    const { classtype } = useContext(LocalSessionContext);
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));

    return (
        <Grid
            container
            direction={isSmDown ? `column` : `row`}>
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
