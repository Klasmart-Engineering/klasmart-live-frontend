/* eslint-disable react/no-multi-comp */
import { UserListItem } from "./userListItem";
import { ReadUserDto } from "@/app/data/user/dto/readUserDto";
import SwitchIcon from "@/assets/img/profile-org-selection/switch_profile.svg";
import { THEME_COLOR_PRIMARY_SELECT_DIALOG } from "@/config";
import { useWindowSize } from "@/utils/viewport";
import {
    Box,
    createStyles,
    makeStyles,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import clsx from "clsx";
import { ceil } from "lodash";
import React,
{
    useEffect,
    useRef,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    titleWrapper: {
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        flexDirection: `row`,
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(5),
        [theme.breakpoints.down(`sm`)]: {
            paddingTop: theme.spacing(1.5),
            paddingBottom: theme.spacing(3),
        },
    },
    title: {
        fontWeight: theme.typography.fontWeightBold as number,
        textAlign: `center`,
        color: THEME_COLOR_PRIMARY_SELECT_DIALOG,
        [theme.breakpoints.down(`sm`)]: {
            fontSize: `1.5rem`,
        },
    },
    icon: {
        width: 30,
        marginRight: theme.spacing(2),
        [theme.breakpoints.down(`sm`)]: {
            width: 25,
        },
    },
    list: {
        display: `flex`,
        flexDirection: `row`,
        flexWrap: `nowrap`,
        width: `100%`,
        "& > div:last-child": {
            paddingRight: theme.spacing(3.5),
        },
    },
    fullWidth: {
        width: `100%`,
    },
    enableHorizontalScroll: {
        overflowX: `scroll`,
    },
    contentCenter: {
        justifyContent: `center`,
    },
    tabletRoot: {
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        flexDirection: `column`,
        flexWrap: `nowrap`,
        width: `fit-content`,
    },
    tabletRootSplitLists: {
        overflowX: `scroll`,
    },
}));

interface Props {
    users: ReadUserDto[];
    selectedUser?: ReadUserDto;
    onClick?: (user: ReadUserDto) => void;
}

export const UserList: React.FC<Props> = (props: Props) => {
    const { selectedUser } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up(`md`));

    return (
        <>
            <Box className={classes.titleWrapper}>
                {selectedUser &&
                    <img
                        alt="switch icon"
                        src={SwitchIcon}
                        className={classes.icon}
                    />
                }
                <Typography
                    className={classes.title}
                    variant="h4"
                >
                    <FormattedMessage
                        id={selectedUser ? `profileSelection.switch` : `account_selectUser_whichUser`}
                        defaultMessage="Switch profile"
                    />
                </Typography>
            </Box>
            {isMdUp ? <UserTabletList {...props} /> : <UserMobileList {...props} />}
        </>
    );
};

function UserMobileList ({
    users, selectedUser, onClick,
}: Props) {
    const classes = useStyles();
    const TOTAL_AVATAR_REQUIRE_TO_CENTER = 5;
    return(
        <Box
            className={clsx(classes.list, classes.enableHorizontalScroll, {
                [classes.contentCenter]: users.length <= TOTAL_AVATAR_REQUIRE_TO_CENTER,
            })}
        >
            {users.map((user: ReadUserDto) =>
                (
                    <UserListItem
                        key={user.user_id}
                        user={user}
                        isSelected={selectedUser && selectedUser.user_id === user.user_id}
                        onClick={onClick}
                    />
                ))}
        </Box>
    );
}

function UserTabletList ({
    users, selectedUser, onClick,
}: Props) {
    const listRef = useRef<HTMLDivElement>(null);
    const classes = useStyles();
    const { width } = useWindowSize();
    const [ isUseFullWidth, setIsUseFullWidth ] = useState<boolean>(true);
    const isSplitLists = users.length > 3;
    const lengthFirstList: number = users.length === 4 ? ceil(users.length / 2) + 1 : ceil(users.length / 2);

    useEffect(() => {
        if(!listRef?.current?.offsetWidth) return;
        setIsUseFullWidth(listRef?.current?.offsetWidth > width);
    }, [ listRef, width ]);

    return(
        <Box className={clsx(classes.tabletRoot, {
            [classes.tabletRootSplitLists]: isSplitLists,
            [classes.fullWidth]: isUseFullWidth,
        })}
        >
            <Box
                {...{
                    ref: listRef,
                }}
                className={classes.list}
            >
                {users.slice(0, isSplitLists ? lengthFirstList : users.length).map((user: ReadUserDto) =>
                    (
                        <UserListItem
                            key={user.user_id}
                            user={user}
                            isSelected={selectedUser && selectedUser.user_id === user.user_id}
                            onClick={onClick}
                        />
                    ))}
            </Box>
            {isSplitLists && (
                <Box className={classes.list}>
                    {users.slice(lengthFirstList).map((user: ReadUserDto) =>
                        (
                            <UserListItem
                                key={user.user_id}
                                user={user}
                                isSelected={selectedUser && selectedUser.user_id === user.user_id}
                                onClick={onClick}
                            />
                        ))}
                </Box>
            )}
        </Box>
    );
}
