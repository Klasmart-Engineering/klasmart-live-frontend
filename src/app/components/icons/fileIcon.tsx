import { Badge } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { InsertDriveFile } from "@material-ui/icons";
import React from "react";

const useStyles = makeStyles({
    badge_text: {
        color: `white`,
        fontSize: `xx-small`,
        height: `12px`,
        fontFamily: `Roboto`,
        paddingLeft: `5px`,
        paddingRight: `5px`,
    },
    badgeAnchorOriginBottomRightRectangle: {
        right: 0,
        bottom: 0,
        transform: `scale(1) translate(5%, -50%)`,
    },
    image_badge: {
        backgroundColor: `#CE36C8`,
    },
    video_badge: {
        backgroundColor: `#CE9136`,
    },
    audio_badge: {
        backgroundColor: `#00b8d4`,
    },
    doc_badge: {
        backgroundColor: `#174fb0`,
    },
    doc_2_badge: {
        backgroundColor: `#c50709`,
    },
    doc_3_badge: {
        backgroundColor: `#0f773e`,
    },
    other_badge: {
        backgroundColor: `black`,
    },
});

const FileType = {
    IMAGE: [
        `jpg`,
        `jpeg`,
        `png`,
        `gif`,
        `bmp`,
    ],
    VIDEO: [
        `avi`,
        `mov`,
        `mp4`,
    ],
    AUDIO: [ `mp3`, `wav` ],
    DOC: [ `doc`, `docx` ],
    DOC2: [
        `ppt`,
        `pptx`,
        `pdf`,
    ],
    DOC3: [ `xls`, `xlsx` ],
};

interface Props {
    fileType?: string;
}

export function FileIcon (props: Props): JSX.Element {
    const classes = useStyles();

    function generateFileBadge (fileType: string): string {
        if (FileType.IMAGE.includes(fileType)) {
            return classes.image_badge;
        } else if (FileType.VIDEO.includes(fileType)) {
            return classes.video_badge;
        } else if (FileType.AUDIO.includes(fileType)) {
            return classes.audio_badge;
        } else if (FileType.DOC.includes(fileType)) {
            return classes.doc_badge;
        } else if (FileType.DOC2.includes(fileType)) {
            return classes.doc_2_badge;
        } else if (FileType.DOC3.includes(fileType)) {
            return classes.doc_3_badge;
        } else {
            return classes.other_badge;
        }
    }

    return (
        <Badge
            anchorOrigin={{
                vertical: `bottom`,
                horizontal: `right`,
            }}
            color="primary"
            classes={{
                colorPrimary: generateFileBadge(props.fileType ? props.fileType : ``),
                badge: classes.badge_text,
                anchorOriginBottomRightRectangle: classes.badgeAnchorOriginBottomRightRectangle,
            }}
            badgeContent={props.fileType}
        >
            <InsertDriveFile fontSize="large" />
        </Badge>
    );
}
