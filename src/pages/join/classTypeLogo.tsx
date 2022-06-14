
import KidsLoopClassTeachers from "@/assets/img/classtype/kidsloop_class_teachers.svg";
import KidsLoopLiveStudents from "@/assets/img/classtype/kidsloop_live_students.svg";
import KidsLoopLiveTeachers from "@/assets/img/classtype/kidsloop_live_teachers.svg";
import KidsLoopPreviewTeachers from "@/assets/img/classtype/kidsloop_preview_teachers.svg";
import KidsLoopReviewStudents from "@/assets/img/classtype/kidsloop_review_students.svg";
import KidsLoopStudyStudents from "@/assets/img/classtype/kidsloop_study_students.svg";
import KidsLoopLogoSvg from "@/assets/img/kidsloop.svg";
import { ClassType } from "@/store/actions";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    logo: {
        display: `block`,
        margin: `0 auto`,
        marginBottom: theme.spacing(2),
        width: `auto`,
        maxHeight: theme.spacing(3.25),
        height: theme.spacing(8),
        objectFit: `contain`,
        [theme.breakpoints.down(`sm`)]: {
            marginBottom: 0,
        },
    },
}));

interface Props {
    classType?: ClassType;
    isTeacher?: boolean;
    isReview?: boolean;
}

export default function ClassTypeLogo (props: Props): JSX.Element {
    const {
        classType,
        isTeacher = false,
        isReview = false,
    } = props;
    const classes = useStyles();

    const getImgSrc = () => {
        if (isReview) return KidsLoopReviewStudents;

        switch (classType) {
        case ClassType.LIVE:
            return isTeacher ? KidsLoopLiveTeachers : KidsLoopLiveStudents;
        case ClassType.CLASSES:
            return KidsLoopClassTeachers;
        case ClassType.PREVIEW:
            return KidsLoopPreviewTeachers;
        default:
            return KidsLoopStudyStudents;
        }
    };

    return (
        <img
            alt={`KidsLoop ${classType}`}
            src={getImgSrc()}
            className={classes.logo}
        />
    );
}
