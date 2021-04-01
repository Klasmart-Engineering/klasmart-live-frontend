import { Grid } from '@material-ui/core';
import React from 'react'
import Main from './components/main';
import Sidebar from './components/sidebar';


function Layout() {
    return (
        <Grid container>
			<Grid item xs>
				<Main />
			</Grid>
			<Grid item>
                <Sidebar />
			</Grid>
		</Grid>
    )
}

export default Layout
