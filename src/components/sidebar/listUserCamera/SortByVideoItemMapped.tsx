import ItemUserCamera from './itemUserCamera';
import { Session } from '@/pages/utils';
import React from 'react';

interface SortByVideoItemMappedProps {
    user: Session;
    minHeight?: number;
}

//TODO: This component will be comebined with src/components/sidebar/listUserCamera/listUserCamera.tsx
const SortByVideoItemMapped = ({ user, minHeight }: SortByVideoItemMappedProps) => {
    return (
        <ItemUserCamera
            user={user}
            minHeight={minHeight}
        />
    );
};

export default SortByVideoItemMapped;
