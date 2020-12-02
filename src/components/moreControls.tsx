import React, { useState } from "react";
import { Theme, createStyles, makeStyles, withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import List from "@material-ui/core/List";
import ListSubheader from '@material-ui/core/ListSubheader';

import { MoreVert as MoreIcon } from "@styled-icons/material/MoreVert"

import StyledIcon from "./styled/icon";
import TrophyControls from "./trophies/trophyControls"
import { Session } from "../pages/room/room";
import PermissionControls from "../whiteboard/components/WBPermissionControls";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        moreBtn: {
            position: "absolute",
            bottom: theme.spacing(2),
            right: theme.spacing(2),
            [theme.breakpoints.down("sm")]: {
                bottom: theme.spacing(0),
                right: theme.spacing(0),
            },
        },
        icon: {
            "&:hover": {
                color: "white"
            }
        },
        trophiesMenuItem: {
            "&:hover": {
                backgroundColor: 'transparent',
            },
        }
    })
);

const StyledMoreMenu = withStyles({
    paper: {
        width: 250,
        border: "1px solid lightgrey",
    },
})((props: MenuProps) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: -200,
            horizontal: "left",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "left",
        }}
        {...props}
    />
));

export default function MoreControls({ session, forOverlay }: {
    session: Session,
    forOverlay?: boolean,
}) {
    const { moreBtn, icon, trophiesMenuItem } = useStyles();

    const [moreEl, setMoreEl] = useState<null | HTMLElement>(null);
    const handleMoreOpen = (event: React.SyntheticEvent<HTMLAnchorElement>) => { setMoreEl(event.currentTarget); };
    const handleMoreClose = () => { setMoreEl(null); };

    return (<>
        <IconButton
            component="a"
            aria-label="more button"
            aria-controls="more-controls-menu"
            aria-haspopup="true"
            size="small"
            className={forOverlay ? moreBtn : undefined}
            onClick={handleMoreOpen}
            onPointerEnter={handleMoreOpen}
        >
            <StyledIcon
                icon={<MoreIcon className={forOverlay ? icon : undefined} />}
                size="small"
                color={forOverlay ? "white" : "#0E78D5"}
            />
        </IconButton>
        <StyledMoreMenu
            id="more-controls-menu"
            keepMounted
            anchorEl={moreEl}
            open={Boolean(moreEl)}
            onClose={handleMoreClose}
            MenuListProps={{ onPointerLeave: handleMoreClose }}
        >
            <List
                disablePadding
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Whiteboard
                    </ListSubheader>
                }
            >
                <PermissionControls otherUserId={session.id} />
            </List>
            <List
                disablePadding
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Trophies
                    </ListSubheader>
                }
            >
                {/* TODO: Unset MenuItem css about clickable. It's duplicate css with IconButton in TrophyControls */}
                <MenuItem className={trophiesMenuItem}>
                    <TrophyControls otherUserId={session.id} />
                </MenuItem>
            </List>
        </StyledMoreMenu>
    </>)
}