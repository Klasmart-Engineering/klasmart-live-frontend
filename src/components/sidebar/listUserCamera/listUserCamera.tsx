import SortByVideoItemMapped from './SortByVideoItemMapped';
import { Session } from '@/pages/utils';
import React from 'react';

export interface ListUserCameraProps {
    users: Session[];
    minHeight?: number;
}

const ListUserCamera = ({ users, minHeight }: ListUserCameraProps) => {
    //TODO: Sort item work should be handled in parent,
    //might need to update `@kl-engineering/live-state` in order to support the below hook
    //const streams = useStreams();
    return (
        <>
            {users.map(user => (
                <SortByVideoItemMapped
                    key={user.id}
                    user={user}
                    minHeight={minHeight}
                />
            ))}
        </>
    );
};

export default ListUserCamera;
