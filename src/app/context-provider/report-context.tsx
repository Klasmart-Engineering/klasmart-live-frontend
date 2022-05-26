import { useSelectedOrganizationValue, useSelectedUserValue } from "@/app/data/user/atom";
import { useAuthenticationContext } from "@/app/context-provider/authentication-context";
import {
    getAssignmentClassesSummary,
    GetAssignmentsResponse,
    getLearningOutcomes,
    ReportAssignment,
    getLiveClassesSummary,
    ReportLiveClass,
    GetLiveClassesSummaryResponse,
    useCmsApiClient,
    GetLearningOutComesResponse,
    GetAppInsightMessagesResponse,
    getAppInsightMessage
} from "@kl-engineering/cms-api-client";
import React,
{
    createContext,
    ReactChild,
    ReactChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useRecoilState } from "recoil";
import { isEmpty } from 'lodash';
import { startWeekCalendar, endWeekCalendar, randomClassState } from "@/app/model/appModel";
import { DataFilterByDates, filterDataWithDates } from "@/app/components/report/share";
import { Class } from "@/app/data/user/dto/sharedDto";
import { useLocation } from "react-router-dom";

type Props = {
    children?: ReactChild | ReactChildren | null;
}

type ReportActions = {
    onChangeWeek: (weekStart: number, weekEnd: number) => void;
}

type ReportContext = {
    startWeek: number;
    endWeek: number;
    loading: boolean;
    loadingInsightMessage: boolean;
    error: boolean;
    insightMessage?: GetAppInsightMessagesResponse;
    assignments: ReportAssignment[];
    liveClasses: ReportLiveClass[];
    learningOutcomes: GetLearningOutComesResponse[];
    learningOutcomesFilterByDates: DataFilterByDates[];
    actions?: ReportActions;
}

const ReportContext = createContext<ReportContext>({
    startWeek: 0,
    endWeek: 0,
    loading: true,
    loadingInsightMessage: true,
    error: false,
    insightMessage: undefined,
    assignments: [],
    liveClasses: [],
    learningOutcomes: [],
    learningOutcomesFilterByDates: [],
    actions: undefined,
});

