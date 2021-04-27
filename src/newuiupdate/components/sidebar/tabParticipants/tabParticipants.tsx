import { Session } from "../../../../pages/room/room";
import { RoomContext } from "../../../providers/roomContext";
import UserCamera from "../../userCamera/userCamera";
import { NoItemList } from "../../utils/utils";
import {
    Fade,
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import { Person as UserIcon } from "@styled-icons/fluentui-system-regular/Person";
import clsx from "clsx";
import React, {
    useContext, useEffect, useState,
} from "react";

const useStyles = makeStyles((theme: Theme) => ({
    cameraGrid: {
        display: `grid`,
        gridTemplateColumns: `1fr 1fr`,
        gridGap: `10px`,
    },
    cameraGridSingleTeacher:{
        gridTemplateColumns: `1fr`,
        minHeight: `130px`,
        padding: `0 30px`,
    },
    gridContainerTeachers:{
        marginBottom: `15px`,
    },
    gridContainerStudents: {
        overflowY : `scroll`,
        marginBottom: -10,
        paddingBottom: 10,
    },
    fullheight: {
        height: `100%`,
    },
}));

function TabParticipants () {
    const classes = useStyles();
    const { sessions } = useContext(RoomContext);
    const [ studentsSessions, setStudentsSessions ] = useState<Session[]>([]);
    const [ teachersSessions, setTeachersSessions ] = useState<Session[]>([]);

    useEffect(() => {
        const teachers = [ ...sessions.values() ].filter(session => session.isTeacher === true);
        setTeachersSessions(teachers);

        const students = [ ...sessions.values() ].filter(session => session.isTeacher !== true);
        setStudentsSessions(students);
    }, [ sessions, sessions.size ]);

    return (
        <Fade in>
            <Grid
                container
                direction="column"
                className={classes.fullheight}>
                <Grid
                    item
                    className={classes.gridContainerTeachers}>
                    {teachersSessions.length ? (
                        <div className={clsx(classes.cameraGrid, {
                            [classes.cameraGridSingleTeacher] : teachersSessions.length === 1,
                        })}>
                            {teachersSessions.map((user) => (
                                <UserCamera
                                    key={user.id}
                                    user={user} />
                            ))}
                        </div>
                    ) : <NoItemList
                        icon={<UserIcon />}
                        text="No teachers connected" />}

                </Grid>
                <Grid
                    item
                    xs
                    className={clsx({
                        [classes.gridContainerStudents]: studentsSessions.length,
                    })}>
                    {studentsSessions.length ? (
                        <div className={classes.cameraGrid}>
                            {studentsSessions.map((user) => (
                                <UserCamera
                                    key={user.id}
                                    user={user} />
                            ))}
                        </div>
                    ) : (
                        <NoItemList
                            icon={<UserIcon />}
                            text="No students connected" />
                    )}
                </Grid>
            </Grid>
        </Fade>
    );
}

export default TabParticipants;
