import LiveIconDialog from "@/assets/img/schedule-icon/live_type_schedule_dialog.svg";
import StudyIconDialog from "@/assets/img/schedule-icon/study_type_schedule_dialog.svg";
import HomeFunIconDialog from "@/assets/img/schedule-icon/home_fun_type_schedule_dialog.svg";
import LiveJoinArrow from "@/assets/img/schedule-icon/live_join_arrow.svg";
import StudyJoinArrow from "@/assets/img/schedule-icon/study_join_arrow.svg";
import HomeFunJoinArrow from "@/assets/img/schedule-icon/home_fun_join_arrow.svg";
import Loading from "@/components/loading";
import StyledIcon from "@/components/styled/icon";
import { 
    TEXT_COLOR_SECONDARY_DEFAULT, 
    TEXT_COLOR_VERSION_APP, 
    THEME_COLOR_BLUE_CLASS_TYPE_SCHEDULE_DIALOG, 
    THEME_COLOR_GREEN_BUTTON_SCHEDULE_DIALOG, 
    THEME_COLOR_PINK_BUTTON_SCHEDULE_DIALOG, 
    THEME_COLOR_YELLOW_BUTTON_SCHEDULE_DIALOG 
} from "@/config";
import { UserAvatar } from "@kl-engineering/kidsloop-px";
import {
    Chip,
    createStyles,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    makeStyles,
    Typography,
} from "@material-ui/core";
import { Close as CloseIcon } from "@styled-icons/material/Close";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import AttachmentNameLink from "./Attachment/NameLink";
import AttachmentDownloadButton from "./Attachment/DownloadButton";
import ScheduleJoinButton from "./ScheduleJoinButton";
import { ForeignIdName } from "@kl-engineering/cms-api-client/dist/api/shared";
import { ClassType } from "@/store/actions";

const useStyles = makeStyles((theme) => createStyles({
    dialog: {
        borderRadius: 20,
        [theme.breakpoints.up(`sm`)]: {
            maxWidth: `50%`,
        },
    },
    dialogTitle: {
        backgroundColor: theme.palette.background.paper,
        paddingBottom: 0,
    },
    dialogClassType: {
        height: theme.spacing(2.5),
        paddingLeft: theme.spacing(0.75),
        color: theme.palette.background.paper,
        backgroundColor: THEME_COLOR_BLUE_CLASS_TYPE_SCHEDULE_DIALOG,
        marginTop: theme.spacing(1),
    },
    dialogTitleText: {
        textOverflow: `ellipsis`,
        overflow: `hidden`,
        marginRight: theme.spacing(1),
        paddingTop: theme.spacing(0.5),
        display: `-webkit-box`,
        WebkitBoxOrient: `vertical`,
        WebkitLineClamp: 2,
    },
    dialogContent: {
        position: `relative`,
        paddingTop: theme.spacing(3),
    },
    dialogTeacher: {
        padding: theme.spacing(0, 0.5),
        display: `-webkit-box`,
        overflow: `hidden`,
        WebkitBoxOrient: `vertical`,
        WebkitLineClamp: 1,
        maxWidth: `40%`,
    },
    dialogDivider: {
        padding: theme.spacing(1, 0),
    },
    dialogDateTime: {
        whiteSpace: `pre-line`,
    },
    dialogDescription: {
        maxHeight: 70,
        overflowY: `auto`,
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(5),
    },
    dialogAttachment: {
        border: `solid 1px`,
        borderRadius: 10,
        borderColor: TEXT_COLOR_VERSION_APP,
        padding: theme.spacing(0.5, 1),
    },
    dialogButton: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(3),
    },
    dialogLoadingContent: {
        position: `absolute`,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: `center`,
        alignItems: `center`,
        backgroundColor: theme.palette.background.paper,
        display: `flex`,
    },
    dialogEndIcon: {
        position: `absolute`,
        right: theme.spacing(0.5),
        top: theme.spacing(0.75),
    },
    dialogChipClassType: {
        filter: `brightness(0) invert(1)`,
    },
}));

