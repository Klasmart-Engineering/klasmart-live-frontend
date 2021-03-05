import { combineReducers, Store as ReduxStore } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import logger from "redux-logger";
import thunk from "redux-thunk";

import { Actions } from "./actions";
import control from "./reducers/control";
import session from "./reducers/session";

const persistConfig = {
    key: "kidsloop-live-web",
    storage,
};

const rootReducer = combineReducers({
    control,
    session,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// TODO my linter is highlighting this function signature. investigate!
export function createDefaultStore() {
    const store = configureStore({ reducer: persistedReducer, middleware: [thunk, logger] })
    const persistor = persistStore(store);
    return { store, persistor };
}

export type State = ReturnType<typeof rootReducer>;
export type Store = ReduxStore<State, Actions>;
