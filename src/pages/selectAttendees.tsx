import AttendeeCard from '@/components/attendeeCard/AttendeeCard';
import Loading from '@/components/loading';
import {
    TEXT_COLOR_SECONDARY_DEFAULT,
    THEME_COLOR_GREY_200,
    THEME_COLOR_PRIMARY_DEFAULT,
} from '@/config';
import { useSetClassAttendeesMutation } from '@/data/live/mutations/useSetClassAttendeesMutation';
import { useHttpEndpoint } from "@/providers/region-select-context";
import { useSessionContext } from "@/providers/session-context";
import {
    selectedAttendeesState,
    showSelectAttendeesState,
} from '@/store/layoutAtoms';
import { AttendeeType } from '@/types/attendee';
import {
    getAttendeesFullNames,
    getClassAttendeesIds,
} from "@/utils/utils";
import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    Grid,
    makeStyles,
    Theme,
    Typography,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import clsx from 'clsx';
import React,
{
    useEffect,
    useState,
} from 'react';
import { FormattedMessage } from "react-intl";
import {
    useRecoilState,
    useSetRecoilState,
} from 'recoil';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: THEME_COLOR_GREY_200,
        color: THEME_COLOR_PRIMARY_DEFAULT,
    },
    title: {
        fontWeight: theme.typography.fontWeightBold as number,
    },
    cardGrid: {
        overflowY: `auto`,
        padding: theme.spacing(0, 4, 4),
        "&::-webkit-scrollbar": {
            '-webkit-appearance': `none`,
            width: theme.spacing(1.25),
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: THEME_COLOR_PRIMARY_DEFAULT,
            borderRadius: theme.spacing(1.25),
        },
    },
    button: {
        width: 200,
        borderRadius: theme.spacing(2, 1, 2, 2),
    },
    checkbox: {
        "&.Mui-checked": {
            color: THEME_COLOR_PRIMARY_DEFAULT,
        },
    },
    fullHeight: {
        height: `100vh`,
    },
    textRoot: {
        color: TEXT_COLOR_SECONDARY_DEFAULT,
        marginRight: theme.spacing(3),
    },
    textSelected: {
        color: THEME_COLOR_PRIMARY_DEFAULT,
    },
    cardHost: {
        pointerEvents: `none`,
        cursor: `default`,
    },
}));

