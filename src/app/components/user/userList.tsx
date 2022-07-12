/* eslint-disable react/no-multi-comp */
import { UserListItem } from "./userListItem";
import { ReadUserDto } from "@/app/data/user/dto/readUserDto";
import { MAX_PROFILE_TO_BREAK_LIST } from "@/config";
import { useWindowSize } from "@/utils/viewport";
import {
    Box,
    createStyles,
    makeStyles,
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
        justifyContent: `center`,
        padding: theme.spacing(0, 3.5),
    },
    listSplit: {
        justifyContent: `flex-start`,
        paddingLeft: theme.spacing(10),
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
        alignItems: `center`,
        justifyContent: `center`,
        flexDirection: `column`,
        flexWrap: `nowrap`,
        width: `100%`,
    },
    tabletRootSplitLists: {
        overflowX: `scroll`,
        '&::-webkit-scrollbar': {
            display: `none`,
        },
    },
}));

interface Props {
    users: ReadUserDto[];
    selectedUser?: ReadUserDto;
    onClick?: (user: ReadUserDto) => void;
}

export const UserList: React.FC<Props> = ({
    users, selectedUser, onClick,
}: Props) => {
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
                className={clsx(classes.list, {
                    [classes.listSplit]: isSplitLists,
                })}
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
                <Box className={clsx(classes.list, {
                    [classes.listSplit]: isSplitLists,
                })}
                >
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
};
