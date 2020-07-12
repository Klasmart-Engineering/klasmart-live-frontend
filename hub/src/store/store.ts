import LogRocket from "logrocket";
import { applyMiddleware, combineReducers, createStore, Store as ReduxStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { Actions } from "./actions";
import { account, postAuthorizationRoute, ui } from "./reducers";

const persistConfig = {
    key: "root",
    storage,
};

const rootReducer = combineReducers({
    account,
    postAuthorizationRoute,
    ui,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export function createDefaultStore() {
    const store = createStore(persistedReducer, applyMiddleware(LogRocket.reduxMiddleware()));
    const persistor = persistStore(store);
    return { store, persistor };
}

export type State = ReturnType<typeof rootReducer>;
export type Store = ReduxStore<State, Actions>;
