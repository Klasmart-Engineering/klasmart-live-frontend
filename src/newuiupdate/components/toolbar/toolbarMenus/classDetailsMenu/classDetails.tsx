import { classInfoState } from "../../../../states/layoutAtoms";
import {
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import React from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    detailsLabel:{
        color: theme.palette.text.primary,
        paddingRight: 30,
        paddingBottom: 10,
    },
    detailsValue:{
        color: theme.palette.grey[600],
        paddingBottom: 10,
    },
}));

function ClassDetails () {
    const classes = useStyles();
    const [ classInfo, setClassInfo ] = useRecoilState(classInfoState);

    return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <td className={classes.detailsLabel}><Typography>Class Name</Typography></td>
                        <td className={classes.detailsValue}><Typography>{classInfo.class_name}</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography>Lesson Name</Typography></td>
                        <td className={classes.detailsValue}><Typography>{classInfo.lesson_name}</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography>Room ID</Typography></td>
                        <td className={classes.detailsValue}><Typography>{classInfo.room_id}</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography>Class Type</Typography></td>
                        <td className={classes.detailsValue}><Typography>{classInfo.class_type}</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography>Enrolled Participants</Typography></td>
                        <td className={classes.detailsValue}><Typography>{classInfo.enrolled_participants}</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography>Program</Typography></td>
                        <td className={classes.detailsValue}><Typography>{classInfo.program}</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography>Subject</Typography></td>
                        <td className={classes.detailsValue}><Typography>{classInfo.subject}</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography>Lesson Materials</Typography></td>
                        <td className={classes.detailsValue}><Typography>{classInfo.materials.length}</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography>Start time</Typography></td>
                        <td className={classes.detailsValue}><Typography>{classInfo.start_at}</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography>End time</Typography></td>
                        <td className={classes.detailsValue}><Typography>{classInfo.end_at}</Typography></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default ClassDetails;
