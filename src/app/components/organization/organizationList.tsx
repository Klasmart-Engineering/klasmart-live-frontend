/* eslint-disable react/no-multi-comp */
import { OrganizationListItem } from "./organizationListItem";
import { ReadOrganizationDto } from "@/app/data/user/dto/readOrganizationDto";
import {
    MAX_PROFILE_TO_BREAK_LIST,
    MAX_PROFILE_TO_DISPLAY_CENTER,
} from "@/config";
import { useWindowSize } from "@/utils/viewport";
import {
    Box,
    createStyles,
    List,
    makeStyles,
    useMediaQuery,
    useTheme,
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
        padding: theme.spacing(0, 3.5),
    },
    enableHorizontalScroll: {
        overflowX: `scroll`,
    },
    tabletRoot: {
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        flexDirection: `column`,
        flexWrap: `nowrap`,
        width: `fit-content`,
    },
    tabletRootSplitLists: {
        overflowX: `scroll`,
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
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up(`md`));

    if(orientation === ListOrientation.HORIZONTAL){
        return (
            <>
                {isMdUp ? <OrgTabletList {...props} /> : <OrgMobileList {...props} />}
            </>
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

function OrgMobileList ({
    organizations,
    selectedOrganization,
    onClick,

}: Props) {
    const classes = useStyles();
    return(
        <Box
            className={clsx(classes.list, classes.enableHorizontalScroll, {
                [classes.contentCenter]: organizations.length <= MAX_PROFILE_TO_DISPLAY_CENTER,
            })}
        >
            {organizations.map((organization: ReadOrganizationDto) =>
                (
                    <OrganizationListItem
                        key={organization.organization_id}
                        organization={organization}
                        isSelected={selectedOrganization?.organization_id === organization.organization_id}
                        onClick={onClick}
                    />
                ))}
        </Box>
    );
}

function OrgTabletList ({
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
                className={classes.list}
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
                <Box className={classes.list}>
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