export interface Props {
    classType: string;
    title: string | JSX.Element;
    teachers: ForeignIdName[];
    dateTime?: string;
    description?: (string | JSX.Element)[];
    attachment?: ForeignIdName;
    actionButtonTitle: string;
    open: boolean;
    isLoading: boolean;
    disabled?: boolean;
    onClick: () => void;
    onClose: () => void;
}

interface DialogHeaderProps {
    teachers: ForeignIdName[];
}

function DialogHeader(props: DialogHeaderProps): JSX.Element {
    const MAX_AVATAR_DISPLAY = 2;
    const { teachers } = props;
    const classes = useStyles();

    return (
        <Grid
            container
            direction="row"
        >
            {teachers.slice(0, MAX_AVATAR_DISPLAY).map((item) => (
                <>
                    <Grid
                        key={item.id}
                        item
                    >
                        <UserAvatar
                            name={item.name}
                            size={`small`}
                        />
                    </Grid>
                    <Grid
                        item
                        className={classes.dialogTeacher}
                    >
                        <Typography
                            variant={`subtitle1`}
                        >
                            {item.name}
                        </Typography>
                    </Grid>
                </>
            ))}
            {teachers.length > MAX_AVATAR_DISPLAY ? (
                <Grid item>
                    <Typography
                        color={`textSecondary`}
                        variant={`subtitle1`}
                    >
                        <FormattedMessage
                            id="live.enter.teacherCount"
                            values={{
                                value: `${teachers.length - MAX_AVATAR_DISPLAY}`,
                            }}
                        />
                    </Typography>
                </Grid>) : null}
        </Grid>
    );
}

