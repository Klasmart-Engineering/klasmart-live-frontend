import { NoItemList } from "../../../utils/utils";
import Manual from "./manual";
import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import { Book as ManualIcon } from "@styled-icons/bootstrap/Book";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
    fullHeight:{
        height: `100%`,
    },
    container:{
        padding : `1rem 10px`,
        paddingBottom: 0,
    },
}));

const manuals = [
    {
        id: 1,
        title: `Teacher Manual #1`,
        type: `pdf`,
    },
    {
        id: 2,
        title: `Teacher Manual #2`,
        type: `pdf`,
    },
    {
        id: 3,
        title: `Teacher Manual #3`,
        type: `pdf`,
    },
];

function Manuals () {
    const classes = useStyles();

    return (
        <Grid
            container
            direction="column"
            className={classes.fullHeight}>
            <Grid
                item
                xs>
                {manuals.length === 0 ?
                    <NoItemList
                        icon={<ManualIcon />}
                        text='No manuals' />
                    :
                    (<div className={classes.container}>
                        {manuals?.map(manual => (
                            <Manual
                                key={manual.id}
                                title={manual.title}
                                type={manual.type} />
                        ))}
                    </div>)
                }
            </Grid>
        </Grid>
    );
}

export default Manuals;
