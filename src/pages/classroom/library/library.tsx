import { CardMedia } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ArchiveTwoToneIcon from "@material-ui/icons/ArchiveTwoTone";
import HourglassFullTwoToneIcon from "@material-ui/icons/HourglassFullTwoTone";
import LocalLibraryTwoToneIcon from "@material-ui/icons/LocalLibraryTwoTone";
import * as React from "react";
import Void1BackgroundImage from "../../../assets/img/void1_bg.svg";
import Void2BackgroundImage from "../../../assets/img/void1_bg.svg";
import ZooBackgroundImage from "../../../assets/img/zoo_banner_web.png";
import { ContentItem } from "../../../types/objectTypes";
import CreateDialog from "./createDialog";
import LibraryView from "./libraryView";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        buttonSpacing: {
            margin: theme.spacing(0, 1),
        },
        paperContainer: {
            borderRadius: 12,
            boxShadow: theme.palette.type === "dark" ? "0px 2px 4px -1px rgba(255, 255, 255, 0.25), 0px 4px 5px 0px rgba(255, 255, 255, 0.2), 0px 1px 10px 0px rgba(255, 255, 255, 0.16)" : "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
        },
        root: {
            height: "100%",
        },
        textSpacing: {
            margin: theme.spacing(1),
        },
    }),
);

export default function LibraryLayout() {
    const classes = useStyles();

    const OWNED_CONTENT: ContentItem[] = [
        // {
        //     description: "In collaboration with The Zoological Society of East Anglia, join an interactive virtual world of animal fun and learning through live and self-paced classes.",
        //     image: ZooBackgroundImage,
        //     link: "https://zoo.kidsloop.net",
        //     title: "Badanamu Zoo",
        // },
    ];

    const MARKETPLACE_CONTENT: ContentItem[] = [
        {
            description: "Bada Rhyme 1 is the first step in our ESL curriculum. Young learners can begin their English journey through classic nursery rhymes. Bada Rhyme's key learning areas: Phonological awareness, vocabulary, language, communication, emergent reading and writing skills, social-emotional learning, cognitive development, physical coordination, and STEAM.",
            image: "https://badanamu.com/wp-content/uploads/2019/12/Bada_Rhyme_logo.png",
            link: "#",
            title: "Bada Rhyme 1",
        },
    ];

    return (
        <Grid
            container
            direction="row"
            justify="space-between"
            className={classes.root}
            spacing={4}
        >
            <Grid
                container item
                justify="space-between"
                alignItems="center"
            >
                <Hidden mdDown>
                    <Grid item xs={6}>
                        <CreateDialog />
                    </Grid>
                    <Grid
                        container item
                        justify="flex-end"
                        xs={6}
                    >
                        <Button
                            color="primary"
                            className={classes.buttonSpacing}
                            size="large"
                            startIcon={<LocalLibraryTwoToneIcon style={{ color: "#444" }} />}
                        >
                            My Content
                        </Button>
                        <Button
                            color="primary"
                            className={classes.buttonSpacing}
                            size="large"
                            startIcon={<HourglassFullTwoToneIcon style={{ color: "#444" }} />}
                        >
                            Pending
                        </Button>
                        <Button
                            color="primary"
                            className={classes.buttonSpacing}
                            size="large"
                            startIcon={<ArchiveTwoToneIcon style={{ color: "#444" }} />}
                        >
                            Archived
                        </Button>
                    </Grid>
                </Hidden>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="caption" color="textSecondary">
                    Content Library
                </Typography>
            </Grid>
            <Grid item xs={12}>
                { OWNED_CONTENT.length !== 0 ?
                    <LibraryView content={OWNED_CONTENT} type="OwnedContent" /> :
                    <Grid
                        container
                        direction="column"
                        justify="space-between"
                        alignItems="center"
                        spacing={1}
                    >
                        <Grid item xs={12}>
                            <CardMedia
                                component="img"
                                alt="Empty Library"
                                height="140"
                                image={Void1BackgroundImage}
                                title="Empty Library"
                                style={{ objectFit: "contain" }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" align="center">
                                Your library is empty!
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="caption" align="center" component="p">
                                Create or purchase content to get started on your learning adventure.
                            </Typography>
                        </Grid>
                        <Hidden lgUp>
                            <Grid item xs={12}>
                                <CreateDialog />
                            </Grid>
                        </Hidden>
                    </Grid>
                }
            </Grid>
            <Grid item xs={12}>
                <Typography variant="caption" color="textSecondary">
                    Marketplace
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <LibraryView content={MARKETPLACE_CONTENT} type="Marketplace" />
            </Grid>
        </Grid>
    );
}
