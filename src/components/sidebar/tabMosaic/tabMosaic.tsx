import Toolbar from "@/components/toolbar/toolbar";
import UserCamera from "@/components/userCamera/userCamera";
import { Session } from "@/pages/utils";
import { RoomContext } from "@/providers/roomContext";
import {
    activeTabState,
    mosaicViewSizeState,
} from "@/store/layoutAtoms";
import {
    Fade,
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import clsx from "clsx";
import React,
{
    useContext,
    useEffect,
    useState,
} from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    cameraGrid: {
        display: `grid`,
        gridTemplateColumns: `repeat(4, 1fr)`,
        gridGap: 20,
        padding: `0 30px`,
        "&>div":{
            minHeight: 260,
        },
    },
    gridContainerTeachers:{
        marginBottom: 15,
        "& $cameraGrid":{
            display: `flex`,
            justifyContent: `center`,
            "&>div":{
                minHeight: 150,
                width: 260,
            },
        },
    },
    gridContainerStudents: {
        overflowY : `scroll`,
        position: `relative`,
        paddingBottom: 20,
    },
    fullheight: {
        height: `100%`,
    },
    viewContainer:{
        height: `calc(100% - 10px)`,
        position: `relative`,
        overflow: `hidden`,
    },
    drawerContainer:{
        paddingBottom: 20,
    },
    toolbarContainer:{
        width: `calc(100% + 20px)`,
        margin: -10,
        marginTop: 0,
    },
    cameraGrid2:{
        gridTemplateColumns: `repeat(7, 1fr)`,
        "&>div":{
            minHeight: 115,
            fontSize: `0.8rem`,
        },
    },
    cameraGrid3:{
        gridTemplateColumns: `repeat(6, 1fr)`,
        "&>div":{
            minHeight: 135,
        },
    },
    cameraGrid4:{
        gridTemplateColumns: `repeat(5, 1fr)`,
        "&>div":{
            minHeight: 175,
        },
    },
    cameraGrid5:{
        gridTemplateColumns: `repeat(4, 1fr)`,
        "&>div":{
            minHeight: 210,
        },
    },
    cameraGrid6:{
        gridTemplateColumns: `repeat(3, 1fr)`,
        "&>div":{
            minHeight: 280,
        },
    },
}));

function TabMosaic () {
    const classes = useStyles();

    const [ mosaicViewSize, setMosaicViewSize ] = useRecoilState(mosaicViewSizeState);
    const [ activeTab, setActiveTab ] = useRecoilState(activeTabState);

    const { sessions } = useContext(RoomContext);
    const [ studentsSessions, setStudentsSessions ] = useState<Session[]>([]);
    const [ teachersSessions, setTeachersSessions ] = useState<Session[]>([]);

    useEffect(() => {
        const teachers = [ ...sessions.values() ].filter(session => session.isTeacher === true);
        setTeachersSessions(teachers);

        const students = [ ...sessions.values() ].filter(session => session.isTeacher !== true);
        setStudentsSessions(students);
    }, [ sessions, sessions.size ]);

    useEffect(() => {
        const listener = (event:any) => {
            if (event.code === `27` || event.code === `Escape`) {
                setActiveTab(`participants`);
            }
        };
        window.addEventListener(`keydown`, listener);
        return () => window.removeEventListener(`keydown`, listener);
    }, []);

    return (
        <Fade in>
            <Grid
                container
                direction="column"
                className={classes.fullheight}>
                <Grid
                    item
                    xs>
                    <Grid
                        container
                        direction="column"
                        className={classes.viewContainer}>
                        <Grid
                            item
                            className={classes.gridContainerTeachers}>
                            <div className={classes.cameraGrid}>
                                {teachersSessions.map((user) => (
                                    <UserCamera
                                        key={user.id}
                                        user={user} />
                                ))}
                            </div>
                        </Grid>
                        <Grid
                            item
                            xs
                            className={classes.gridContainerStudents}>
                            <div className={clsx(classes.cameraGrid, {
                                [classes.cameraGrid2] : mosaicViewSize === 2,
                                [classes.cameraGrid3] : mosaicViewSize === 3,
                                [classes.cameraGrid4] : mosaicViewSize === 4,
                                [classes.cameraGrid5] : mosaicViewSize === 5,
                                [classes.cameraGrid6] : mosaicViewSize === 6,
                            })}>
                                {studentsSessions.map((user) => (
                                    <UserCamera
                                        key={user.id}
                                        user={user} />
                                ))}
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid
                    item
                    className={classes.toolbarContainer}>
                    <Toolbar />
                </Grid>
            </Grid>

        </Fade>
    );
}

export default TabMosaic;
