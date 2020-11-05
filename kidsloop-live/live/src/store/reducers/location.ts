import { createSlice } from "@reduxjs/toolkit";
import { OrientationType } from "../actions";

type LocationState = {
    deviceOrientation: OrientationType,
    history: string[]
}

const initialLocationState: LocationState = {
    deviceOrientation: OrientationType.PORTRAIT,
    history: []
}

const locationSlice = createSlice({
    name: "location",
    initialState: initialLocationState,
    reducers: {
        setDeviceOrientation(state, action) {
            return { ...state, deviceOrientation: action.payload }
        },
        setHistory(state, action) {
            return { ...state, history: action.payload }
        }
    }
})

export const {
    setDeviceOrientation,
    setHistory
} = locationSlice.actions

export default locationSlice.reducer