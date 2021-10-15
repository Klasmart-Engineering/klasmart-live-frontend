import KidsloopLogo from "../../../assets/img/kidsloop_icon.svg";
import StyledIcon from "../../../components/styled/icon";
import { useUserInformation } from "../../context-provider/user-information-context";
import {
    dialogsState,
    errorState,
    homeFunStudyState,
    isProcessingRequestState,
    selectedOrganizationState,
    selectedUserState,
} from "../../model/appModel";
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
import { ArrowBackIos as ArrowBackIcon } from "@styled-icons/material/ArrowBackIos";
import { Close as CloseIcon } from "@styled-icons/material/Close";
import { Refresh as RefreshIcon } from "@styled-icons/material/Refresh";
import {
    OrganizationAvatar,
    UserAvatar,
} from "kidsloop-px";
import React,
{ useState } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 0,
            borderBottom: `1px solid ${theme.palette.divider}`,
        },
        safeArea: {
            paddingLeft: `env(safe-area-inset-left)`,
            paddingRight: `env(safe-area-inset-right)`,
            backgroundColor: theme.palette.background.paper,
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
        safeArea,
        centeredLogo,
    } = useStyles();
    const theme = useTheme();
    const [ error ] = useRecoilState(errorState);
    const [ dialogs ] = useRecoilState(dialogsState);
    const [ homeFunStudy ] = useRecoilState(homeFunStudyState);
    const { selectedUserProfile } = useUserInformation();

    const showCloseButton = selectedUserProfile !== undefined && (dialogs.isSelectOrganizationOpen || dialogs.isSelectUserOpen || homeFunStudy?.open);

    return (error.errorCode ? <></> :
        <div className={root}>
            <AppBar
                position="sticky"
                elevation={0}
                className={safeArea}
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
                                { isHomeRoute ? <OpenSelectOrgButton /> : showCloseButton ? <CloseSelectOrgOrUserButton /> : `` }
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
    const { selectedUserProfile } = useUserInformation();
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
                name={selectedUserProfile?.fullName ?? ``}
                size={`medium`} />
        </ButtonBase>
    );
}

function OpenSelectOrgButton () {
    const { selectOrganizationButton } = useStyles();
    const [ selectedOrganization ] = useRecoilState(selectedOrganizationState);
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

function GoBackButton () {
    const { iconButton } = useStyles();
    const history = useHistory();

    const [ canGoBack ] = useState<boolean>(true);

    return (
        <IconButton
            size="medium"
            className={iconButton}
            style={{
                visibility: canGoBack ? `visible` : `hidden`,
            }}
            onClick={() => { history.goBack(); }}
        >
            <StyledIcon
                icon={<ArrowBackIcon />}
                size="medium" />
        </IconButton >
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
