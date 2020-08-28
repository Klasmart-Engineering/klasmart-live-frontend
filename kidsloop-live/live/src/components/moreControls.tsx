import React, { useState } from "react";
import { Theme, useTheme, createStyles, makeStyles, withStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import IconButton from "@material-ui/core/IconButton";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import List from "@material-ui/core/List";
import ListSubheader from '@material-ui/core/ListSubheader';

import { MoreVert as MoreIcon } from "@styled-icons/material/MoreVert"

import StyledIcon from "./styled/icon";
import TrophyControls from "./trophies/trophyControls"
import { Session } from "../room";
import PermissionControls from "../whiteboard/components/PermissionControls";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        moreBtn: {
            position: "absolute",
            bottom: theme.spacing(2),
            right: theme.spacing(2),
            [theme.breakpoints.down("sm")]: {
                bottom: theme.spacing(1),
                right: theme.spacing(1),
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
        width: 280,
        border: "1px solid lightgrey",
    },
})((props: MenuProps) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: -210,
            horizontal: "left", // TODO: Adjust
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "left", // TODO: Adjust
        }}
        {...props}
    />
));

export default function MoreControls({ session, selfUserId, forOverlay }: {
    session: Session,
    selfUserId: string
    forOverlay?: boolean,
}) {
    const theme = useTheme();
    const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
    const { moreBtn, icon, trophiesMenuItem } = useStyles();

    const [moreEl, setMoreEl] = useState<null | HTMLElement>(null);
    const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => { setMoreEl(event.currentTarget); };
    const handleMoreClose = () => { setMoreEl(null); };

    return (<>
        <IconButton
            aria-label="more button"
            aria-controls="more-controls-menu"
            aria-haspopup="true"
            component="span"
            size={isSmUp ? "medium" : "small"}
            className={forOverlay ? moreBtn : undefined}
            onClick={handleMoreClick}
            onMouseOver={handleMoreClick}
        >
            <StyledIcon
                icon={<MoreIcon className={forOverlay ? icon : undefined} />}
                size={isSmUp ? "medium" : "small"}
                color={forOverlay ? "white" : "#0E78D5"}
            />
        </IconButton>
        <StyledMoreMenu
            id="more-controls-menu"
            keepMounted
            anchorEl={moreEl}
            open={Boolean(moreEl)}
            onClose={handleMoreClose}
            MenuListProps={{ onMouseLeave: handleMoreClose }}
        >
            <List
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Whiteboard
                </ListSubheader>
                }
            >
                <PermissionControls selfUserId={selfUserId} otherUserId={session.id} miniMode={false} />
            </List>
            <List
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