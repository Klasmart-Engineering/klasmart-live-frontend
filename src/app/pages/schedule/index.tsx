import DialogParentalLock from "@/app/components/ParentalLock";
import HomeTopBar from "@/app/components/Schedule/HomeTopBar";
import CategoryList from "@/app/components/Schedule/List";
import {
    useSelectedOrganizationValue,
    useSelectedUserValue,
} from "@/app/data/user/atom";
import { dialogsState } from "@/app/model/appModel";
import { THEME_BACKGROUND_SIGN_OUT_BUTTON } from "@/config";
import {
    Box,
    createStyles,
    makeStyles,
} from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            backgroundColor: THEME_BACKGROUND_SIGN_OUT_BUTTON,
            height: `100%`,
            width: `100%`,
            display: `flex`,
            flexDirection: `column`,
            alignItems: `center`,
            padding: 0,
        },
    }));

export default function SchedulePage () {
    const history = useHistory();
    const classes = useStyles();
    const user = useSelectedUserValue();
    const organization = useSelectedOrganizationValue();
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);

    const onProfileClick = () => {
        setDialogs({
            ...dialogs,
            isSelectUserOpen: true,
        });
    };

    const onParentsDashboardClick = () => {
        setDialogs({
            ...dialogs,
            isParentalLockOpen: true,
        });
    };

    if (dialogs.isParentalLockOpen) {
        return (
            <DialogParentalLock
                onCompleted={() => {
                    setDialogs({
                        ...dialogs,
                        isParentalLockOpen: false,
                    });
                    history.push(`/parent-dashboard`);
                }}
            />
        );
    }

    return (
        <Box
            key={`${user?.user_id}-${organization?.organization_id}`}
            className={classes.root}
        >
            <HomeTopBar
                onProfileClick={onProfileClick}
                onParentsDashboardClick={onParentsDashboardClick}
            />
            <CategoryList />
        </Box>
    );
}
