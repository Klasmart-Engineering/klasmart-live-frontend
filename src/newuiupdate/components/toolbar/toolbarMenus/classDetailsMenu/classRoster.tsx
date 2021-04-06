import React from "react";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
	makeStyles,
	Theme,
	Typography,
    List,
    ListItem,
    Box
} from "@material-ui/core";

import { UserAvatar } from "kidsloop-px"

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { useRecoilState } from "recoil";
import { usersState } from "../../../../states/layoutAtoms";

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
	},
    heading:{},
    number:{
        backgroundColor: theme.palette.text.primary,
        color: '#fff',
        width: 20,
        height: 20,
        display: 'inline-block',
        textAlign: 'center',
        borderRadius: 20,
        marginLeft: 20
    },
    userItem:{
        marginRight: 15,
        display:"flex",
        flexDirection:"row",
        alignItems:"center"
    },
    avatar:{
        marginRight: 5
    }
}));


function ClassRoster() {
	const classes = useStyles();

    // TODO : Switch to real data 
    const [users, setUsers] = useRecoilState(usersState);
    const teachers = users.filter(function (e) {
        return e.role === "teacher"
    });

    const students = users.filter(function (e) {
        return e.role === "student"
    });

	return (
        <div>
            <Accordion elevation={0}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>
                        Teachers <span className={classes.number}>{teachers.length}</span>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {teachers.map((user) => (
                        <Box
                            key={user.id}
                            className={classes.userItem}
                        >
                        <UserAvatar
                            name={user.name}
                            className={classes.avatar}
                            size="small"
                        />
                        <Typography>{user.name}</Typography>
                    </Box>
                    ))}
                </AccordionDetails>
            </Accordion>
            <Accordion elevation={0}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
                >
                    <Typography className={classes.heading}>
                        Students <span className={classes.number}>{students.length}</span>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {students.map((user) => (
                        <Box
                            key={user.id}
                            className={classes.userItem}
                        >
                            <UserAvatar
                                name={user.name}
                                className={classes.avatar}
                                size="small"
                            />
                            <Typography>{user.name}</Typography>
                        </Box>
                    ))}
                </AccordionDetails>
            </Accordion>
            <Accordion elevation={0}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3a-content"
                id="panel3a-header"
                >
                    <Typography className={classes.heading}>
                        Absents <span className={classes.number}>0</span>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                        sit amet blandit leo lobortis eget.
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </div>
	);
}

export default ClassRoster;
