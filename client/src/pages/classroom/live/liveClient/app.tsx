import React, { createContext, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { Join } from "./pages/join";
import { Room } from "./room";

export interface IUserContext {
  roomId: string;
  teacher: boolean;
  name: string;
}

export const UserContext = createContext<IUserContext>({teacher: false, roomId: "", name: ""});

export function App(): JSX.Element {

    const [userContext, setUserContext] = useState<IUserContext>();

    return (
        userContext === undefined
            ? <Join setUserContext={setUserContext}/>
            : <Layout>
                <UserContext.Provider value={userContext}>
                    <Switch>
                        <Route path="/teacher" render={() => <Room teacher={true} />} />
                        <Route render={() => <Room teacher={userContext.teacher} />} />
                    </Switch>
                </UserContext.Provider>
            </Layout>
    );
}
