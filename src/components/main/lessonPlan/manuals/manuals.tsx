import Manual from "./manual";
import { NoItemList } from "@/utils/utils";
import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import { Book as ManualIcon } from "@styled-icons/bootstrap/Book";
import React from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme: Theme) => ({
    fullHeight:{
        height: `100%`,
    },
    container:{
        padding : `1rem 10px`,
        paddingBottom: 0,
    },
}));

const manuals:any = [
    /* {
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
    },*/
];

function Manuals () {
    const classes = useStyles();
    const intl = useIntl();

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
                        text={intl.formatMessage({
                            id: `lessonplan_manuals_noresults`,
                        })} />
                    :
                    (<div className={classes.container}>
                        {manuals?.map((manual:any) => (
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
