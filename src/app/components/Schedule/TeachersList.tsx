import {
    TEXT_COLOR_SUB_HEADER_SETTINGS_PAGE,
    THEME_COLOR_ORG_MENU_DRAWER,
} from "@/config";
import { ForeignIdName } from "@kl-engineering/cms-api-client/dist/api/shared";
import { UserAvatar } from "@kl-engineering/kidsloop-px";
import {
    Box,
    createStyles,
    Grid,
    makeStyles,
    Typography,
} from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    dialogTeacherContainer: {
        display: `flex`,
        flexDirection: `row`,
        marginTop: theme.spacing(0.5),
        marginRight: theme.spacing(1.25),
        alignItems: `center`,
    },
    dialogTeacherText: {
        fontSize: `0.75rem`,
        color: TEXT_COLOR_SUB_HEADER_SETTINGS_PAGE,
        paddingLeft: theme.spacing(0.5),
        display: `-webkit-box`,
        overflow: `hidden`,
        WebkitBoxOrient: `vertical`,
        WebkitLineClamp: 1,
    },
    dialogBoldTeacherText: {
        fontWeight: theme.typography.fontWeightBold as number,
    },
    dialogMoreTeacher: {
        fontSize: `0.75rem`,
        color: THEME_COLOR_ORG_MENU_DRAWER,
        fontWeight: theme.typography.fontWeightBold as number,
    },
}));

interface TeachersListProps {
    className?: string;
    maxDisplay?: number;
    teachers: ForeignIdName[];
    isBoldText?: boolean;
    isShowFullName?: boolean;
    onClickMore?: () => void;
}

export const TeachersList: React.FC<TeachersListProps> = ({
    teachers,
    className,
    maxDisplay = 2,
    isBoldText = false,
    isShowFullName = false,
    onClickMore,
}) => {
    const classes = useStyles();
    const maxLengthName = (name: string) => {
        if (teachers.length < 2 && name.length > 50) {
            return `${name.slice(0, 50)}...`;
        }
        if (teachers.length === 2 && name.length > 25) {
            return `${name.slice(0, 25)}...`;
        }
        if (teachers.length > 2 && name.length > 22) {
            return `${name.slice(0, 22)}...`;
        }
        return name;
    };

    return (
        <Grid
            container
            className={className}
            direction="row"
        >
            {teachers.slice(0, maxDisplay)
                .map((item) => (
                    <Box
                        key={item.id}
                        className={classes.dialogTeacherContainer}
                    >
                        <UserAvatar
                            name={item.name}
                            size={`small`}
                        />
                        <Typography
                            className={clsx(classes.dialogTeacherText, {
                                [classes.dialogBoldTeacherText]: isBoldText,
                            })}
                            variant={`subtitle1`}
                        >
                            {isShowFullName ? item.name : maxLengthName(item.name)}
                        </Typography>
                    </Box>
                ))}
            {teachers.length > maxDisplay ? (
                <Box
                    className={classes.dialogTeacherContainer}
                    onClick={onClickMore}
                >
                    <Typography
                        className={classes.dialogMoreTeacher}
                        variant={`subtitle1`}
                    >
                        <FormattedMessage
                            id="scheduleDetails.moreTeacher"
                            defaultMessage={`+{value} {value, plural, one {Teacher} other {Teachers}}`}
                            values={{
                                value: teachers.length - maxDisplay,
                            }}
                        />
                    </Typography>
                </Box>) : null}
        </Grid>
    );
};
