import { useSelectedOrganizationValue, useSelectedUserValue } from "../data/user/atom";
import {
    getAssignmentClassesSummary,
    GetAssignmentsResponse,
    getLearningOutcomes,
    getLiveClassesSummary,
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
    useRef,
    useState,
} from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
    startWeekCalendar,
    endWeekCalendar,
    getYearCalendar
} from "../model/appModel";
import { assesmentLearning, getDataLearning, liveClassesLearning } from "../components/parent/share";
import { setRandomClassIdState } from "@/store/layoutAtoms";
import { formatMonthDateYear } from "../utils/dateTimeUtils";
import { useIntl } from "react-intl";

type Props = {
  children?: ReactChild | ReactChildren | null;
}

type ParentsActions = {
  getClassesData: () => Promise<void>;
  onChangeWeek: (weekStart: number, weekEnd: number) => void;
}

type ParentsContext = {
  startWeek: number;
  endWeek: number;
  loading: boolean;
  error: boolean;
  insightMessageList: GetAppInsightMessagesResponse[];
  assignmentList: GetAssignmentsResponse[];
  liveClassesList: GetLiveClassesSummaryResponse[];
  learningOutComesList: LearningOutComes;
  actions?: ParentsActions;
  
}

const ParentsContext = createContext<ParentsContext>({
  startWeek: 0,
  endWeek: 0,
  loading: true,
  error: false,
  insightMessageList: [],
  assignmentList: [],
  liveClassesList: [],
  learningOutComesList: {},
  actions: undefined,
});

export interface LearningOutComes {
   [key: string]: GetLearningOutComesResponse[];
}

const useParentsData = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [ error, setError ] = useState<boolean>(false);
    const [ startWeek, setStartWeek ] = useRecoilState(startWeekCalendar);
    const [ endWeek, setEndWeek ] = useRecoilState(endWeekCalendar);
    const [ year, setYear ] = useRecoilState(getYearCalendar);
    const [ insightMessageList, setInsightMessageList ] = useState<GetAppInsightMessagesResponse[]>([]);
    const [ assignmentList, setAssignmentList ] = useState<GetAssignmentsResponse[]>([]);
    const [ liveClassesList, setLiveClassesList ] = useState<GetLiveClassesSummaryResponse[]>([]);
    const [ learningOutComes, setlearningOutComes ] = useState<LearningOutComes[]>([]);
    const organization = useSelectedOrganizationValue();
    const organizationId = organization?.organization_id ?? ``;
    const { axiosClient } = useCmsApiClient();
    const selectedUser = useSelectedUserValue();
    const getRandomClassIdState = useRecoilValue(setRandomClassIdState);
    const intl = useIntl();

    const getInsightMessage = async () => {
        const insightMessageData = Object.keys(getRandomClassIdState).length > 0 ? await getAppInsightMessage(axiosClient, {
            org_id: organizationId,
            student_id: selectedUser?.user_id ?? ``,
            class_id: getRandomClassIdState.class.id,
            end_time: endWeek
        }) : {} as GetAppInsightMessagesResponse;
        return insightMessageData;
    }

    const getAssignments = async () => {
        const assignmentsData = await getAssignmentClassesSummary(axiosClient, {
            org_id: organizationId,
            year: year,
            week_start: startWeek,
            week_end: endWeek,
            student_id: selectedUser?.user_id ?? ``,
            class_id: ``,
        });
        setAssignmentList([assignmentsData]);
        return assignmentsData;
    }

    const getLiveClasses = async () => {
        const liveClassData = await getLiveClassesSummary(axiosClient, {
            org_id: organizationId,
            year: year,
            week_start: startWeek,
            week_end: endWeek,
            student_id: selectedUser?.user_id ?? ``,
            class_id: ``,
        });
        setLiveClassesList([liveClassData]);
        return liveClassData;
    }

    const getClassesData = useCallback(async () => {
        setLoading(true);
        let arrLearningOutComes:LearningOutComes[] = [];
        const messages = await getInsightMessage();
        Object.keys(messages).length > 0 && setInsightMessageList([messages]);

        const assignmentsData = await getAssignments();
        const listOutComesFirst = await assesmentLearning(assignmentsData.items, axiosClient, organizationId, selectedUser?.user_id ?? ``);
        listOutComesFirst && listOutComesFirst.length > 0 && arrLearningOutComes.push(listOutComesFirst[0]);

        const liveClassData = await getLiveClasses();
        const listOutComesSeconds = await liveClassesLearning(liveClassData.items, axiosClient, organizationId, selectedUser?.user_id ?? ``);
        listOutComesSeconds && listOutComesSeconds.length > 0 && arrLearningOutComes.push(listOutComesSeconds[0]);

        setlearningOutComes(arrLearningOutComes);
        setLoading(false);
    }, [startWeek, endWeek]);
    
    const learningOutComesList = useMemo(() => {
        const dataLearning = getDataLearning(learningOutComes, intl)
        return dataLearning;

    }, [ learningOutComes ]);

    const onChangeWeek = (weekStart: number, weekEnd: number) => {
        setStartWeek(weekStart);
        setEndWeek(weekEnd);
        setYear(new Date(weekStart*1000).getFullYear());
    }

    useEffect(() => {
        setlearningOutComes([]);
        getClassesData();
    }, [endWeek]);
    
    return {
        assignmentList,
        liveClassesList,
        learningOutComesList,
        getClassesData,
        onChangeWeek,
        startWeek,
        endWeek,
        insightMessageList,
        loading,
        error
    };
};

export function ParentsContextProvider ({ children }: Props) {

    const {
      startWeek,
      endWeek,
      getClassesData,
      onChangeWeek,
      assignmentList,
      liveClassesList,
      learningOutComesList,
      insightMessageList,
      loading,
      error
    } = useParentsData();

    const context = useMemo<ParentsContext>(() => {
        return {
          loading: loading,
          error: false,
          assignmentList,
          liveClassesList,
          learningOutComesList,
          startWeek,
          endWeek,
          insightMessageList,
          actions: {
              getClassesData,
              onChangeWeek
          },
        };
    }, [
        startWeek,
        error,
        assignmentList,
        liveClassesList,
        endWeek,
        insightMessageList,
        learningOutComesList,
        loading
    ]);

    return (
        <ParentsContext.Provider value={context}>
            {children}
        </ParentsContext.Provider >
    );
}

export function useParentsDataContext () {
    return useContext(ParentsContext);
}
