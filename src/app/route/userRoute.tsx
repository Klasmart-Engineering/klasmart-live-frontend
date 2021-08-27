import { useUserInformation } from "../context-provider/user-information-context";
import React from "react";
import {
    Redirect,
    Route,
    RouteProps,
} from "react-router-dom";

export function UserRoute (props: RouteProps) {
    const { authenticated } = useUserInformation();

    return ( authenticated ? <Route { ...props }  /> : <Redirect to="/auth" /> );
}
