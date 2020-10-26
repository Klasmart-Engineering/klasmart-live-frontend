import { createSlice } from "@reduxjs/toolkit";

type ControlState = {
    themeMode: "light" | "dark";
    drawerOpen: boolean;
    drawerWidth: number;
    colsCamera: 1 | 2 | 3 | 4;
    colsObserve: 2 | 4 | 6;
    contentIndex: number;
}

const initialControlState: ControlState = {
    themeMode: "light",
    drawerOpen: true,
    drawerWidth: 0,
    colsCamera: 2,
    colsObserve: 2,
    contentIndex: 0,
}

const controlSlice = createSlice({
    name: "control",
    initialState: initialControlState,
    reducers: {
        setThemeMode(state, action) {
            return { ...state, themeMode: action.payload }
        },
        setDrawerOpen(state, action) {
            return { ...state, drawerOpen: action.payload }
        },
        setDrawerWidth(state, action) {
            return { ...state, drawerWidth: action.payload }
        },
        setColsCamera(state, action) {
            return { ...state, colsCamera: action.payload }
        },
        setColsObserve(state, action) {
            return { ...state, colsObserve: action.payload }
        },
        setContentIndex(state, action) {
            return { ...state, contentIndex: action.payload }
        }
    }
})

export const {
    setThemeMode,
    setDrawerOpen,
    setDrawerWidth,
    setColsCamera,
    setColsObserve,
    setContentIndex
} = controlSlice.actions

export default controlSlice.reducer