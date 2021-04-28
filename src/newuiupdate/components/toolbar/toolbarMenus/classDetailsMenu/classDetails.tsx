import { classInfoState } from "../../../../states/layoutAtoms";
import {
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";
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
                        <td className={classes.detailsLabel}><Typography><FormattedMessage id="classdetails_class_name" /></Typography></td>
                        <td className={classes.detailsValue}><Typography>{classInfo.class_name}</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography><FormattedMessage id="classdetails_lesson_name" /></Typography></td>
                        <td className={classes.detailsValue}><Typography>{classInfo.lesson_name}</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography><FormattedMessage id="classdetails_room_id" /></Typography></td>
                        <td className={classes.detailsValue}><Typography>{classInfo.room_id}</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography><FormattedMessage id="classdetails_class_type" /></Typography></td>
                        <td className={classes.detailsValue}><Typography>{classInfo.class_type}</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography><FormattedMessage id="classdetails_enrolled_participants" /></Typography></td>
                        <td className={classes.detailsValue}><Typography>{classInfo.enrolled_participants}</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography><FormattedMessage id="classdetails_program" /></Typography></td>
                        <td className={classes.detailsValue}><Typography>{classInfo.program}</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography><FormattedMessage id="classdetails_subject" /></Typography></td>
                        <td className={classes.detailsValue}><Typography>{classInfo.subject}</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography><FormattedMessage id="classdetails_lesson_materials" /></Typography></td>
                        <td className={classes.detailsValue}><Typography>{classInfo.materials.length}</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography><FormattedMessage id="classdetails_start_time" /></Typography></td>
                        <td className={classes.detailsValue}><Typography>{classInfo.start_at}</Typography></td>
                    </tr>
                    <tr>
                        <td className={classes.detailsLabel}><Typography><FormattedMessage id="classdetails_end_time" /></Typography></td>
                        <td className={classes.detailsValue}><Typography>{classInfo.end_at}</Typography></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default ClassDetails;
