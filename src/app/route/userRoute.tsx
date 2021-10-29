import { useAuthenticationContext } from "../context-provider/authentication-context";
import React from "react";
import {
    Redirect,
    Route,
    RouteProps,
} from "react-router-dom";

export function UserRoute (props: RouteProps) {
    const { authenticated } = useAuthenticationContext();

    return ( authenticated ? <Route { ...props }  /> : <Redirect to="/auth" /> );
}