export default function BaseScheduleDialog (props: Props) {
    const {
        classType,
        title,
        teachers,
        dateTime = ``,
        description,
        attachment,
        actionButtonTitle,
        open,
        isLoading,
        disabled,
        onClick,
        onClose,
    } = props;
    const classes = useStyles();
    const intl = useIntl();

    const getClassTypeProperty = () => {
        switch (classType) {
            case ClassType.LIVE:
                return {
                    title: intl.formatMessage({
                        id: `schedule_liveTab`,
                        defaultMessage: `Live`,
                    }),
                    icon: LiveIconDialog,
                    backgroundClassType: THEME_COLOR_BLUE_CLASS_TYPE_SCHEDULE_DIALOG,
                    actionButtonBackground: THEME_COLOR_PINK_BUTTON_SCHEDULE_DIALOG,
                    actionButtonEndIcon: LiveJoinArrow,
                }
            case ClassType.STUDY:
                return {
                    title: intl.formatMessage({
                        id: `schedule_studyTab`,
                        defaultMessage: `Study`,
                    }),
                    icon: StudyIconDialog,
                    backgroundClassType: THEME_COLOR_PINK_BUTTON_SCHEDULE_DIALOG,
                    actionButtonBackground: THEME_COLOR_BLUE_CLASS_TYPE_SCHEDULE_DIALOG,
                    actionButtonEndIcon: StudyJoinArrow,
                }
            case ClassType.REVIEW:
                return {
                    title: intl.formatMessage({
                        id: `review.title`,
                        defaultMessage: `Review`,
                    }),
                    icon: StudyIconDialog,
                    backgroundClassType: THEME_COLOR_PINK_BUTTON_SCHEDULE_DIALOG,
                    actionButtonBackground: THEME_COLOR_BLUE_CLASS_TYPE_SCHEDULE_DIALOG,
                    actionButtonEndIcon: StudyJoinArrow,
                }
            case ClassType.HOME_FUN_STUDY:
                return {
                    title: intl.formatMessage({
                        id: `schedule.homeFun`,
                        defaultMessage: `Home Fun`,
                    }),
                    icon: HomeFunIconDialog,
                    backgroundClassType: THEME_COLOR_YELLOW_BUTTON_SCHEDULE_DIALOG,
                    actionButtonBackground: THEME_COLOR_GREEN_BUTTON_SCHEDULE_DIALOG,
                    actionButtonEndIcon: HomeFunJoinArrow,
                }
            default:
                return {
                    title: intl.formatMessage({
                        id: `schedule_liveTab`,
                        defaultMessage: `Live`,
                    }),
                    icon: LiveIconDialog,
                    backgroundClassType: THEME_COLOR_BLUE_CLASS_TYPE_SCHEDULE_DIALOG,
                    actionButtonBackground: THEME_COLOR_PINK_BUTTON_SCHEDULE_DIALOG,
                    actionButtonEndIcon: LiveJoinArrow,
                }
        }
    }

    return (
        <Dialog
            fullWidth
            maxWidth={`sm`}
            scroll={`paper`}
            open={open}
            PaperProps={{
                className: classes.dialog
            }}
            onClose={onClose}
        >
            {!isLoading && <DialogTitle className={classes.dialogTitle}>
                <Grid
                    container
                    justifyContent="space-between"
                    wrap="nowrap"
                >
                    <Grid
                        container
                        direction="column"
                        style={{
                            overflowX: `hidden`,
                        }}
                    >
                        <Grid item>
                            <Chip
                                className={classes.dialogClassType}
                                style={{
                                    backgroundColor: getClassTypeProperty().backgroundClassType,
                                }}
                                label={getClassTypeProperty().title}
                                icon={<img
                                    className={classes.dialogChipClassType}
                                    alt={getClassTypeProperty().title}
                                    src={getClassTypeProperty().icon}
                                />}
                            />
                        </Grid>

                        <Grid item>
                            <Typography
                                variant="h4"
                                className={classes.dialogTitleText}
                            >
                                {title}
                            </Typography>
                        </Grid>

                    </Grid>
                    <Grid
                        item
                        onClick={onClose}
                    >
                        <StyledIcon
                            icon={<CloseIcon />}
                            size={`large`}
                        />
                    </Grid>
                </Grid>
            </DialogTitle>}
            <div className={classes.dialogContent}>
                <DialogContent>
                    <Grid
                        container
                        direction="column"
                    >
                        <DialogHeader teachers={teachers} />
                        <Grid
                            item
                            className={classes.dialogDivider}
                        >
                            <Divider />
                        </Grid>
                        {dateTime !== `` && <Grid item>
                            <Typography 
                                variant={`subtitle1`}
                                className={classes.dialogDateTime}
                            >
                                {dateTime}
                            </Typography>
                        </Grid>}
                        {description && <Grid
                            item
                            className={classes.dialogDescription}
                        >
                            <Typography variant={`subtitle1`}>
                                {description}
                            </Typography>
                        </Grid>}
                        {attachment?.name && (
                            <Grid
                                container
                                justifyContent="space-between"
                                alignItems="center"
                                className={classes.dialogAttachment}
                            >
                                <AttachmentNameLink
                                    attachmentId={attachment.id}
                                    attachmentName={attachment.name}
                                />
                                <AttachmentDownloadButton
                                    attachmentId={attachment.id}
                                    attachmentName={attachment.name}
                                />
                            </Grid>
                        )}
                        <Grid
                            className={classes.dialogButton}
                            container
                            alignItems="center"
                            justifyContent="center"
                        >
                            <ScheduleJoinButton
                                title={actionButtonTitle}
                                backgroundColor={getClassTypeProperty().actionButtonBackground}
                                endIcon={
                                    <img
                                        alt={getClassTypeProperty().title}
                                        src={getClassTypeProperty().actionButtonEndIcon}
                                        height={32}
                                        className={classes.dialogEndIcon}
                                    />
                                }
                                disabled={disabled}
                                width={classType === ClassType.LIVE ? 150 : 200}
                                onClick={onClick}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                {isLoading && (<div className={classes.dialogLoadingContent}>
                    <Loading />
                </div>)}
            </div>
        </Dialog>
    );
}
