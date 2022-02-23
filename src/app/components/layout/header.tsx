import MenuDrawer from './menuDrawer';
import { useSelectedUserValue } from "@/app/data/user/atom";
import {
    dialogsState,
    errorState,
    useSetMenuOpen,
} from "@/app/model/appModel";
import KidsloopLogo from "@/assets/img/kidsloop_icon.svg";
import KidsloopTextLogo from "@/assets/img/kidsloop_logo.svg";
import StyledIcon from "@/components/styled/icon";
import AppBar from "@material-ui/core/AppBar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import {
    createStyles,
    makeStyles,
    Theme,
    useTheme,
} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import { Menu as MenuIcon } from "@styled-icons/boxicons-regular/Menu";
import { Close as CloseIcon } from "@styled-icons/material/Close";
import { UserAvatar } from "@kl-engineering/kidsloop-px";
import React from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 0,
            borderBottom: `1px solid ${theme.palette.divider}`,
        },
        iconButton: {
            backgroundColor: theme.palette.background.paper,
        },
        selectOrganizationButton: {
            borderRadius: 4,
        },
        selectUserButton: {
            borderRadius: `50%`,
        },
        centeredLogo:{
            position: `absolute`,
            textAlign: `center`,
            zIndex: -1,
            width: `100%`,
            left: `0`,
        },
    }));

export function Header ({ isHomeRoute, setKey }: { isHomeRoute?: boolean; setKey?: React.Dispatch<React.SetStateAction<string>> }) {
    const {
        root,
        centeredLogo,
    } = useStyles();
    const theme = useTheme();
    const [ error ] = useRecoilState(errorState);
    const [ dialogs ] = useRecoilState(dialogsState);

    const selectedUser = useSelectedUserValue();

    const showCloseButton = selectedUser && (dialogs.isSelectOrganizationOpen || dialogs.isSelectUserOpen);

    return (error.errorCode ? <></> :
        <div className={root}>
            <AppBar
                position="sticky"
                elevation={0}
            >
                <Toolbar style={{
                    padding: theme.spacing(0, 1),
                }}>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Grid
                            container
                            item
                            xs={12}
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            wrap="nowrap"
                        >
                            <Grid item>
                                { isHomeRoute ?
                                    <>
                                        <OpenMenuButton />
                                    </> : showCloseButton && <CloseSelectOrgOrUserButton />}
                            </Grid>
                            <Grid
                                item
                                className={centeredLogo}
                            >
                                <img
                                    alt="KidsLoop Logo"
                                    src={isHomeRoute ? KidsloopTextLogo : KidsloopLogo}
                                    height={32} />
                            </Grid>
                            <Grid item>
                                {isHomeRoute && (
                                    <OpenSelectUserButton />
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <MenuDrawer />
        </div>
    );
}

function OpenMenuButton () {
    const { iconButton } = useStyles();
    const setMenuOpen = useSetMenuOpen();
    return(
        <IconButton
            className={iconButton}
            onClick={() => setMenuOpen(true)}
        >
            <StyledIcon
                icon={<MenuIcon />}
                size="xlarge" />
        </IconButton>
    );
}

function CloseSelectOrgOrUserButton () {
    const { iconButton } = useStyles();

    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);

    return (
        <IconButton
            size="medium"
            className={iconButton}
            onClick={() => {
                if (dialogs.isSelectOrganizationOpen) {
                    setDialogs({
                        ...dialogs,
                        isSelectOrganizationOpen: false,
                    });
                } else if (dialogs.isSelectUserOpen) {
                    setDialogs({
                        ...dialogs,
                        isSelectUserOpen: false,
                    });
                }
            }}
        >
            <StyledIcon
                icon={<CloseIcon />}
                size="medium" />
        </IconButton>
    );
}

function OpenSelectUserButton () {
    const { selectUserButton } = useStyles();
    const selectedUser = useSelectedUserValue();
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);

    return (
        <ButtonBase
            className={selectUserButton}
            onClick={() => setDialogs({
                ...dialogs,
                isSelectUserOpen: true,
            })}
        >
            <UserAvatar
                name={`${selectedUser?.given_name} ${selectedUser?.family_name}`}
                size={`medium`} />
        </ButtonBase>
    );
}
