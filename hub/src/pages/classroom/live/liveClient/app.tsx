import React, { createContext, useState } from "react";
import { IntlProvider } from "react-intl";
import { Route, Switch } from "react-router-dom";
import { en } from "./localization/en";
import {Join} from "./pages/join";
import { Room } from "./room";

export interface IUserContext {
  roomId: string;
  teacher: boolean;
  name: string;
}

export const UserContext = createContext<IUserContext>({teacher: false, roomId: "", name: ""});

export function App(): JSX.Element {

    let defaultUserContext: IUserContext = undefined as any;
    if (window.location.hostname === "localhost") {
        defaultUserContext = {teacher: false, roomId: "test-room", name: `Developer-${Math.floor(Math.random() * 100)}`};
    }
    const [userContext, setUserContext] = useState<IUserContext>(defaultUserContext);

    return (
        userContext === undefined
            ? <Join setUserContext={setUserContext}/> :
            <UserContext.Provider value={userContext}>
                <Switch>
                    <Route path="/teacher" render={() => <Room teacher={true} />} />
                    <Route render={() => <Room teacher={userContext.teacher} />} />
                </Switch>
            </UserContext.Provider>
    );
}
