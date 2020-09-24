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
        },
        pushHistory(state, action) {
            let newHistory = Array.from(state.history);
            newHistory.push(action.payload);

            return { ...state, history: newHistory }
        },
        pushReplaceHistory(state, action) {
            let newHistory = [];
            for (let i = 0; i < state.history.length; ++i) {
                if (state.history[i] === action.payload) {
                    break;
                }

                newHistory.push(state.history[i]);
            }

            newHistory.push(action.payload);

            return { ...state, history: newHistory }
        },
        popHistory(state, _) {
            if (state.history.length > 0) {
                let newHistory = state.history.slice(0, state.history.length - 1);

                return { ...state, history: newHistory }
            } else {
                return state;
            }
        }
    }
})

export const {
    setDeviceOrientation,
    setHistory,
    pushHistory,
    pushReplaceHistory,
    popHistory,
} = locationSlice.actions

export default locationSlice.reducer