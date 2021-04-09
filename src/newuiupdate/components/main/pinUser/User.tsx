import React, { useState } from "react";

import { makeStyles, Box, Grid, Theme, Typography } from "@material-ui/core";

import clsx from "clsx";

import { UserAvatar } from "kidsloop-px";



import { Pin as PinIcon } from "@styled-icons/entypo/Pin";

import { useRecoilState } from "recoil";
import { pinnedUserState } from "../../../states/layoutAtoms";

import amber from "@material-ui/core/colors/amber";

const useStyles = makeStyles((theme: Theme) => ({
    root:{
        cursor: 'pointer',
        borderRadius: 12,
        flexGrow: 1,
        marginTop: 2,
        marginBottom: 2,
        "&:hover":{
            backgroundColor: '#fff',
            "& $iconButton":{
                visibility: 'visible',
            }
        },
    },
    active:{
        
    },
    avatar:{
        marginRight: 5
    },
    pinIcon:{
        color: amber[500]
    }
}));

export interface UserProps {
    id: number,
    name: string,
}

function User(props: UserProps) {
    const {id, name} = props;
	const classes = useStyles();

    const [pinnedUser, setPinnedUser] = useRecoilState(pinnedUserState);

	return (
		<Grid container alignItems="center" spacing={2} className={clsx(classes.root, {[classes.active] : id === pinnedUser})} onClick={() => id === pinnedUser ? setPinnedUser(undefined) : setPinnedUser(id)}>
            <Grid item>
                <UserAvatar
                    name={name}
                    className={classes.avatar}
                    size="medium"
                />
            </Grid>
            <Grid item xs>
                <Typography>{name}</Typography>
            </Grid>

            {id === pinnedUser && 
                <Grid item className={classes.pinIcon}>
                    <PinIcon size="1.5rem"/>
                </Grid>
            }
        </Grid>
	);
}

export default User;
