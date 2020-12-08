import React, { useState } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import { SelectOrgDialog, useShouldSelectOrganization } from "./pages/account/selectOrgDialog";
import { Auth } from "./pages/account/auth";
import { Room } from "./pages/room/room";
import { Join } from "./pages/join/join";
import { Schedule } from "./pages/schedule/schedule";
import { Fallback } from "./pages/fallback";
import { State } from "./store/store";

export function App({ history, refresh }: {
    history: any;
    refresh: () => void;
}): JSX.Element {
    const { errCode } = useShouldSelectOrganization();
    const user = useSelector((state: State) => state.session.user);
    const [hasOrg, _] = useState(Boolean(user.organizations.length));

    if (errCode && errCode !== 401) {
        const code = `${errCode}`;
        if (code === "403" && !hasOrg) {
            return (
                <Fallback
                    errCode={code}
                    titleMsgId={"err_403_title_not_supported"}
                    subtitleMsgId={"err_403_subtitle_not_supported"}
                    descriptionMsgId={"err_403_description_not_supported"}
                />
            );
        } else {
            return (
                <Fallback
                    errCode={code}
                    titleMsgId={`err_${code}_title`}
                    subtitleMsgId={`err_${code}_subtitle`}
                />
            );
        }
    }

    return (
        <Grid
            wrap="nowrap"
            container
            direction="column"
            justify="space-between"
            style={{ height: "100%", overflow: "hidden" }}
        >
            <Router history={history}>
                <Switch>
                    <Route path="/schedule" component={Schedule} />
                    <Route path="/join" component={Join} />
                    <Route path="/room" component={Room} />
                    <Route path="/auth" render={() => <Auth refresh={refresh} useInAppBrowser={false} />} />
                    <Route path="/" component={Schedule} />
                </Switch>
            </Router>
            <SelectOrgDialog />
        </Grid>
    )
}
