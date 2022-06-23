import { ConfirmSignOutDialog } from "../../dialogs/confirmSignOutDialog";
import AppBar,
{ AppBarStyle } from "@/app/components/layout/AppBar";
import { useAuthenticationContext } from "@/app/context-provider/authentication-context";
import {
    isShowOnBoardingState,
    shouldClearCookieState,
} from "@/app/model/appModel";
import ParentImage from "@/assets/img/select-type/parent-illustration.svg";
import StudentImage from "@/assets/img/select-type/student-illustration.svg";
import {
    BACKGROUND_PROCESS_GREY,
    TEXT_COLOR_CONSTRAST_DEFAULT,
    THEME_BACKGROUND_SELECT_DIALOG,
} from "@/config";
import { ButtonBase } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import React,
{ useState } from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";
import { useHistory } from "react-router-dom";
import { useSetRecoilState } from "recoil";

export enum SelectionTypes {
    STUDENT = `Student`,
    PARENT = `Parent`
}

const SELECTIONS = [
    {
        id: SelectionTypes.STUDENT,
        type: `userSelection.student`,
        image: StudentImage,
        route: `/`,
    },
    {
        id: SelectionTypes.PARENT,
        type: `userSelection.parent`,
        image: ParentImage,
        route: `/parent-dashboard`,
    },
];

const useStyles = makeStyles((theme) => ({
    wrapperSelectItem: {
        flexDirection: `column`,
        backgroundColor: TEXT_COLOR_CONSTRAST_DEFAULT,
        height: `30vh`,
        borderRadius: theme.spacing(1.5),
        marginTop: theme.spacing(1),
        [theme.breakpoints.up(`sm`)]: {
            margin: theme.spacing(0, 10, 2, 10),
            borderRadius: theme.spacing(2.5),
        },
    },
    selectionTitle: {
        fontWeight: theme.typography.fontWeightMedium as number,
        fontSize: `1.15rem`,
        [theme.breakpoints.up(`sm`)]: {
            fontSize: `2rem`,
        },
    },
    selectionButtons: {
        marginTop: theme.spacing(2),
        display: `flex`,
        flexDirection: `column`,
        padding: theme.spacing(0, 2),
        [theme.breakpoints.up(`sm`)]: {
            marginTop: theme.spacing(4),
        },
    },
    image: {
        width: `22vh`,
        height: `20vh`,
    },
    signOutButton: {
        borderRadius: theme.spacing(3),
        borderTopRightRadius: theme.spacing(1),
        color: TEXT_COLOR_CONSTRAST_DEFAULT,
        backgroundColor: BACKGROUND_PROCESS_GREY,
        "&:hover": {
            backgroundColor: BACKGROUND_PROCESS_GREY,
        },
        fontSize: `1.15rem`,
        margin: theme.spacing(`auto`, 2, 8, 2),
        height: theme.spacing(7),
        fontWeight: theme.typography.fontWeightBold as number,
        [theme.breakpoints.up(`sm`)]: {
            height: theme.spacing(9),
            fontSize: theme.spacing(3.5),
            marginLeft: theme.spacing(2.5),
            marginRight: theme.spacing(2.5),
        },
    },
    container: {
        backgroundColor: THEME_BACKGROUND_SELECT_DIALOG,
        display: `flex`,
        flexDirection: `column`,
    },
    flexCenter: {
        display: `flex`,
        justifyContent: `center`,
        alignItems: `center`,
    },
    fullWidthHeight: {
        width: `100%`,
        height: `100%`,
    },
}));

export function SelectTypePage () {
    const intl = useIntl();
    const classes = useStyles();
    const { actions } = useAuthenticationContext();
    const setShouldClearCookie = useSetRecoilState(shouldClearCookieState);
    const setShowOnBoarding = useSetRecoilState(isShowOnBoardingState);
    const [ openConfirmationPopup, setOpenConfirmationPopup ] = useState(false);
    const history = useHistory();

    return (
        <Box className={clsx(classes.container, classes.fullWidthHeight)}>
            <AppBar
                style={AppBarStyle.ROUNDED}
                title={intl.formatMessage({
                    id: `userSelection.title`,
                    defaultMessage: `Choose your role`,
                })}
            />
            <Box className={classes.selectionButtons}>
                {SELECTIONS.map((selection) => (
                    <ButtonBase
                        key={selection.id}
                        className={clsx(classes.wrapperSelectItem, classes.flexCenter)}
                        onClick={() => history.push(selection.route)}
                    >
                        <img
                            src={selection.image}
                            className={classes.image}
                            alt={`Icon ${selection.id}`}
                        />
                        <Typography className={classes.selectionTitle}>
                            <FormattedMessage id={selection.type} />
                        </Typography>
                    </ButtonBase>
                ))}
            </Box>
            <Button
                className={classes.signOutButton}
                onClick={() => setOpenConfirmationPopup(true)}
            >
                <FormattedMessage id="account_selectOrg_signOut" />
            </Button>
            <ConfirmSignOutDialog
                visible={openConfirmationPopup}
                closeLabel={intl.formatMessage({
                    id: `button_cancel`,
                })}
                confirmLabel={intl.formatMessage({
                    id: `account_selectOrg_signOut`,
                })}
                title={intl.formatMessage({
                    id: `hamburger.signOut.confirm`,
                })}
                onClose={() => setOpenConfirmationPopup(false)}
                onConfirm={() => {
                    setOpenConfirmationPopup(false);
                    actions?.signOut();
                    setShouldClearCookie(true);
                    setShowOnBoarding(true);
                }}
            />
        </Box>
    );
}
