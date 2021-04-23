import { LocalSessionContext } from "../../../providers/providers";
import { activeSettingsStateTab } from "../../../states/layoutAtoms";
import {
    Grid, List, ListItem, ListItemIcon, ListItemText, makeStyles, Theme, Typography,
} from "@material-ui/core";
import { UserAvatar } from "kidsloop-px";
import React, { useContext } from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height : `100%`,
        background: `#fff`,
        borderRadius: 12,
        marginRight: theme.spacing(1),
        padding: theme.spacing(2),
        minWidth: 240,
    },
    user:{
        borderBottom: `1px solid lightgrey`,
        paddingBottom: 16,
    },
    avatar : {
        marginRight: theme.spacing(2),
    },
    list:{},
    listItem:{
        borderRadius: 10,
        "&$selected":{
            background: theme.palette.background.default,
            "&:hover":{
                background: theme.palette.background.default,
            },
        },
    },
    selected:{},
    listItemIcon:{
        color: theme.palette.text.primary,
    },
}));

function TabSettingsMenu (props: any) {
    const { menu } = props;
    const classes = useStyles();

    const [ activeSettingsTab, setActiveSettingsTab ] = useRecoilState(activeSettingsStateTab);

    const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        tab: string) => {
        setActiveSettingsTab(tab);
    };

    const { name, isTeacher } = useContext(LocalSessionContext);

    return (
        <Grid
            container
            direction="column"
            className={classes.root}>
            <Grid item>
                <Grid
                    container
                    alignItems="center"
                    className={classes.user}>
                    <Grid
                        item
                        className={classes.avatar}>
                        <UserAvatar
                            name={name || `u`}
                            size="medium"
                        />
                    </Grid>
                    <Grid>
                        <Typography variant="h5">{name}</Typography>
                        <Typography variant="body2">{isTeacher ? `Teacher` : `Student`}</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid
                item
                xs>
                <List
                    component="nav"
                    aria-label="main mailbox folders"
                    classes={{
                        root: classes.list,
                    }}>
                    {menu.map((item: any) => (
                        <ListItem
                            key={item.id}
                            button
                            selected={activeSettingsTab === item.name}
                            classes={{
                                root: classes.listItem,
                                selected: classes.selected,
                            }}
                            onClick={(event) => handleListItemClick(event, item.name)}
                        >
                            <ListItemIcon className={classes.listItemIcon}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItem>
                    ))}
                </List>
            </Grid>
        </Grid>
    );
}

export default TabSettingsMenu;
