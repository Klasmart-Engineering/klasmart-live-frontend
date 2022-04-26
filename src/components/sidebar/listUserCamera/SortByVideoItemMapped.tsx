import ItemUserCamera from './itemUserCamera';
import { Session } from '@/pages/utils';
import { useSessionContext } from '@/providers/session-context';
import { useStream } from '@kl-engineering/live-state/ui';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(() => ({
    myCamera: {
        order: 1,
    },
    cameraWithVideo: {
        order: 2,
    },
    cameraNoVideo: {
        order: 3,
    },
}));

interface SortByVideoItemMappedProps {
    user: Session;
}

//TODO: This component will be comebined with src/components/sidebar/listUserCamera/listUserCamera.tsx
const SortByVideoItemMapped = ({ user }: SortByVideoItemMappedProps) => {
    const classes = useStyles();
    const { video } = useStream(user.id);
    const mySession = useSessionContext();
    const isSelf = (user.id === mySession.sessionId);
    return (
        <ItemUserCamera
            user={user}
            className={clsx({
                [classes.myCamera]: isSelf,
                [classes.cameraWithVideo]: !isSelf && video.isConsumable,
                [classes.cameraNoVideo]: !isSelf && !video.isConsumable,
            })}
        />
    );
};

export default SortByVideoItemMapped;
