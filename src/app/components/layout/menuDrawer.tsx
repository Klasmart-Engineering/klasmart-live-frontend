import DialogParentalLock from "@/app/components/ParentalLock";
import { useAuthenticationContext } from "@/app/context-provider/authentication-context";
import { useSelectedOrganizationValue } from "@/app/data/user/atom";
import {
    dialogsState,
    isShowOnBoardingState,
    menuOpenState,
    shouldClearCookieState,
    urlFilePathState,
} from "@/app/model/appModel";
import { useOpenDeepLink } from "@/app/utils/openLinkUtils";
import SettingsIcon from '@/assets/img/menu-drawer/icon_settings.svg';
import {
    TEXT_COLOR_SIGN_OUT,
    TEXT_COLOR_VERSION_APP,
    THEME_BACKGROUND_SIGN_OUT_BUTTON,
    THEME_COLOR_ORG_MENU_DRAWER,
} from "@/config";
import { useWindowSize } from "@/utils/viewport";
import { OrganizationAvatar } from "@kl-engineering/kidsloop-px";
import {
    Button,
    createStyles,
    Divider,
    Grid,
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
import { KeyboardArrowRight as ArrowRight } from "@styled-icons/material-rounded/KeyboardArrowRight";
import clsx from "clsx";
import React,
{ useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";
import {
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from "recoil";

enum MenuDrawerItem {
    ORGANIZATION,
    PARENTS_DASHBOARD,
    SETTINGS,
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        drawerItem: {
            padding: theme.spacing(2, 3),
            color: theme.palette.grey[900],
        },
        orgContainer:{
            padding: theme.spacing(11, 2.5, 2),
            background: THEME_COLOR_ORG_MENU_DRAWER,
            marginBottom: theme.spacing(2),
        },
        orgAvatar: {
            width: 60,
            height: 60,
            fontSize: `1rem`,
            borderRadius: theme.spacing(1.5),
        },
        orgName: {
            color: theme.palette.common.white,
            display: `-webkit-box`,
            overflow: `hidden`,
            WebkitBoxOrient: `vertical`,
            WebkitLineClamp: 1,
            wordBreak: `break-all`,
        },
        signOutButton: {
            background: THEME_BACKGROUND_SIGN_OUT_BUTTON,
            color: TEXT_COLOR_SIGN_OUT,
            height: 55,
            fontSize: `0.8rem`,
            lineHeight: 1.334,
            textAlign: `center`,
        },
        iconButton:{
            backgroundColor: theme.palette.background.paper,
        },
        version:{
            color: TEXT_COLOR_VERSION_APP,
            marginBottom: theme.spacing(2),
        },
        fullWidth: {
            width: `100%`,
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
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const [ isMenuOpen, setMenuOpen ] = useRecoilState(menuOpenState);
    const setShouldClearCookie = useSetRecoilState(shouldClearCookieState);
    const setShowOnBoarding = useSetRecoilState(isShowOnBoardingState);
    const { openDeepLink } = useOpenDeepLink();
    const urlFilePath = useRecoilValue(urlFilePathState);

    const menuArray = [
        // {
        //     id: MenuDrawerItem.PARENTS_DASHBOARD,
        //     text: `hamburger.parentsDashboard`,
        //     icon: <img
        //         src={ParentsDashboardIcon}
        //         alt=""
        //     />,
        // },
        {
            id: MenuDrawerItem.SETTINGS,
            text: `title_settings`,
            icon: <img
                src={SettingsIcon}
                alt=""
            />,
        },
    ];

    useEffect(() => {
        setParentalLock(false);
    }, []);

    const setParentalLock = (open: boolean) => {
        setDialogs({
            ...dialogs,
            isParentalLockOpen: open,
        });
    };

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
            setParentalLock(true);
            break;

        case MenuDrawerItem.PARENTS_DASHBOARD:
            setParentalLock(true);
            break;
        default:
            break;
        }
    };

    if (dialogs.isParentalLockOpen) {
        return (
            <DialogParentalLock
                onCompleted={() => {
                    if (urlFilePath) {
                        openDeepLink();
                    } else {
                        history.push(`/settings`);
                    }
                    setParentalLock(false);
                }}
            />
        );
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
                    className={classes.fullWidth}
                >
                    <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                        className={classes.orgContainer}
                        onClick={() => handleMenuItemClick(MenuDrawerItem.ORGANIZATION)}
                    >
                        <Grid
                            item
                            xs={isSmUp ? 3 : 4}
                        >
                            <OrganizationAvatar
                                name={selectedOrganization?.organization_name ?? ``}
                                size={`medium`}
                                className={classes.orgAvatar}
                            />
                        </Grid>
                        <Grid
                            item
                            xs
                        >
                            <Typography
                                variant="h6"
                                className={classes.orgName}
                            >
                                {selectedOrganization?.organization_name ?? ``}
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={1}
                        >
                            <ArrowRight
                                color={theme.palette.common.white}
                                size={30}
                            />
                        </Grid>
                    </Grid>
                    <Grid item>
                        <List disablePadding>
                            {menuArray.map((item) => (
                                <ListItem
                                    key={item.id}
                                    button
                                    className={classes.drawerItem}
                                    onClick={() => handleMenuItemClick(item.id)}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText>
                                        <FormattedMessage id={item.text} />
                                    </ListItemText>
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    className={classes.fullWidth}
                >
                    <Grid item>
                        <Typography
                            align="center"
                            className={clsx(classes.version)}
                        >
                            <FormattedMessage
                                id="settings.version"
                                values={{
                                    version: process.env.VERSION,
                                }}
                            />
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Divider />
                    </Grid>
                    <Grid item>
                        <Button
                            fullWidth
                            variant="text"
                            size="large"
                            className={classes.signOutButton}
                            onClick={() => {
                                actions?.signOut();
                                setShouldClearCookie(true);
                                setShowOnBoarding(true);
                            }}
                        >
                            <FormattedMessage id="account_selectOrg_signOut" />
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </SwipeableDrawer>
    );
}
