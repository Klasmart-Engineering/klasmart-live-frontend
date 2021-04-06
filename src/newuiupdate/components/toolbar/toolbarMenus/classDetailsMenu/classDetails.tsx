import React from "react";

import {
	makeStyles,
	Theme,
	Typography,
} from "@material-ui/core";


const useStyles = makeStyles((theme: Theme) => ({
	root: {

	},
	detailsLabel:{
		color: theme.palette.text.primary,
		paddingRight: 30,
		paddingBottom: 10,
	}, 
	detailsValue:{
		color: theme.palette.grey[600],
		paddingBottom: 10,
	}
}));



function ClassDetails() {
	const classes = useStyles();

	return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <td className={classes.detailsLabel}><Typography>Class Name</Typography></td>
                        <td className={classes.detailsValue}><Typography>Class Name</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography>Lesson Name</Typography></td>
                        <td className={classes.detailsValue}><Typography>Animals</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography>Room ID</Typography></td>
                        <td className={classes.detailsValue}><Typography>AD01</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography>Class Type</Typography></td>
                        <td className={classes.detailsValue}><Typography>Live</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography>Enrolled Participants</Typography></td>
                        <td className={classes.detailsValue}><Typography>16 students, 1 teacher</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography>Program</Typography></td>
                        <td className={classes.detailsValue}><Typography>Badanamu ESL</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography>Subject</Typography></td>
                        <td className={classes.detailsValue}><Typography>Language / Literacy</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography>Lesson Plan</Typography></td>
                        <td className={classes.detailsValue}><Typography>Animals</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography>Lesson Materials</Typography></td>
                        <td className={classes.detailsValue}><Typography>20 lesson materials</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography>Start time</Typography></td>
                        <td className={classes.detailsValue}><Typography>2021/03/03, 09:00 am</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography>End time</Typography></td>
                        <td className={classes.detailsValue}><Typography>2021/03/03, 10:00 am</Typography></td>
                    </tr>
                </tbody>
            </table>
        </div>
	);
}

export default ClassDetails;
