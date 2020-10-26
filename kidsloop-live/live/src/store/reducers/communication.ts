import { createSlice } from "@reduxjs/toolkit";

type CommunicationState = {
    inFlight: boolean; // TODO: to Array ["data key | page key"]
    failure: boolean; // TODO: 400-499
}

const initialCommunicationState: CommunicationState = {
    inFlight: false,
    failure: false,
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
        }
    }
})

export const {
    setInFlight,
    setFailure
} = communicationSlice.actions

export default communicationSlice.reducer