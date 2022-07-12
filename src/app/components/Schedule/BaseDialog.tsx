import AttachmentDownloadButton from "./Attachment/DownloadButton";
import AttachmentNameLink from "./Attachment/NameLink";
import ScheduleJoinButton from "./ScheduleJoinButton";
import { TeachersList } from "./TeachersList";
import CloseIcon from "@/assets/img/schedule-icon/pop_up_close_icon.svg";
import Loading from "@/components/loading";
import {
    TEXT_COLOR_SUB_HEADER_SETTINGS_PAGE,
    THEME_BACKGROUND_SIGN_OUT_BUTTON,
    THEME_COLOR_BLUE_CLASS_TYPE_SCHEDULE_DIALOG,
    THEME_COLOR_GREY_BORDER_BOX,
    THEME_COLOR_GREY_TITLE,
    THEME_COLOR_ORG_MENU_DRAWER,
} from "@/config";
import { ForeignIdName } from "@kl-engineering/cms-api-client/dist/api/shared";
import {
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    makeStyles,
    Typography,
} from "@material-ui/core";
import clsx from "clsx";
import React,
{ useState } from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";
import {
    ChevronLeft,
    ChevronRight,
} from "styled-icons/material";

const useStyles = makeStyles((theme) => createStyles({
    dialog: {
        borderRadius: 20,
        height: `90%`,
        [theme.breakpoints.up(`md`)]: {
            height: `50%`,
        },
        "-webkit-text-size-adjust": `none`,
    },
    dialogTitle: {
        backgroundColor: theme.palette.background.paper,
        paddingBottom: 0,
        paddingTop: theme.spacing(1.75),
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
        paddingTop: theme.spacing(1.25),
        display: `-webkit-box`,
        WebkitBoxOrient: `vertical`,
        WebkitLineClamp: 2,
        fontSize: `0.875rem`,
        wordBreak: `break-all`,
        fontWeight: theme.typography.fontWeightBold as number,
        color: TEXT_COLOR_SUB_HEADER_SETTINGS_PAGE,
    },
    dialogContent: {
        paddingTop: 0,
    },
    dialogContentContainer: {
        height: `100%`,
    },
    dialogDateTime: {
        paddingTop: theme.spacing(0.5),
        color: TEXT_COLOR_SUB_HEADER_SETTINGS_PAGE,
    },
    dialogDescription: {
        maxHeight: 70,
        overflow: `auto`,
        color: THEME_COLOR_GREY_TITLE,
    },
    dialogDescriptionLabel: {
        margin: theme.spacing(0.5, 0),
        color: TEXT_COLOR_SUB_HEADER_SETTINGS_PAGE,
        fontWeight: theme.typography.fontWeightBold as number,
        wordBreak: `break-all`,
    },
    dialogAttachment: {
        border: `solid 1px`,
        borderRadius: 10,
        borderColor: THEME_COLOR_GREY_BORDER_BOX,
        backgroundColor: THEME_BACKGROUND_SIGN_OUT_BUTTON,
        padding: theme.spacing(0.5, 1),
        marginTop: theme.spacing(1),
        justifyContent: `space-between`,
        alignItems: `center`,
    },
    dialogButton: {
        paddingBottom: theme.spacing(2),
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
    dialogChipClassType: {
        filter: `brightness(0) invert(1)`,
    },
    dialogJoinButton: {
        paddingLeft: theme.spacing(3.5),
        paddingRight: theme.spacing(1.5),
    },
    dialogBackButton: {
        paddingLeft: theme.spacing(3.5),
        paddingRight: theme.spacing(3.5),
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

    const [ isClickedMoreTeacher, setIsClickedMoreTeacher ] = useState(false);
    const intl = useIntl();

    return (
        <Dialog
            fullWidth
            scroll={`paper`}
            open={open}
            PaperProps={{
                className: classes.dialog,
            }}
            onClose={() => {
                setIsClickedMoreTeacher(false);
                onClose();
            }}
        >
            {!isLoading && (
                <DialogTitle className={classes.dialogTitle}>
                    {(
                        <Grid
                            container
                            justifyContent="space-between"
                            wrap="nowrap"
                            direction="column"
                        >
                            <Grid
                                container
                                justifyContent="space-between"
                                wrap="nowrap"
                            >
                                <Grid item>
                                    <Typography
                                        variant="h4"
                                        className={classes.dialogTitleText}
                                    >
                                        {!isClickedMoreTeacher ? title : (
                                            <FormattedMessage
                                                id={`scheduleDetails.teacherCount`}
                                                defaultMessage={`Teachers ({value})`}
                                                values={{
                                                    value: teachers.length,
                                                }}
                                            />
                                        )}
                                    </Typography>
                                </Grid>
                                <Grid
                                    item
                                    onClick={() => {
                                        setIsClickedMoreTeacher(false);
                                        onClose();
                                    }}
                                >
                                    <img
                                        src={CloseIcon}
                                        alt="close icon"
                                        height={16}
                                    />
                                </Grid>
                            </Grid>

                            {dateTime && !isClickedMoreTeacher && (
                                <Grid item>
                                    <Typography
                                        variant={`subtitle2`}
                                        className={classes.dialogDateTime}
                                    >
                                        {dateTime}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    )}
                </DialogTitle>
            )}
            <DialogContent className={classes.dialogContent}>
                <Grid
                    container
                    className={classes.dialogContentContainer}
                    direction="column"
                    justifyContent="space-between"
                >
                    {!isClickedMoreTeacher ? (
                        <Grid
                            container
                            direction="column"
                        >
                            {teachers.length && (
                                <TeachersList
                                    isBoldText
                                    teachers={teachers}
                                    onClickMore={() => setIsClickedMoreTeacher(true)}
                                />
                            )
                            }
                            <Grid item>
                                <Typography
                                    className={classes.dialogDescriptionLabel}
                                    variant={`subtitle2`}
                                >
                                    <FormattedMessage
                                        id={`scheduleDetails.description`}
                                        defaultMessage={`Description`}
                                    />
                                </Typography>
                                <Typography
                                    className={classes.dialogDescription}
                                    variant={`subtitle2`}
                                >
                                    {description || (
                                        <FormattedMessage
                                            id={`scheduleDetails.empty.description`}
                                            defaultMessage={`No description available`}
                                        />
                                    )}
                                </Typography>
                            </Grid>
                            {attachment?.name && (
                                <Grid
                                    container
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
                        </Grid>
                    ) : (
                        <TeachersList
                            isShowFullName
                            teachers={teachers}
                            maxDisplay={teachers.length}
                            onClickMore={() => setIsClickedMoreTeacher(true)}
                        />
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Grid
                    container
                    className={classes.dialogButton}
                    alignItems="center"
                    justifyContent="center"
                >
                    {isClickedMoreTeacher ? (
                        <ScheduleJoinButton
                            className={classes.dialogBackButton}
                            title={intl.formatMessage({
                                id: `common.goBack`,
                                defaultMessage: `Go Back`,
                            })}
                            spacing={0}
                            backgroundColor={THEME_COLOR_ORG_MENU_DRAWER}
                            startIcon={<ChevronLeft size={20} />}
                            minHeight={32}
                            minWidth={140}
                            onClick={() => setIsClickedMoreTeacher(false)}
                        />
                    ) : (
                        <ScheduleJoinButton
                            className={!disabled ? classes.dialogJoinButton : undefined}
                            title={actionButtonTitle}
                            spacing={0}
                            backgroundColor={THEME_COLOR_ORG_MENU_DRAWER}
                            endIcon={<ChevronRight size={20} />}
                            disabled={disabled && !isClickedMoreTeacher}
                            minHeight={32}
                            minWidth={140}
                            onClick={onClick}
                        />
                    )}
                </Grid>
            </DialogActions>
            {isLoading && (
                <div className={classes.dialogLoadingContent}>
                    <Loading />
                </div>
            )}
        </Dialog>
    );
}
