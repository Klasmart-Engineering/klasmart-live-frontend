import SortByVideoItemMapped from './SortByVideoItemMapped';
import { Session } from '@/pages/utils';
import React from 'react';

export interface ListUserCameraProps {
    users: Session[];
}

const ListUserCamera = (props: ListUserCameraProps) => {
    //TODO: Sort item work should be handled in parent, 
    //might need to update `@kl-engineering/live-state` in order to support the below hook
    //const streams = useStreams();
    return (
        <>
            {props.users.map(user => (
                <SortByVideoItemMapped
                    key={user.id}
                    user={user}
                />
            ))}
        </>
    );
};

export default ListUserCamera;
