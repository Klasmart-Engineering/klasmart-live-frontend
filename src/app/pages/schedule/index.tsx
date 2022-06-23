import { Header } from "@/app/components/layout/header";
import CategoryList from "@/app/components/Schedule/List";
import {
    useSelectedOrganizationValue,
    useSelectedUserValue,
} from "@/app/data/user/atom";
import { useShouldSelectOrganization } from "@/app/dialogs/account/selectOrgDialog";
import { useShouldSelectUser } from "@/app/dialogs/account/selectUserDialog";
import { dialogsState } from "@/app/model/appModel";
import React,
{ useEffect } from "react";
import { useRecoilState } from "recoil";

export default function SchedulePage () {
    const user = useSelectedUserValue();
    const organization = useSelectedOrganizationValue();
    const { shouldSelectUser } = useShouldSelectUser();
    const { shouldSelectOrganization } = useShouldSelectOrganization();
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);

    useEffect(() => {
        setDialogs({
            ...dialogs,
            isSelectUserOpen: shouldSelectUser,
            isSelectOrganizationOpen: !shouldSelectUser && shouldSelectOrganization,
        });
    }, [ shouldSelectUser, shouldSelectOrganization ]);

    return (
        <React.Fragment key={`${user?.user_id}-${organization?.organization_id}`}>
            <Header isHomeRoute />
            <CategoryList />
        </React.Fragment>
    );
}
