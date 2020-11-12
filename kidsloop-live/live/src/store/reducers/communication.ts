import { createSlice } from "@reduxjs/toolkit";

type CommunicationState = {
    inFlight: boolean; // TODO: to Array ["data key | page key"]
    failure: boolean; // TODO: 400-499
    errCode: number | null;
}

const initialCommunicationState: CommunicationState = {
    inFlight: false,
    failure: false,
    errCode: null,
}

const communicationSlice = createSlice({
    name: "communication",
    initialState: initialCommunicationState,
    reducers: {
        setInFlight(state, action) {
            return { ...state, inFlight: action.payload }
        },
        setFailure(state, action) {
            return { ...state, failure: action.payload }
        },
        setErrCode(state, action) {
            return { ...state, errCode: action.payload }
        }
    }
})

export const {
    setInFlight,
    setFailure,
    setErrCode
} = communicationSlice.actions

export default communicationSlice.reducer