export function ClassSelectAttendees () {
    const classes = useStyles();

    const [ allAttendees, setAllAttendees ] = useState<AttendeeType[]>([]);
    const [ loading, setLoading ] = useState(true);
    const [ isSelectAllChecked, setIsSelectAllChecked ] = useState(true);
    const {
        scheduleId,
        roomId,
        user_id,
    } = useSessionContext();
    const [ selectedAttendees, setSelectedAttendees ] = useRecoilState(selectedAttendeesState);
    const setShowSelectAttendees = useSetRecoilState(showSelectAttendeesState);
    const cmsEndpoint = useHttpEndpoint(`cms`);
    const endpointAttendee = useHttpEndpoint(`user`);
    const [ setClassAttendeesMutation ] = useSetClassAttendeesMutation();

    const handleConfirmButton = () => {
        const attendeesIds = selectedAttendees.map(attendee => attendee.id);

        setClassAttendeesMutation({
            variables: {
                roomId,
                userIds: attendeesIds,
            },
        });
        setShowSelectAttendees(false);
    };

    const handleSelectAll = () => {
        if(!isSelectAllChecked) {
            setSelectedAttendees([ ...allAttendees ]);
            setIsSelectAllChecked(true);
        } else {
            setIsSelectAllChecked(false);
            const hostAttendee = allAttendees.find(attendee => attendee.id === user_id);
            setSelectedAttendees(hostAttendee ? [ hostAttendee ] : []);
        }
    };

    const handleAttendeeCardSelect = (attendee: AttendeeType) => {
        if (attendee.id === user_id) return;
        const isSelected = selectedAttendees.find((student) => student.id === attendee.id);
        isSelected ?
            setSelectedAttendees(selectedAttendees.filter(student => student.id !== attendee.id))
            : setSelectedAttendees(prevState => [ ...prevState, attendee ]);
    };

    const getClassAttendees = async () => {
        setLoading(true);
        const relationObject = await getClassAttendeesIds(scheduleId, cmsEndpoint);

        const attendeeIdsAndType: Omit<AttendeeType, "name">[] = await Promise.all([
            ...Array.from(new Set([ ...relationObject.class_roster_teacher_ids, ...relationObject.participant_teacher_ids ])).map((id: string) => {
                const teacherAttendee: Omit<AttendeeType, `name`> = {
                    id,
                    type: `Teacher`,
                };
                return teacherAttendee;
            }),
            ...Array.from(new Set([ ...relationObject.class_roster_student_ids, ...relationObject.participant_student_ids ])).map((id: string) => {
                const studentAttendee: Omit<AttendeeType, `name`> = {
                    id,
                    type: `Student`,
                };
                return studentAttendee;
            }),
        ]);
        const userIds = attendeeIdsAndType.map(attendeeIdAndType => attendeeIdAndType.id);
        const attendeeNames = await getAttendeesFullNames(userIds, endpointAttendee);

        const attendees: AttendeeType[] = attendeeIdsAndType.map((attendeeIdAndType) => {
            const matchingUser = attendeeNames.find((node: any) => node.node.id === attendeeIdAndType.id);

            return {
                ...attendeeIdAndType,
                name: `${matchingUser?.node.givenName} ${matchingUser?.node.familyName}`,
            };
        });

        setAllAttendees(attendees.sort((a, b) => b.type.localeCompare(a.type) || a.name.localeCompare(b.name)).sort(a => a.id === user_id ? -1 : 1));
        setSelectedAttendees(selectedAttendees.length ? selectedAttendees : attendees);
        setLoading(false);
    };

    useEffect(() => {
        getClassAttendees();
    }, []);

    useEffect(() => {
        setIsSelectAllChecked(selectedAttendees.length === allAttendees.length);
    }, [ selectedAttendees, allAttendees ]);

    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));

    if(loading){
        return <Loading messageId="loading" />;
    }

    return (
        <Box className={classes.root}>
            <Container>
                <Grid
                    container
                    direction="column"
                    className={classes.fullHeight}
                >
                    <Grid item>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mt={6}
                            mb={4}
                            px={4}
                            flexDirection={
                                isSmDown ? `column` : `row`
                            }
                        >
                            <Typography
                                variant="h5"
                                component="h2"
                                className={classes.title}
                            ><FormattedMessage id="class.attendance.title" />
                            </Typography>
                            <Box
                                display="flex"
                                alignItems="center"
                                mt={isSmDown ? 3 : 0}
                            >

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isSelectAllChecked}
                                            className={classes.checkbox}
                                            onChange={handleSelectAll}
                                        />
                                    }
                                    label={<FormattedMessage id="class.attendance.selectAll" />}
                                    className={clsx(classes.textRoot, isSelectAllChecked && classes.textSelected)}
                                />
                                <Button
                                    disabled={Boolean(!selectedAttendees.length)}
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    className={classes.button}
                                    onClick={handleConfirmButton}
                                ><FormattedMessage id="class.attendance.confirm" />
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid
                        item
                        xs
                        className={classes.cardGrid}
                    >
                        <Grid
                            container
                            spacing={4}
                        >
                            {allAttendees.map((attendee) =>
                                (
                                    <Grid
                                        key={attendee.id}
                                        item
                                        xs={6}
                                        sm={3}
                                        lg={2}
                                    >
                                        <AttendeeCard
                                            name={attendee.name}
                                            type={attendee.type}
                                            className={attendee.id === user_id ? classes.cardHost : ``}
                                            selected={Boolean(selectedAttendees.find((selectedAttendee) => selectedAttendee.id === attendee.id))}
                                            onClick={() => handleAttendeeCardSelect(attendee)}
                                        />
                                    </Grid>
                                ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
