/* eslint-disable react/no-multi-comp */
import { OrganizationListItem } from "./organizationListItem";
import { ReadOrganizationDto } from "@/app/data/user/dto/readOrganizationDto";
import { MAX_PROFILE_TO_BREAK_LIST } from "@/config";
import { useWindowSize } from "@/utils/viewport";
import {
    Box,
    createStyles,
    List,
    makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import { ceil } from "lodash";
import React,
{
    useEffect,
    useRef,
    useState,
} from "react";

export enum ListOrientation {
    VERTICAL,
    HORIZONTAL
}

interface Props {
    organizations: ReadOrganizationDto[];
    selectedOrganization?: ReadOrganizationDto;
    onClick?: (organization: ReadOrganizationDto) => void;
    orientation?: ListOrientation;
}

const useStyles = makeStyles((theme) => createStyles({
    contentCenter: {
        justifyContent: `center`,
    },
    list: {
        display: `flex`,
        flexDirection: `row`,
        flexWrap: `nowrap`,
        width: `100%`,
        justifyContent: `center`,
        padding: theme.spacing(0, 3.5),
    },
    listSplit: {
        justifyContent: `flex-start`,
        paddingLeft: theme.spacing(10),
    },
    enableHorizontalScroll: {
        overflowX: `scroll`,
    },
    tabletRoot: {
        alignItems: `center`,
        justifyContent: `center`,
        flexDirection: `column`,
        flexWrap: `nowrap`,
        width: `100%`,
    },
    tabletRootSplitLists: {
        overflowX: `scroll`,
        '&::-webkit-scrollbar': {
            display: `none`,
        },
    },
    fullWidth: {
        width: `100%`,
    },
}));

export const OrganizationList: React.FC<Props> = (props: Props) => {
    const {
        organizations,
        onClick,
        selectedOrganization,
        orientation = ListOrientation.HORIZONTAL,
    } = props;

    if(orientation === ListOrientation.HORIZONTAL){
        return (
            <OrgList {...props} />
        );
    }

    return (
        <List>
            {organizations.map((organization) =>
                (
                    <OrganizationListItem
                        key={organization.organization_id}
                        organization={organization}
                        isSelected={organization.organization_id === selectedOrganization?.organization_id}
                        orientation={orientation}
                        onClick={onClick}
                    />
                ))}
        </List>
    );
};

function OrgList ({
    organizations,
    selectedOrganization,
    onClick,

}: Props) {
    const listRef = useRef<HTMLDivElement>(null);
    const classes = useStyles();
    const { width } = useWindowSize();
    const [ isUseFullWidth, setIsUseFullWidth ] = useState<boolean>(true);
    const isSplitLists = organizations.length > MAX_PROFILE_TO_BREAK_LIST;
    const lengthFirstList: number = organizations.length === MAX_PROFILE_TO_BREAK_LIST + 1
        ? MAX_PROFILE_TO_BREAK_LIST : ceil(organizations.length / 2);

    useEffect(() => {
        if(!listRef?.current?.offsetWidth) return;
        setIsUseFullWidth(listRef?.current?.offsetWidth > width);
    }, [ listRef, width ]);

    return(
        <Box className={clsx(classes.tabletRoot, {
            [classes.tabletRootSplitLists]: isSplitLists,
            [classes.fullWidth]: isUseFullWidth,
        })}
        >
            <div
                ref={listRef}
                className={clsx(classes.list, {
                    [classes.listSplit]: isSplitLists,
                })}
            >
                {organizations.slice(0, isSplitLists ? lengthFirstList : organizations.length)
                    .map((organization: ReadOrganizationDto) =>
                        (
                            <OrganizationListItem
                                key={organization.organization_id}
                                organization={organization}
                                isSelected={selectedOrganization?.organization_id === organization.organization_id}
                                onClick={onClick}
                            />
                        ))}
            </div>
            {isSplitLists && (
                <Box className={clsx(classes.list, {
                    [classes.listSplit]: isSplitLists,
                })}
                >
                    {organizations.slice(lengthFirstList)
                        .map((organization: ReadOrganizationDto) =>
                            (
                                <OrganizationListItem
                                    key={organization.organization_id}
                                    organization={organization}
                                    isSelected={selectedOrganization?.organization_id === organization.organization_id}
                                    onClick={onClick}
                                />
                            ))}
                </Box>
            )}
        </Box>
    );
}
