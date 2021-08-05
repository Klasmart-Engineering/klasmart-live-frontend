import { classInfoState } from "../../../../../store/layoutAtoms";
import {
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import React,
{ useContext } from "react";
import { FormattedMessage } from "react-intl";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    table: {
        width: `100%`,
        borderCollapse: `collapse`,
    },
    tbody: {
        "& > tr": {
            "& > td": {
                paddingBottom: `20px`,

                "&:nth-of-type(1)": {
                    color: theme.palette.text.primary,
                    paddingRight: `30px`,
                },

                "&:nth-of-type(2)": {
                    color: theme.palette.grey[600],
                },
            },

            "&:last-of-type": {
                "& > td": {
                    paddingBottom: `0`,
                },
            },

            [theme.breakpoints.down(`sm`)]: {
                "& > td": {
                    paddingBottom: `10px`,

                    "&:nth-of-type(1)": {
                        paddingRight: `15px`,
                    },
                },
            },
        },
    },
}));

function ClassDetails () {
    const classes = useStyles();
    const [ classInfo, setClassInfo ] = useRecoilState(classInfoState);

    return (
        <div>
            <table className={classes.table}>
                <tbody className={classes.tbody}>
                    <tr>
                        <td><Typography><FormattedMessage id="classdetails_class_name" /></Typography></td>
                        <td><Typography>{classInfo.class_name}</Typography></td>
                    </tr>
                    <tr>
                        <td><Typography><FormattedMessage id="classdetails_lesson_name" /></Typography></td>
                        <td><Typography>{classInfo.lesson_name}</Typography></td>
                    </tr>
                    <tr>
                        <td><Typography><FormattedMessage id="classdetails_room_id" /></Typography></td>
                        <td><Typography>{classInfo.room_id}</Typography></td>
                    </tr>
                    <tr>
                        <td><Typography><FormattedMessage id="classdetails_class_type" /></Typography></td>
                        <td><Typography>{classInfo.class_type}</Typography></td>
                    </tr>
                    <tr>
                        <td><Typography><FormattedMessage id="classdetails_enrolled_participants" /></Typography></td>
                        <td><Typography>{classInfo.enrolled_participants}</Typography></td>
                    </tr>
                    <tr>
                        <td><Typography><FormattedMessage id="classdetails_program" /></Typography></td>
                        <td><Typography>{classInfo.program}</Typography></td>
                    </tr>
                    <tr>
                        <td><Typography><FormattedMessage id="classdetails_subject" /></Typography></td>
                        <td><Typography>{classInfo.subject}</Typography></td>
                    </tr>
                    <tr>
                        <td><Typography><FormattedMessage id="title_lesson_plan" /></Typography></td>
                        <td><Typography>{classInfo.lesson_plan}</Typography></td>
                    </tr>
                    <tr>
                        <td><Typography><FormattedMessage id="classdetails_lesson_materials" /></Typography></td>
                        <td><Typography>{classInfo.materials} <span style={{
                            textTransform: `lowercase`,
                        }}><FormattedMessage id="classdetails_lesson_materials" /></span></Typography></td>
                    </tr>
                    <tr>
                        <td><Typography><FormattedMessage id="classdetails_start_time" /></Typography></td>
                        <td><Typography>{classInfo.start_at}</Typography></td>
                    </tr>
                    <tr>
                        <td><Typography><FormattedMessage id="classdetails_end_time" /></Typography></td>
                        <td><Typography>{classInfo.end_at}</Typography></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default ClassDetails;
