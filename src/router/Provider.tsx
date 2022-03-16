import HealthPage from "@/pages/health";
import VersionPage from "@/pages/version";
import { createHashHistory } from "history";
import React from "react";
import {
    Route,
    Router,
    Switch,
} from "react-router-dom";

const history = createHashHistory();

interface Props {
}

const RouterProvider: React.FC<Props> = (props) => {
    return (
        <Router history={history}>
            <Switch>
                <Route
                    exact
                    path="/health"
                >
                    <HealthPage/>
                </Route>
                <Route
                    exact
                    path="/version"
                >
                    <VersionPage />
                </Route>
                <Route>
                    {props.children}
                </Route>
            </Switch>
        </Router>
    );
};

export default RouterProvider;