const useReportData = () => {

    const [ loading, setLoading] = useState<boolean>(false);
    const [ loadingInsightMessage, setLoadingInsightMessage] = useState<boolean>(false);
    const [ error, setError ] = useState<boolean>(false);
    const [ startWeek, setStartWeek ] = useRecoilState(startWeekCalendar);
    const [ endWeek, setEndWeek ] = useRecoilState(endWeekCalendar);
    const [ insightMessage, setInsightMessage ] = useState<GetAppInsightMessagesResponse>();
    const [ assignments, setAssignments ] = useState<ReportAssignment[]>([]);
    const [ liveClasses, setLiveClasses ] = useState<ReportLiveClass[]>([]);
    const [ learningOutcomes, setLearningOutComes ] = useState<GetLearningOutComesResponse[]>([]);
    const [ learningOutcomesFilterByDates, setLearningOutcomesWithDate ] = useState<DataFilterByDates[]>([]);
    const [ randomClass, setRandomClass ] = useRecoilState<Class>(randomClassState);
    const organization = useSelectedOrganizationValue();
    const { axiosClient } = useCmsApiClient();
    const selectedUser = useSelectedUserValue();

    const organizationId = organization?.organization_id ?? ``;

    const getInsightMessage = useCallback(async () => {
        try{
        setInsightMessage(undefined);
        setLoadingInsightMessage(true);
        if(!selectedUser?.classesStudying) {
            setLoadingInsightMessage(false);
            return;
        };
        let insightMessageResponse: GetAppInsightMessagesResponse | undefined;
        const classes = selectedUser.classesStudying;
        const classesLength = classes.length;
        let classIndex = 0;
        if(isEmpty(randomClass)){
            while(insightMessageResponse === undefined && classIndex !== classesLength - 1){
                insightMessageResponse = await getAppInsightMessage(axiosClient, {
                    org_id: organizationId,
                    student_id: selectedUser?.user_id ?? ``,
                    class_id: classes[classIndex].class_id,
                    end_time: endWeek
                });
                classIndex++;
            }
            setRandomClass(classes[classIndex - 1]);
        } else {
            insightMessageResponse = await getAppInsightMessage(axiosClient, {
                org_id: organizationId,
                student_id: selectedUser?.user_id ?? ``,
                class_id: randomClass.class_id ?? ``,
                end_time: endWeek
            });
        }
        setInsightMessage(insightMessageResponse);
        } catch(err){
            setError(true);
        }
        setLoadingInsightMessage(false);
    },[ endWeek ]);

    const getAssignments = useCallback(async () => {
        try{
            const assignmenstResponse: GetAssignmentsResponse = await getAssignmentClassesSummary(axiosClient, {
                org_id: organizationId,
                year: new Date().getFullYear(),
                week_start: startWeek,
                week_end: endWeek,
                student_id: selectedUser?.user_id ?? ``,
                class_id: ``,
            });
            setAssignments(assignmenstResponse.items);
            setError(false);
            return assignmenstResponse.items;
        } catch (err){
            setAssignments([]);
            setError(true);
        }
    },[ endWeek ]);

    const getLiveClasses = useCallback(async () => {
        try{
            const liveClassesSummaryResponse: GetLiveClassesSummaryResponse = await getLiveClassesSummary(axiosClient, {
                org_id: organizationId,
                year: new Date().getFullYear(),
                week_start: startWeek,
                week_end: endWeek,
                student_id: selectedUser?.user_id ?? ``,
                class_id: ``,
            });
            setLiveClasses(liveClassesSummaryResponse.items);
            setError(false);
            return liveClassesSummaryResponse.items;
        } catch(err){
            setError(true);
            setLiveClasses([]);
        }
    },[ endWeek ]);

    const getReportData = useCallback(async () => {
        try{
            setLoading(true);
            let tempLearningOutcomes: GetLearningOutComesResponse[] = [];
            let tempLearningOutcomesWithDate: DataFilterByDates[] = []; 
            const assignments = await getAssignments();
            if(assignments && assignments.length > 0){
                const resultPromises = assignments.map(async (assignment) => {
                    let assignmentLearningOutcomes: GetLearningOutComesResponse[] = await getLearningOutcomes(axiosClient, {
                        org_id: organizationId,
                        assessment_id: assignment.assessment_id,
                        student_id: selectedUser?.user_id ?? ``,
                    });
                    if(assignmentLearningOutcomes.length > 0){
                        tempLearningOutcomes.push(...assignmentLearningOutcomes);
                        tempLearningOutcomesWithDate = filterDataWithDates(
                            tempLearningOutcomesWithDate, 
                            assignment.create_at, 
                            assignmentLearningOutcomes);
                    };
                })
                await Promise.all(resultPromises);
            }

            const liveClasses = await getLiveClasses();
            if(liveClasses && liveClasses.length > 0){
                const resultPromises = liveClasses.map(async (liveClass) => {
                    let liveClassLearningOutcomes: GetLearningOutComesResponse[] = await getLearningOutcomes(axiosClient, {
                        org_id: organizationId,
                        assessment_id: liveClass.assessment_id,
                        student_id: selectedUser?.user_id ?? ``,
                    });
                    if(liveClassLearningOutcomes.length > 0){
                        tempLearningOutcomes.push(...liveClassLearningOutcomes);
                        tempLearningOutcomesWithDate = filterDataWithDates(
                            tempLearningOutcomesWithDate, 
                            liveClass.create_at, 
                            liveClassLearningOutcomes);
                    };
                })
                await Promise.all(resultPromises);
            }

            setLearningOutComes(tempLearningOutcomes);
            setLearningOutcomesWithDate(tempLearningOutcomesWithDate);
            setError(false);
        } catch(err){
            setError(true);
            setLearningOutComes([]);
            setLearningOutcomesWithDate([]);
        }
        setLoading(false);
    },[ endWeek ]);


    const onChangeWeek = (weekStart: number, weekEnd: number) => {
        setStartWeek(weekStart);
        setEndWeek(weekEnd);
    }
    
    return {
        assignments,
        liveClasses,
        learningOutcomes,
        learningOutcomesFilterByDates,
        onChangeWeek,
        startWeek,
        endWeek,
        insightMessage,
        loading,
        loadingInsightMessage,
        getReportData,
        getInsightMessage,
        error
    };
};

export function ReportContextProvider ({ children }: Props) {

    const {
        startWeek,
        endWeek,
        onChangeWeek,
        assignments,
        liveClasses,
        insightMessage,
        learningOutcomes,
        learningOutcomesFilterByDates,
        getReportData,
        getInsightMessage,
        loading,
        loadingInsightMessage,
        error
    } = useReportData();
    const { authenticated } = useAuthenticationContext();
    const location = useLocation();
    const PARENT_DASHBOARD_LOCATION = "/report/parent-dashboard";

    useEffect(() => {
        if(location.pathname === PARENT_DASHBOARD_LOCATION){
            getInsightMessage();
        }
        getReportData();
    }, [ endWeek, authenticated ]);

    const context = useMemo<ReportContext>(() => {
        return {
            loading,
            loadingInsightMessage,
            error: false,
            assignments,
            liveClasses,
            learningOutcomes,
            learningOutcomesFilterByDates,
            startWeek,
            endWeek,
            insightMessage,
            actions: {
                onChangeWeek,
            },
        };
    }, [
        startWeek,
        error,
        assignments,
        liveClasses,
        endWeek,
        insightMessage,
        learningOutcomes,
        learningOutcomesFilterByDates,
        loading,
        loadingInsightMessage
    ]);

    return (
        <ReportContext.Provider value={context}>
            {children}
        </ReportContext.Provider >
    );
}

export function useReportContext () {
    return useContext(ReportContext);
}
