import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { dialogsState } from "@/app/model/appModel";
import {
    THEME_BACKGROUND_SELECT_DIALOG,
    THEME_COLOR_PRIMARY_SELECT_DIALOG,
} from "@/config";
import {
    Dialog,
    DialogContent,
    Grid,
    makeStyles,
    TextField,
    Typography,
    useTheme,
} from "@material-ui/core";
import { vi } from "date-fns/locale";
import React,
{
    useEffect,
    useMemo,
    useState,
} from "react";
import { Calendar, DateRange } from "react-date-range";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme) => ({
    fullWidth: {
        width: `100%`,
    },
    content: {
        padding: theme.spacing(5, 2, 2),
        backgroundColor: THEME_BACKGROUND_SELECT_DIALOG,

        [theme.breakpoints.up(`sm`)]: {
            padding: theme.spacing(8, 4, 2),
        },
    },
    header: {
        fontWeight: theme.typography.fontWeightBold as number,
        color: THEME_COLOR_PRIMARY_SELECT_DIALOG,
        paddingBottom: theme.spacing(4),
        textAlign: `center`,
        lineHeight: 1.5,
    },
}));

interface Props {
    open: boolean;
    onClose: () => void;
}

export function CalendarDialog (props: Props) {
    const {
        open,
        onClose,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const theme = useTheme();
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);

    const [ selectedDate, handleDateChange ] = useState(new Date());

    const handleBackClick = () => setDialogs({
        ...dialogs,
        isSelectOrganizationOpen: false,
    });

    const toggle = () => onClose();

    const handleSelect = (ranges: any) => {
        console.log(ranges);
    };
    const [ state, setState ] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: `selection`,
    }); // remo
    return (
        <Dialog
            fullScreen
            aria-labelledby="select-org-dialog"
            open={open}
            onClose={handleBackClick}
        >
            <DialogContent className={classes.content}>
                <Grid
                    container
                    alignItems="center"
                    justifyContent="flex-start"
                    direction="column"
                >
                    <Typography>
                        Helllo
                    </Typography>
                    <Calendar
                        locale={vi}
                        date={new Date()}
                        onChange={handleSelect}
                    />
                    <DateRange
                        moveRangeOnFirstSelection={false}
                        ranges={[ state ]}
                        onChange={(item) => console.log(item)}
                    />
                </Grid>
            </DialogContent>
        </Dialog>
    );
}
