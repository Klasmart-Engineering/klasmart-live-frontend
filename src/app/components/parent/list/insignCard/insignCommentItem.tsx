import { useSelectedUserValue } from "../../../../data/user/atom";
import {
    LIVE_COLOR,
    TEXT_COLOR_CONSTRAST_DEFAULT,
} from "@/config";
import { setRandomClassIdState } from "@/store/layoutAtoms";
import { GetAppInsightMessagesResponse } from "@kl-engineering/cms-api-client";
import {
    Box,
    createStyles,
    List,
    ListItemText,
    makeStyles,
    Typography,
} from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useRecoilValue } from "recoil";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        width: `auto`,
        margin: theme.spacing(2),
        marginBottom: theme.spacing(3),
        borderRadius: 10,
        backgroundColor: LIVE_COLOR,
        "&:last-child":{
            marginBottom: theme.spacing(1),
        },
        "&:hover": {
            background: theme.palette.background.paper,
        },
    },
    list: {
        padding: `20px`,
    },
    title: {
        fontWeight: theme.typography.fontWeightRegular as number,
        color: TEXT_COLOR_CONSTRAST_DEFAULT,
    },
}));

export interface InsignCommentProps {
    dataInsightMessage: GetAppInsightMessagesResponse;
}

export const InsignCommentItem = (props: InsignCommentProps) => {
    const { dataInsightMessage } = props;
    const classes = useStyles();
    const getRandomClassIdState = useRecoilValue(setRandomClassIdState);
    const selectedUser = useSelectedUserValue();

    return (
        <Box className={classes.root}>
            <List className={classes.list}>
                <ListItemText
                    disableTypography
                    primary={
                        <Typography
                            className={classes.title}
                            variant="body2"
                        >
                            <FormattedMessage
                                id={dataInsightMessage.learning_outcome_achivement_label_id}
                                values={{
                                    Name :`${selectedUser?.given_name} ${selectedUser?.family_name}`,
                                    ClassName: getRandomClassIdState?.class?.name ?? ``,
                                    LearntLoCount: dataInsightMessage?.learning_outcome_achivement_label_params.learnt_lo_count,
                                    AchievedLoCount: dataInsightMessage?.learning_outcome_achivement_label_params.achieved_lo_count,
                                    LOCompareLastWeek: dataInsightMessage?.learning_outcome_achivement_label_params.lo_compare_last_week,
                                    LOCompareClass3week: dataInsightMessage?.learning_outcome_achivement_label_params.lo_compare_class_3_week,
                                    AssignCompare3Week: dataInsightMessage?.assignment_label_params.assign_compare_3_week,
                                    AssignCompareClass3week: dataInsightMessage?.assignment_label_params.assign_compare_class_3_week,
                                }}
                            />
                        </Typography>
                    }
                />
            </List>
        </Box>
    );
};
