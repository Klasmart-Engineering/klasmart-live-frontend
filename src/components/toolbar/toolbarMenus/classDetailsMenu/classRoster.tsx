import { LocalSessionContext } from "../../../../providers/providers";
import { classInfoState } from "../../../../store/layoutAtoms";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { UserAvatar } from "kidsloop-px";
import React,
{ useContext } from "react";
import { FormattedMessage } from "react-intl";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        margin: `-8px 0`,
        minHeight: `447px`,

        [theme.breakpoints.down(`sm`)]: {
            minHeight: `347px`,
        },
    },
    accordion: {
        margin: `0 !important`,

        "&:before": {
            display: `none`,
        },
        "&:after": {
            display: `none`,
        },
    },
    accordionSummary: {
        minHeight: `0 !important`,
        padding: `0`,

        "& > div": {
            margin: `0 !important`,
        },
    },
    accordionDetails: {
        flexWrap: `wrap`,
        padding: `0 0 0 15px`,
    },
    detailsLabel: {
        color: theme.palette.text.primary,
        paddingRight: 30,
        paddingBottom: 10,
    },
    detailsValue: {
        color: theme.palette.grey[600],
        paddingBottom: 10,
    },
    heading: {
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
    },
    number: {
        backgroundColor: theme.palette.text.primary,
        color: `#fff`,
        width: `14px`,
        height: `14px`,
        fontSize: `8px`,
        display: `inline-flex`,
        alignItems: `center`,
        justifyContent: `center`,
        borderRadius: 20,
        marginLeft: 10,
    },
    gridUsers: {
        display: `flex`,
        flexWrap: `wrap`,
    },
    userItem: {
        width: `calc(50% - 15px)`,
        margin: `5px 15px 5px 0`,
        display:`flex`,
        flexDirection:`row`,
        alignItems:`center`,

        "&:nth-of-type(2n)": {
            marginRight: 0,
        },
    },
    avatar: {
        marginRight: 10,
    },
}));

function ClassRoster () {
    const classes = useStyles();

    const [ users, setUsers ] = useRecoilState(classInfoState);
    const { isTeacher } = useContext(LocalSessionContext);
    const teachers = users.teachers;
    const students = users.students;

    // TODO : This is not optimal
    const resetPosition = (event: React.ChangeEvent<unknown>) => {
        setTimeout(function (){
            window.dispatchEvent(new Event(`resize`));
        }, 200);
    };

    // TODO : KLL-525 - (Phase 1 : Showing roster | Phase 2 : Updating roster with absentees)
    return (
        <div className={classes.root}>
            <Accordion
                defaultExpanded
                elevation={0}
                className={classes.accordion}
                onChange={resetPosition}>
                <AccordionSummary
                    className={classes.accordionSummary}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>
                        <FormattedMessage id="classdetails_roster_teachers" /> <span className={classes.number}>{teachers.length}</span>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails
                    className={classes.accordionDetails}
                >
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
            { isTeacher &&
                <>
                    <Accordion
                        elevation={0}
                        className={classes.accordion}
                        onChange={resetPosition}>
                        <AccordionSummary
                            className={classes.accordionSummary}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                        >
                            <Typography className={classes.heading}>
                                <FormattedMessage id="classdetails_roster_students" /> <span className={classes.number}>{students.length}</span>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            className={classes.accordionDetails}
                        >
                            <Box className={classes.gridUsers}>
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
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion
                        hidden // TODO : Absents informations + translation keys
                        elevation={0}
                        className={classes.accordion}
                        onChange={resetPosition}>
                        <AccordionSummary
                            className={classes.accordionSummary}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3a-content"
                            id="panel3a-header"
                        >
                            <Typography className={classes.heading}>
                                Absents <span className={classes.number}>0</span>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            className={classes.accordionDetails}
                        >
                            <Typography>
                                No informations.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </>
            }
        </div>
    );
}

export default ClassRoster;