import { UserListItem } from "./userListItem";
import { ReadUserDto } from "@/app/data/user/dto/readUserDto";
import { THEME_COLOR_PRIMARY_SELECT_DIALOG } from "@/config";
import {
    Grid,
    Typography,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => ({
    selectUser: {
        fontWeight: theme.typography.fontWeightBold as number,
        textAlign: `center`,
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(5),
        color: THEME_COLOR_PRIMARY_SELECT_DIALOG,
        [theme.breakpoints.down(`md`)]: {
            paddingTop: theme.spacing(3),
            paddingBottom: theme.spacing(3),
            fontSize: `1.25rem`,
        },
    },
}));

interface Props {
    users?: ReadUserDto[];
    selectedUser?: ReadUserDto;
    onClick?: (user: ReadUserDto) => void;
}

export const UserList: React.FC<Props> = ({
    users, selectedUser, onClick,
}) => {
    const classes = useStyles();

    return (
        <>
            <Typography
                className={classes.selectUser}
                variant="h4"
            >
                <FormattedMessage
                    id="account_selectUser_whichUser"
                    defaultMessage={`Who's studying today?`}
                />
            </Typography>

            <Grid container>
                {users?.map((user) => (
                    <Grid
                        key={user.user_id}
                        item
                        xs={6}
                        sm={4}
                    >
                        <UserListItem
                            user={user}
                            isSelected={selectedUser && selectedUser.user_id === user.user_id}
                            onClick={onClick}
                        />
                    </Grid>
                ))
                }
            </Grid>
        </>
    );
};
