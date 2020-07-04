import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AddShoppingCartTwoToneIcon from "@material-ui/icons/AddShoppingCartTwoTone";
import ArchiveTwoToneIcon from "@material-ui/icons/ArchiveTwoTone";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ShareTwoToneIcon from "@material-ui/icons/ShareTwoTone";
import React, { useState } from "react";
import { ContentItem, LibraryContentType } from "../../../types/objectTypes";
import EditDialog from "./EditDialog";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cardActions: {
            display: "flex",
        },
        cardContent: {
            padding: theme.spacing(1, 1),
        },
        iconExpand: {
            marginLeft: "auto",
        },
        paragraphClamp: {
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            display: "-webkit-box",
            overflow: "hidden",
            [theme.breakpoints.down("sm")]: {
                WebkitLineClamp: 4,
            },
        },
        root: {
            maxWidth: 345,
        },
        rotateIcon: {
            transform: "rotate(180deg)",
        },
    }),
);

interface Props {
    content: ContentItem;
    type: LibraryContentType;
}

export default function LibraryContentCard(props: Props) {
    const classes = useStyles();
    const { content, type } = props;
    const [moreInfo, toggleMoreInfo] = useState(false);
    const [open, setOpen] = useState(false);
    const handleOpen = () => { setOpen(true); };
    const handleClose = () => { setOpen(false); };

    return (<>
        <Card className={classes.root}>
            <CardActionArea onClick={() => window.open(content.link)}>
                <CardMedia
                    component="img"
                    alt={`${content.title} Image`}
                    height="140"
                    image={content.image}
                    title={`${content.title} Image`}
                />
            </CardActionArea>
            <CardContent className={classes.cardContent}>
                <Grid
                    container
                    justify="space-between"
                    alignItems="center"
                >
                    <Grid item>
                        <Typography gutterBottom variant="body1" align="left">
                            {content.title}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <IconButton
                            aria-label={moreInfo ? "hide content info" : "show content info"}
                            onClick={() => toggleMoreInfo(!moreInfo)}
                            size="small"
                        >
                            <ExpandMoreIcon fontSize="inherit" className={moreInfo ? classes.rotateIcon : ""} />
                        </IconButton>
                    </Grid>
                </Grid>
                <Collapse
                    in={moreInfo}
                >
                    <Typography
                        variant="caption"
                        color="textSecondary"
                        component="p"
                        align="left"
                        className={classes.paragraphClamp}
                    >
                        {content.description}
                    </Typography>
                </Collapse>
            </CardContent>
            {type === "OwnedContent" ?
                <CardActions className={classes.cardActions}>
                    <IconButton size="small" color="primary" className={classes.iconExpand}>
                        <ShareTwoToneIcon />
                    </IconButton>
                    {!content.published && content.type !== undefined ?
                        <IconButton size="small" color="primary" onClick={handleOpen}>
                            <EditTwoToneIcon />
                        </IconButton> : null
                    }
                    <IconButton size="small" color="primary">
                        <ArchiveTwoToneIcon />
                    </IconButton>
                </CardActions> :
                <CardActions className={classes.cardActions}>
                    <Grid container justify="space-between" alignItems="center">
                        <Grid item>
                            <Typography variant="caption">
                                ₩29,000
                            </Typography>
                        </Grid>
                        <Grid item>
                            <IconButton size="small" color="primary">
                                <AddShoppingCartTwoToneIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </CardActions>
            }
        </Card>
        {!content.published && content.type !== undefined ?
            <EditDialog contentId={content.contentId} contentType={content.type} open={open} onClose={handleClose} /> : null
        }
    </>);
}
