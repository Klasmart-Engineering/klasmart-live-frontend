import { createSlice } from "@reduxjs/toolkit";
import { OrientationType } from "../actions";

type LocationState = {
    deviceOrientation: OrientationType
}

const initialLocationState: LocationState = {
    deviceOrientation: OrientationType.PORTRAIT
}

const locationSlice = createSlice({
    name: "location",
    initialState: initialLocationState,
    reducers: {
        deviceOrientation(state, action) {
            return { ...state, deviceOrientation: action.payload }
        }
    }
})

export default locationSlice.reducer