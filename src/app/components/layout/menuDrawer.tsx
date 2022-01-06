import { useAuthenticationContext } from "@/app/context-provider/authentication-context";
import { useSelectedOrganizationValue } from "@/app/data/user/atom";
import { ParentalGate } from "@/app/dialogs/parentalGate";
import {
    dialogsState,
    menuOpenState,
} from "@/app/model/appModel";
import { useDisplayPrivacyPolicy } from "@/app/utils/privacyPolicyUtils";
import StyledIcon from "@/components/styled/icon";
import { TEXT_COLOR_MENU_DRAWER } from "@/config";
import { useWindowSize } from "@/utils/viewport";
import {
    Button,
    createStyles,
    Dialog,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    SwipeableDrawer,
    Theme,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { Close as CloseIcon } from "@styled-icons/material/Close";
import { Settings as SettingsIcon } from "@styled-icons/material/Settings";
import { PrivacyTip as PolicyIcon } from "@styled-icons/material-outlined/PrivacyTip";
import clsx from "clsx";
import { OrganizationAvatar } from "kidsloop-px";
import React,
{
    useEffect,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";

const config = require(`@/../package.json`);

enum MenuDrawerItem {
    ORGANIZATION,
    SETTINGS,
    POLICY
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        drawerItem: {
            padding: theme.spacing(2),
        },
        closeIconWrapper:{
            height: 56,
            paddingLeft: theme.spacing(1),
            [theme.breakpoints.up(`sm`)]: {
                height: 64,
            },
        },
        drawerSignOutButton: {
            height: 82,
        },
        signOutButton: {
            marginTop: 5,
            background: theme.palette.background.paper,
            height: 45,
            color: theme.palette.background.paper,
            "&:hover": {
                background: theme.palette.background.paper,
            },
        },
        iconButton:{
            backgroundColor: theme.palette.background.paper,
        },
        versionText:{
            fontWeight: theme.typography.fontWeightBold as number,
        },
        fullWidth: {
            width: `100%`,
        },
        marginVertical: {
            margin: `16px 0px 4px`,
        },
    }));

export default function MenuDrawer () {
    const classes = useStyles();
    const { width } = useWindowSize();
    const theme = useTheme();
    const { actions } = useAuthenticationContext();
    const history = useHistory();
    const isSmUp = useMediaQuery(theme.breakpoints.up(`sm`));
    const selectedOrganization = useSelectedOrganizationValue();
    const displayPrivacyPolicy = useDisplayPrivacyPolicy();
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const [ isMenuOpen, setMenuOpen ] = useRecoilState(menuOpenState);
    const [ parentalLock, setParentalLock ] = useState<boolean>(false);

    const menuArray = [
        {
            id: MenuDrawerItem.ORGANIZATION,
            text: `hamburger.organization`,
            icon: <OrganizationAvatar
                name={selectedOrganization?.organization_name ?? ``}
                size={`small`} />,
        },
        {
            id: MenuDrawerItem.SETTINGS,
            text: `title_settings`,
            icon: <StyledIcon
                icon={<SettingsIcon />}
                size="large" />,
        },
        {
            id: MenuDrawerItem.POLICY,
            text: `account_selectOrg_privacyPolicy`,
            icon: <StyledIcon
                icon={<PolicyIcon />}
                size="large" />,
        },
    ];

    const handleMenuItemClick = (menuDrawerItem: MenuDrawerItem) => {
        setMenuOpen(false);

        switch (menuDrawerItem) {
        case MenuDrawerItem.ORGANIZATION:
            setDialogs({
                ...dialogs,
                isSelectOrganizationOpen: true,
            });
            break;
        case MenuDrawerItem.SETTINGS:
            history.push(`/settings`);
            break;
        case MenuDrawerItem.POLICY:
            setParentalLock(true);
            break;
        default:
            break;
        }
    };

    useEffect(() => {
        setParentalLock(false);
    }, []);

    if (parentalLock) {
        return <Dialog
            fullScreen
            open={parentalLock}>
            <ParentalGate
                setClosedDialog={() => setParentalLock(false)}
                onCompleted={() => { displayPrivacyPolicy(); setParentalLock(false); }}
            />
        </Dialog>;
    }

    return (
        <SwipeableDrawer
            anchor="left"
            open={isMenuOpen}
            onClose={() => setMenuOpen(false)}
            onOpen={() => setMenuOpen(true)}
        >
            <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="space-between"
                style={{
                    width: isSmUp ? 400 : width*0.7,
                    height: `100%`,
                }}
                onClick={() => setMenuOpen(false)}
                onKeyDown={() => setMenuOpen(false)}
            >
                <Grid
                    item
                    className={classes.fullWidth}>
                    <Grid
                        item
                        container
                        direction="column"
                        alignItems="flex-start"
                        justifyContent="flex-end"
                        className={classes.closeIconWrapper}>
                        <IconButton
                            className={classes.iconButton}
                            onClick={() => setMenuOpen(false)}
                        >
                            <StyledIcon
                                icon={<CloseIcon />}
                                size="medium" />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <Divider />
                    </Grid>
                    <Grid item>
                        <List>
                            {menuArray.map((item) => (
                                <>
                                    <ListItem
                                        key={item.id}
                                        button
                                        className={classes.drawerItem}
                                        onClick={() => handleMenuItemClick(item.id)}>
                                        <ListItemIcon>{item.icon}</ListItemIcon>
                                        <ListItemText>
                                            <FormattedMessage id={item.text} />
                                        </ListItemText>
                                    </ListItem>
                                    <Divider />
                                </>
                            ))}
                        </List>
                    </Grid>
                </Grid>
                <Grid
                    item
                    container
                    direction="column"
                    justifyContent="center"
                    className={classes.fullWidth}>
                    <Grid item>
                        <Typography
                            align="center"
                            className={clsx(classes.versionText)}>
                            <FormattedMessage
                                id="settings.version"
                                values={{
                                    version: config.version,
                                }} />
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Divider className={classes.marginVertical} />
                    </Grid>
                    <Grid
                        item
                        container
                        direction="column"
                        justifyContent="flex-start"
                        className={classes.drawerSignOutButton}>
                        <Button
                            fullWidth
                            variant="text"
                            size="large"
                            className={classes.signOutButton}
                            onClick={() => actions?.signOut()}
                        >
                            <Typography
                                color="primary"
                                align="center">
                                <FormattedMessage id="account_selectOrg_signOut" />
                            </Typography>
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </SwipeableDrawer>
    );
}
