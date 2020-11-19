import { createSlice } from "@reduxjs/toolkit";

type SettingsState = {
    volumeVod: number;
    volumeVoice: number;
}

const initialSettingsState: SettingsState = {
    volumeVod: 0.5,
    volumeVoice: 0.5,
}

const settingsSlice = createSlice({
    name: "settings",
    initialState: initialSettingsState,
    reducers: {
        setVolumeVod(state, action) {
            return { ...state, volumeVod: action.payload }
        },
        setVolumeVoice(state, action) {
            return { ...state, volumeVoice: action.payload }
        },
    }
})

export const {
    setVolumeVod,
    setVolumeVoice,
} = settingsSlice.actions

export default settingsSlice.reducer