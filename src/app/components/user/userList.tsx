import { UserListItem } from "./userListItem";
import { ReadUserDto } from "@/app/data/user/dto/readUserDto";
import { List } from "@material-ui/core";
import React from "react";

interface Props {
    users?: ReadUserDto[];
    selectedUser?: ReadUserDto;
    onClick?: (user: ReadUserDto) => void;
}

export const UserList: React.FC<Props> = ({
    users, selectedUser, onClick,
}) => {
    return (
        <List>
            {users?.map((user) =>
                <UserListItem
                    key={user.user_id}
                    user={user}
                    isSelected={selectedUser && selectedUser.user_id === user.user_id}
                    onClick={onClick}
                />)
            }
        </List>
    );
};
