import {
    createStyles,
    DialogContent,
    Grid,
    makeStyles,
    Typography,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    rowHeaderText: {
        color: `#193756`,
        fontWeight: theme.typography.fontWeightBold as number,
    },
}));

export interface DialogContentItem {
    header: string;
    content: React.ReactNode;
}

interface Props {
    items: DialogContentItem[];
}

export default function BaseScheduleDialogContent (props: Props) {
    const { items } = props;
    const classes = useStyles();

    return (
        <DialogContent>
            <Grid
                container
                direction={`column`}
                justifyContent={`center`}
                alignItems={`center`}
                spacing={4}
            >
                <Grid
                    container
                    item
                    direction={`row`}
                    spacing={1}
                    alignItems={`center`}
                >
                    {items.map((item, i) => (
                        <Grid
                            key={`content-item-${i}`}
                            container
                            item
                            direction={`row`}
                            spacing={1}
                            alignItems={`center`}
                        >
                            <Grid
                                item
                                xs={4}
                                sm={3}
                            >
                                <Typography
                                    variant="body1"
                                    className={classes.rowHeaderText}
                                >
                                    {item.header}
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs
                            >
                                {item.content}
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </DialogContent>
    );
}
