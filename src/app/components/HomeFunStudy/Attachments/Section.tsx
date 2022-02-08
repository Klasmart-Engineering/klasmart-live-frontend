import AttachmentsList from "@/app/components/HomeFunStudy/Attachments/List";
import SupportFileInfoDialog from "@/app/components/HomeFunStudy/SupportFileInfoDialog";
import { Attachment } from "@/app/pages/schedule/home-fun-study/[scheduleId]";
import StyledIcon from "@/components/styled/icon";
import {
    Box,
    Button,
    createStyles,
    makeStyles,
    Typography,
} from "@material-ui/core";
import { InfoOutlined as InfoOutlinedIcon } from "@material-ui/icons";
import React,
{
    useMemo,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";
import { Upload as UploadIcon } from "styled-icons/material";

const useStyles = makeStyles((theme) => createStyles({
    rounded_button: {
        borderRadius: `12px`,
        paddingTop: `10px`,
        paddingBottom: `10px`,
    },
}));

interface Props {
    canEdit: boolean;
    attachments: Attachment[];
    onClickChooseFile: () => void;
    onRemoveAttachment: (attachment: Attachment) => void;
}

const MAX_FILE_LIMIT = 3;

export default function HomeFunStudyAttachmentsSection (props: Props) {
    const {
        canEdit,
        attachments,
        onClickChooseFile,
        onRemoveAttachment,
    } = props;
    const classes = useStyles();
    const [ openSupportFileInfoDialog, setOpenSupportFileInfoDialog ] = useState(false);

    const canAddFiles = useMemo(() => {
        return attachments.length < MAX_FILE_LIMIT;
    }, [ attachments ]);

    const handleOnClickUploadInfo = () => {
        setOpenSupportFileInfoDialog(true);
    };

    return (
        <>
            <Box
                display="flex"
                alignItems="center"
            >
                <Typography
                    variant="subtitle1"
                    display="inline"
                >
                    <FormattedMessage id="homeFunStudy.uploadAssignment" />
                </Typography>
                <Box
                    ml={2}
                    display="flex"
                    justifyContent="flex-start"
                    onClick={handleOnClickUploadInfo}
                >
                    <InfoOutlinedIcon
                        color="primary"
                        fontSize="small"
                    />
                    <Box ml={1}>
                        <Typography
                            variant="caption"
                            color="primary"
                        >
                            <FormattedMessage id="homeFunStudy.info" />
                        </Typography>
                    </Box>
                </Box>
            </Box>
            {canAddFiles
                ? (
                    <Typography
                        variant="caption"
                        display="block"
                        color="textSecondary"
                    >
                        <FormattedMessage id="home_fun_study_maximum_three_files" />
                    </Typography>
                )
                : (
                    <Typography
                        variant="caption"
                        display="block"
                        color="secondary"
                    >
                        <FormattedMessage id="home_fun_study_maximum_three_files_limited" />
                    </Typography>
                )
            }
            <Box my={2}>
                <Button
                    key={`${!canAddFiles}`}
                    variant="outlined"
                    color="primary"
                    className={classes.rounded_button}
                    disabled={!canAddFiles}
                    startIcon={(
                        <StyledIcon
                            icon={<UploadIcon />}
                            size="medium"
                            color="primary"
                        />
                    )}
                    onClick={onClickChooseFile}
                >
                    <Typography variant="body2">
                        <FormattedMessage id="homeFunStudy.chooseFile" />
                    </Typography>
                </Button>
            </Box>
            <AttachmentsList
                canEdit={canEdit}
                attachments={attachments}
                onRemoveAttachment={onRemoveAttachment}
            />
            <SupportFileInfoDialog
                open={openSupportFileInfoDialog}
                onClose={() => {
                    setOpenSupportFileInfoDialog(false);
                }}
            />
        </>
    );
}
