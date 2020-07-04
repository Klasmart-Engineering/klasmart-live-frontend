import Button from "@material-ui/core/Button";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { createStyles, makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import LanguageIcon from "@material-ui/icons/Translate";
import { useState } from "react";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { useSelector, useStore } from "react-redux";
import { ActionTypes } from "../store/actions";
import { State } from "../store/store";

const CLASS_LIST: ClassInfo[] = [
    {
        classId: "CalmIsland",
        className: "Pre-production",
    },
];

export interface ClassInfo {
    classId: string;
    className: string;
}

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        classSelect: {
            // margin: theme.spacing(0, 0.5, 0, 1),
            display: "block",
        },
    }),
);

const StyledMenu = withStyles({})((props: MenuProps) => (
    <Menu
        elevation={4}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "center",
        }}
        {...props}
    />
));

export default function ClassSelect() {
    const classes = useStyles();
    const store = useStore();

    const liveData = useSelector((state: State) => state.account.finishLiveData);
    const classInfo = CLASS_LIST.find((element) => element.classId === liveData.classId);
    const [className, setClassName] = useState<string>(classInfo ? classInfo.className : "");
    const [classNameMenuElement, setClassNameMenuElement] = useState<null | HTMLElement>(null);

    function classSelect(classInfo: ClassInfo) {
        const value = {
            classId: classInfo.classId,
            className: classInfo.className,
            startDate: liveData.students,
            students: liveData.students
        }
        store.dispatch({ type: ActionTypes.FINISH_LIVE_DATA, payload: value });
        setClassName(classInfo.className);
        setClassNameMenuElement(null);
    }

    return (
        <>
            <Tooltip title={<FormattedMessage id="live_classSelect" />} enterDelay={300}>
                <Button
                    color="inherit"
                    aria-owns={classNameMenuElement ? "classSelect-menu" : undefined}
                    aria-haspopup="true"
                    data-ga-event-category="AppBar"
                    data-ga-event-action="classSelect"
                    onClick={(e) => setClassNameMenuElement(e.currentTarget)}
                >
                    <span className={classes.classSelect}>
                        {liveData.classId === "" ?
                            <FormattedMessage id="live_classSelect" /> :
                            className
                        }
                    </span>
                    <ExpandMoreIcon fontSize="small" />
                </Button>
            </Tooltip>
            <StyledMenu
                id="classSelect-menu"
                anchorEl={classNameMenuElement}
                keepMounted
                open={Boolean(classNameMenuElement)}
                onClose={() => setClassNameMenuElement(null)}
            >
                {
                    CLASS_LIST.map((classInfo) => (
                        <MenuItem
                            key={classInfo.classId}
                            selected={liveData.classId === classInfo.classId}
                            onClick={() => classSelect(classInfo)}
                        >
                            {classInfo.className}
                        </MenuItem>
                    ))
                }
            </StyledMenu>
        </>
    );
}
