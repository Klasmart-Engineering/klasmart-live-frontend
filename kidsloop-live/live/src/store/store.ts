import LogRocket from "logrocket";
import { applyMiddleware, combineReducers, createStore, Store as ReduxStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { Actions } from "./actions";
import { data, communication, control, session, location } from "./reducers";

const persistConfig = {
    key: "live",
    storage,
};

const rootReducer = combineReducers({
    data,
    communication,
    control,
    session,
    location
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export function createDefaultStore() {
    const store = createStore(persistedReducer, applyMiddleware(LogRocket.reduxMiddleware()));
    const persistor = persistStore(store);
    return { store, persistor };
}

export type State = ReturnType<typeof rootReducer>;
export type Store = ReduxStore<State, Actions>;
