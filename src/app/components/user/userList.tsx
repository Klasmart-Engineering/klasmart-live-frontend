/* eslint-disable react/no-multi-comp */
import { UserListItem } from "./userListItem";
import { ReadUserDto } from "@/app/data/user/dto/readUserDto";
import {
    MAX_PROFILE_TO_BREAK_LIST,
    MAX_PROFILE_TO_DISPLAY_CENTER,
} from "@/config";
import { useWindowSize } from "@/utils/viewport";
import {
    Box,
    createStyles,
    makeStyles,
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

const useStyles = makeStyles((theme) => createStyles({
    list: {
        display: `flex`,
        flexDirection: `row`,
        flexWrap: `nowrap`,
        width: `100%`,
        padding: theme.spacing(0, 3.5),
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
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up(`md`));

    return (
        <>
            {isMdUp ? <UserTabletList {...props} /> : <UserMobileList {...props} />}
        </>
    );
};

function UserMobileList ({
    users, selectedUser, onClick,
}: Props) {
    const classes = useStyles();
    return(
        <Box
            className={clsx(classes.list, classes.enableHorizontalScroll, {
                [classes.contentCenter]: users.length <= MAX_PROFILE_TO_DISPLAY_CENTER,
            })}
        >
            {users.map((user: ReadUserDto) =>
                (
                    <UserListItem
                        key={user.user_id}
                        user={user}
                        isSelected={selectedUser?.user_id === user.user_id}
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
    const isSplitLists = users.length > MAX_PROFILE_TO_BREAK_LIST;
    const lengthFirstList: number = users.length === MAX_PROFILE_TO_BREAK_LIST + 1
        ? MAX_PROFILE_TO_BREAK_LIST : ceil(users.length / 2);

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
            <div
                ref={listRef}
                className={classes.list}
            >
                {users.slice(0, isSplitLists ? lengthFirstList : users.length)
                    .map((user: ReadUserDto) =>
                        (
                            <UserListItem
                                key={user.user_id}
                                user={user}
                                isSelected={selectedUser?.user_id === user.user_id}
                                onClick={onClick}
                            />
                        ))}
            </div>
            {isSplitLists && (
                <Box className={classes.list}>
                    {users.slice(lengthFirstList)
                        .map((user: ReadUserDto) =>
                            (
                                <UserListItem
                                    key={user.user_id}
                                    user={user}
                                    isSelected={selectedUser?.user_id === user.user_id}
                                    onClick={onClick}
                                />
                            ))}
                </Box>
            )}
        </Box>
    );
}
