import {useMemo, useState} from 'react';
import {type Announcements, KeyboardSensor, PointerSensor, useSensor, useSensors,} from '@dnd-kit/core';
import type {SensorContext} from '@/shared/types';
import {sortableTreeKeyboardCoordinates} from '@/shared/helpers/keyboardCoordinates.ts';

interface UseTreeConfigurationProps {
    sensorContext: SensorContext;
    indicator: boolean;
    indentationWidth: number;
    getMovementAnnouncement: (eventName: string, activeId: any, overId?: any) => string | undefined;
}

interface UseTreeConfigurationReturn {
    sensors: ReturnType<typeof useSensors>;
    announcements: Announcements;
}

export function useTreeConfiguration({
                                         sensorContext,
                                         indicator,
                                         indentationWidth,
                                         getMovementAnnouncement,
                                     }: UseTreeConfigurationProps): UseTreeConfigurationReturn {
    const [coordinateGetter] = useState(() =>
        sortableTreeKeyboardCoordinates(sensorContext, indicator, indentationWidth)
    );

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter,
        })
    );

    const announcements: Announcements = useMemo(() => ({
        onDragStart({active}) {
            return `Picked up ${active.id}.`;
        },
        onDragMove({active, over}) {
            return getMovementAnnouncement('onDragMove', active.id, over?.id);
        },
        onDragOver({active, over}) {
            return getMovementAnnouncement('onDragOver', active.id, over?.id);
        },
        onDragEnd({active, over}) {
            return getMovementAnnouncement('onDragEnd', active.id, over?.id);
        },
        onDragCancel({active}) {
            return `Moving was cancelled. ${active.id} was dropped in its original position.`;
        },
    }), [getMovementAnnouncement]);

    return {
        sensors,
        announcements,
    };
}
