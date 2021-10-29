import KidsloopLogo from "../../../assets/img/kidsloop_icon.svg";
import StyledIcon from "../../../components/styled/icon";
import {
    dialogsState,
    errorState,
    homeFunStudyState,
    isProcessingRequestState,
} from "../../model/appModel";
import {
    useSelectedOrganizationValue,
    useSelectedUserValue,
} from "@/app/data/user/atom";
import AppBar from "@material-ui/core/AppBar";
import ButtonBase from "@material-ui/core/ButtonBase";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import {
    createStyles,
    makeStyles,
    Theme,
    useTheme,
} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import { Close as CloseIcon } from "@styled-icons/material/Close";
import { Refresh as RefreshIcon } from "@styled-icons/material/Refresh";
import {
    OrganizationAvatar,
    UserAvatar,
} from "kidsloop-px";
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
    const [ homeFunStudy ] = useRecoilState(homeFunStudyState);
    const selectedUser = useSelectedUserValue();

    const showCloseButton = selectedUser && (dialogs.isSelectOrganizationOpen || dialogs.isSelectUserOpen || homeFunStudy?.open);

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
                            <Grid
                                item
                                style={{
                                    flexGrow: 0,
                                }}>
                                { isHomeRoute ? <OpenSelectOrgButton /> : showCloseButton && <CloseSelectOrgOrUserButton /> }
                            </Grid>
                            <Grid
                                item
                                className={centeredLogo}
                            >
                                <img
                                    alt="KidsLoop Logo"
                                    src={KidsloopLogo}
                                    height={32} />
                            </Grid>
                            <Grid
                                item
                                style={{
                                    flexGrow: 0,
                                }}>
                                { isHomeRoute &&
                                    <>
                                        <MenuButton setKey={setKey} />
                                        <OpenSelectUserButton />
                                    </>
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </div>
    );
}

function CloseSelectOrgOrUserButton () {
    const { iconButton } = useStyles();

    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const [ homeFunStudy, setHomeFunStudy ] = useRecoilState(homeFunStudyState);

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
                } else if(homeFunStudy?.open){
                    setHomeFunStudy({
                        ...homeFunStudy,
                        open: false,
                        studyId: undefined,
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

function OpenSelectOrgButton () {
    const { selectOrganizationButton } = useStyles();
    const selectedOrganization = useSelectedOrganizationValue();
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);

    return (
        <ButtonBase
            className={selectOrganizationButton}
            onClick={() => setDialogs({
                ...dialogs,
                isSelectOrganizationOpen: true,
            })}
        >
            <OrganizationAvatar
                name={selectedOrganization?.organization_name ?? ``}
                size={`medium`} />
        </ButtonBase>
    );
}

// TODO (Isu): Will be changed to <RefreshButton /> that force Schedule component to rerender
function MenuButton ({ setKey }: { setKey?: React.Dispatch<React.SetStateAction<string>> }) {
    const { iconButton } = useStyles();
    const [ dialogs ] = useRecoilState(dialogsState);
    const [ isProcessingRequest ] = useRecoilState(isProcessingRequestState);

    return (
        <IconButton
            size="medium"
            className={iconButton}
            style={{
                visibility: dialogs.isSelectOrganizationOpen ? `hidden` : `visible`,
            }}
            onClick={() => setKey && setKey(Math.random().toString(36))}
        >
            <StyledIcon
                icon={isProcessingRequest ? <CircularProgress size={16} /> : <RefreshIcon />}
                size="medium" />
        </IconButton>
    );
}
