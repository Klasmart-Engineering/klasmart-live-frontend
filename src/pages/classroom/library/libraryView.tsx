import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import { TransitionProps } from "@material-ui/core/transitions";
import Typography from "@material-ui/core/Typography";
import AllInboxTwoToneIcon from "@material-ui/icons/AllInboxTwoTone";
import AppsIcon from "@material-ui/icons/Apps";
import BusinessTwoToneIcon from "@material-ui/icons/BusinessTwoTone";
import CloseIcon from "@material-ui/icons/Close";
import ContactSupportTwoToneIcon from "@material-ui/icons/ContactSupportTwoTone";
import CreditCardTwoToneIcon from "@material-ui/icons/CreditCardTwoTone";
import GroupTwoToneIcon from "@material-ui/icons/GroupTwoTone";
import LockTwoToneIcon from "@material-ui/icons/LockTwoTone";
import PersonOutlineTwoToneIcon from "@material-ui/icons/PersonOutlineTwoTone";
import PhonelinkTwoToneIcon from "@material-ui/icons/PhonelinkTwoTone";
import SchoolTwoToneIcon from "@material-ui/icons/SchoolTwoTone";
import SecurityTwoToneIcon from "@material-ui/icons/SecurityTwoTone";
import TableChartTwoToneIcon from "@material-ui/icons/TableChartTwoTone";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import KidsloopLogo from "../../../assets/img/kidsloop.svg";
import ZooBackgroundImage from "../../../assets/img/zoo_banner_web.png";
import DialogAppBar from "../../../components/dialogAppBar";
import { ContentItem, MenuItem } from "../../../types/objectTypes";
import LibraryContentCard from "./libraryContentCard";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            position: "relative",
        },
        menuButton: {
            maxWidth: "90%",
            padding: theme.spacing(2),
            [theme.breakpoints.down("sm")]: {
                maxWidth: "100%",
            },
        },
        title: {
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(1),
        },
    }),
);

const Motion = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Grow style={{ transformOrigin: "0 0 0" }} ref={ref} {...props} />;
});

export default function LibraryView() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const MENU_ITEMS: ContentItem[] = [
        {
            description: "In collaboration with The Zoological Society of East Anglia, join an interactive virtual world of animal fun and learning through live and self-paced classes.",
            image: ZooBackgroundImage,
            link: "http://0.0.0.0:8082",
            title: "Badanamu Zoo",
        },
        {
            description: "In collaboration with The Zoological Society of East Anglia, join an interactive virtual world of animal fun and learning through live and self-paced classes.",
            image: ZooBackgroundImage,
            link: "#",
            title: "Badanamu Zoo",
        },
    ];

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="stretch"
                spacing={1}
            >
                {
                    MENU_ITEMS.map((menuItem) => {
                        return (
                            <Grid
                                key={`menuItem-${menuItem.title}`}
                                item
                                xs={6} sm={4} md={3}
                                style={{ textAlign: "center" }}
                            >
                                <LibraryContentCard content={menuItem}/>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </>
    );
}
