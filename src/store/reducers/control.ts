import { createSlice } from "@reduxjs/toolkit";

type ControlState = {
    themeMode: "light" | "dark";
    selectOrgDialogOpen: boolean;
    drawerOpen: boolean;
    drawerWidth: number;
    drawerTabIndex: number;
    colsCamera: 1 | 2 | 3 | 4;
    colsObserve: 2 | 4 | 6;
    contentIndex: number;
}

const initialControlState: ControlState = {
    themeMode: "light",
    selectOrgDialogOpen: false,
    drawerOpen: true,
    drawerWidth: 0,
    drawerTabIndex: 0,
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
        setSelectOrgDialogOpen(state, action) {
            return { ...state, selectOrgDialogOpen: action.payload }
        },
        setDrawerOpen(state, action) {
            return { ...state, drawerOpen: action.payload }
        },
        setDrawerWidth(state, action) {
            return { ...state, drawerWidth: action.payload }
        },
        setDrawerTabIndex(state, action) {
            return { ...state, drawerTabIndex: action.payload }
        },
        setColsCamera(state, action) {
            return { ...state, colsCamera: action.payload }
        },
        setColsObserve(state, action) {
            return { ...state, colsObserve: action.payload }
        },
        setContentIndex(state, action) {
            return { ...state, contentIndex: action.payload }
        },
    }
})

export const {
    setThemeMode,
    setSelectOrgDialogOpen,
    setDrawerOpen,
    setDrawerWidth,
    setDrawerTabIndex,
    setColsCamera,
    setColsObserve,
    setContentIndex,
} = controlSlice.actions

export default controlSlice.reducer