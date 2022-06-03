import {
    SCHEDULE_FETCH_INTERVAL_MINUTES,
    SCHEDULE_FETCH_MONTH_DIFF,
    THEME_COLOR_BACKGROUND_LIST,
} from "@/config";
import {
    createStyles,
    List,
    makeStyles,
} from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router";

import { ClassType } from "@/store/actions";
import CategoryItem from "./CategoryItem";

const useStyles = makeStyles((theme) => createStyles({
    listRoot: {
        width: `100%`,
        backgroundColor: THEME_COLOR_BACKGROUND_LIST,
        overflowY: `scroll`,
        flex: 1,
        padding: theme.spacing(2),
        paddingTop: theme.spacing(3.5),
    },
}));

const classTypes: ClassType[] = [ClassType.LIVE, ClassType.STUDY, ClassType.HOME_FUN_STUDY];

export default function CategoryList () {
    const classes = useStyles();
    const history = useHistory();

    const handleDetailOpen = (classType?: ClassType) => {
        switch (classType) {
            case ClassType.LIVE:
                history.push(`/schedule/category-live`);
                break;
            default:
                history.push(`/schedule/category-study/${classType}`);
                break;
        }
    };
    
    return (
        <List
            className={classes.listRoot}
        >
            {classTypes.map((classType) => (
                <CategoryItem
                    key={classType}
                    classType={classType}
                    onDetailClick={() => handleDetailOpen(classType)}
                />
            ))}
        </List>
    );
}
