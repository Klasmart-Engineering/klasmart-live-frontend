import {
    isChatOpenState,
    mosaicViewSizeState,
    usersState,
} from "../../states/layoutAtoms";
import Chat from "../main/chat/chat";
import Toolbar from "../toolbar";
import UserCamera from "../userCamera/userCamera";
import { StyledDrawer } from "../utils";
import {
    Grid,
    makeStyles,
    Theme,
    Fade
} from "@material-ui/core";
import clsx from "clsx";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    cameraGrid: {
        display: `grid`,
        gridTemplateColumns: `repeat(4, 1fr)`,
        gridGap: 20,
        padding: `0 30px`,
        "&>div":{
            minHeight: 260,
            fontSize: `1.35rem`,
        },
    },
    gridContainerTeachers:{
        marginBottom: 15,
        "& $cameraGrid":{
            display: `block`,
            "&>div":{
                minHeight: 150,
                width: 260,
                margin: '0 auto',
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
        width: 'calc(100% + 20px)',
        margin: -10,
        marginTop: 0
    },
    cameraGrid3:{
        gridTemplateColumns: `repeat(6, 1fr)`,
        "&>div":{
            minHeight: 200,
        },
    },
    cameraGrid4:{
        gridTemplateColumns: `repeat(5, 1fr)`,
        "&>div":{
            minHeight: 220,
        },
    },
    cameraGrid5:{
        gridTemplateColumns: `repeat(4, 1fr)`,
        "&>div":{
            minHeight: 270,
        },
    },
    cameraGrid6:{
        gridTemplateColumns: `repeat(3, 1fr)`,
        "&>div":{
            minHeight: 350,
        },
    },
}));

function TabMosaic () {
    const classes = useStyles();

    const [ users, setUsers ] = useRecoilState(usersState);
    const [ isChatOpen, setIsChatOpen ] = useRecoilState(isChatOpenState);
    const [ mosaicViewSize, setMosaicViewSize ] = useRecoilState(mosaicViewSizeState);

    const teachers = users.filter(function (e) {
        return e.role === `teacher`;
    });

    const students = users.filter(function (e) {
        return e.role === `student`;
    });


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
                        className={classes.viewContainer}>
                        <Grid
                            item
                            xs>
                            <Grid
                                container
                                direction="column"
                                className={classes.fullheight}>
                                <Grid
                                    item
                                    className={classes.gridContainerTeachers}>
                                    <div className={classes.cameraGrid}>
                                        {teachers.map((user) => (
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
                                        [classes.cameraGrid3] : mosaicViewSize === 3,
                                        [classes.cameraGrid4] : mosaicViewSize === 4,
                                        [classes.cameraGrid5] : mosaicViewSize === 5,
                                        [classes.cameraGrid6] : mosaicViewSize === 6,
                                    })}>
                                        {students.map((user) => (
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
                            className={classes.drawerContainer}>
                            <StyledDrawer active={isChatOpen}>
                                <Chat />
                            </StyledDrawer>
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
