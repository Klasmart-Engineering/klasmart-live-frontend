import { homeFunStudiesState } from "@/app/model/appModel";
import {
    Attachment,
    HomeFunStudyFeedback,
} from "@/app/pages/schedule/home-fun-study/[scheduleId]";
import { useCallback } from "react";
import { useRecoilState } from "recoil";

export interface HomeFunStudyFeedbackId {
  userId: string;
  scheduleId: string;
}

export const useHomeFunStudies = () => {
    const [ homeFunStudies, setHomeFunStudies ] = useRecoilState(homeFunStudiesState);

    const findHomeFunStudyById = (id: HomeFunStudyFeedbackId, homeFunStudy: HomeFunStudyFeedback) => homeFunStudy.scheduleId === id.scheduleId && homeFunStudy.userId === id.userId;

    const removeHomeFunStudyById = useCallback((id: HomeFunStudyFeedbackId) => {
        console.log(`removeHomeFunStudyById`, id);
        setHomeFunStudies((homeFunStudies) => {
            return homeFunStudies.filter((homeFunStudy) => !findHomeFunStudyById(id, homeFunStudy));
        });
    }, [ setHomeFunStudies ]);

    const setHomeFunStudyAttachmentsById = useCallback((id: HomeFunStudyFeedbackId, attachments: Attachment[]) => {
        console.log(`setHomeFunStudyAttachmentsById`, id, attachments);
        setHomeFunStudies((homeFunStudies) => {
            return homeFunStudies.map((homeFunStudy) => findHomeFunStudyById(id, homeFunStudy)
                ? {
                    ...homeFunStudy,
                    status: `draft`,
                    attachments,
                }
                : homeFunStudy);
        });
    }, [ setHomeFunStudies ]);

    const setHomeFunStudyCommentById = useCallback((id: HomeFunStudyFeedbackId, comment: string) => {
        console.log(`setHomeFunStudyCommentById`, id, comment);
        setHomeFunStudies((homeFunStudies) => {
            return homeFunStudies.map((homeFunStudy) => findHomeFunStudyById(id, homeFunStudy)
                ? {
                    ...homeFunStudy,
                    status: `draft`,
                    comment,
                }
                : homeFunStudy);
        });
    }, [ setHomeFunStudies ]);

    const updateHomeFunStudyById = useCallback((id: HomeFunStudyFeedbackId, updatedHomeFunStudy: HomeFunStudyFeedback) => {
        console.log(`updateDraftHomeFunStudyById`, id, updatedHomeFunStudy);
        setHomeFunStudies((homeFunStudies) => {
            return homeFunStudies.map((homeFunStudy) => findHomeFunStudyById(id, homeFunStudy) ? updatedHomeFunStudy : homeFunStudy);
        });
    }, [ setHomeFunStudies ]);

    const createHomeFunStudy = useCallback((homeFunStudy: HomeFunStudyFeedback) => {
        console.log(`createDraftHomeFunStudyById`, homeFunStudy);
        setHomeFunStudies((homeFunStudies) => {
            return homeFunStudies.concat(homeFunStudy);
        });
        return homeFunStudy;
    }, [ setHomeFunStudies ]);

    const getHomeFunStudyById = useCallback((id: HomeFunStudyFeedbackId): HomeFunStudyFeedback | undefined => {
        console.log(`getDraftHomeFunStudyById`, id);
        return homeFunStudies.find((homeFunStudy) => findHomeFunStudyById(id, homeFunStudy));
    }, [ homeFunStudies ]);

    const clearSubmittedHomeFunStudies = useCallback((): void => {
        console.log(`clearSubmittedHomeFunStudies`);
        setHomeFunStudies((homeFunStudies) => {
            return homeFunStudies.filter((homeFunStudy) => homeFunStudy.status !== `submitted`);
        });
    }, [ homeFunStudies ]);

    return {
        removeHomeFunStudyById,
        setHomeFunStudyAttachmentsById,
        setHomeFunStudyCommentById,
        getHomeFunStudyById,
        createHomeFunStudy,
        updateHomeFunStudyById,
        clearSubmittedHomeFunStudies,
        homeFunStudies,
    };
};
