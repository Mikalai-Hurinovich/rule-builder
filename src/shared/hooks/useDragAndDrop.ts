import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {arrayMove} from '@dnd-kit/sortable';
import type {DragEndEvent, DragMoveEvent, DragOverEvent, DragStartEvent, UniqueIdentifier,} from '@dnd-kit/core';
import type {FlattenedItem, SensorContext, TreeItem} from '@/shared/types';
import {getProjection} from '@/shared/helpers/getProjection.ts';
import {flattenTree} from '@/shared/helpers/flattenTree.ts';
import {buildTree} from '@/shared/helpers/buildTree.ts';

interface UseDragAndDropProps {
    items: TreeItem[];
    setItems: React.Dispatch<React.SetStateAction<TreeItem[]>>;
    flattenedItems: FlattenedItem[];
    indentationWidth: number;
}

interface UseDragAndDropReturn {
    activeId: UniqueIdentifier | null;
    overId: UniqueIdentifier | null;
    offsetLeft: number;
    currentPosition: { parentId: UniqueIdentifier | null; overId: UniqueIdentifier } | null;
    projected: ReturnType<typeof getProjection>;
    activeItem: FlattenedItem | null;
    sensorContext: SensorContext;
    handleDragStart: (event: DragStartEvent) => void;
    handleDragMove: (event: DragMoveEvent) => void;
    handleDragOver: (event: DragOverEvent) => void;
    handleDragEnd: (event: DragEndEvent) => void;
    handleDragCancel: () => void;
    getMovementAnnouncement: (eventName: string, activeId: UniqueIdentifier, overId?: UniqueIdentifier) => string | undefined;
}

export function useDragAndDrop({
                                   items,
                                   setItems,
                                   flattenedItems,
                                   indentationWidth,
                               }: UseDragAndDropProps): UseDragAndDropReturn {
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
    const [offsetLeft, setOffsetLeft] = useState(0);
    const [currentPosition, setCurrentPosition] = useState<{
        parentId: UniqueIdentifier | null;
        overId: UniqueIdentifier;
    } | null>(null);

    const projected = useMemo(() => {
        return getProjection(
            flattenedItems,
            activeId !,
            overId!,
            offsetLeft,
            indentationWidth
        )

    }, [activeId, overId, flattenedItems, offsetLeft, indentationWidth]);

    const sensorContext: SensorContext = useRef({
        items: flattenedItems,
        offset: offsetLeft,
    });

    const activeItem = useMemo(() => {
        return activeId ? flattenedItems.find(({id}) => id === activeId) : null;
    }, [activeId, flattenedItems]) as FlattenedItem;

    useEffect(() => {
        sensorContext.current = {
            items: flattenedItems,
            offset: offsetLeft,
        };
    }, [flattenedItems, offsetLeft]);

    const resetState = useCallback(() => {
        setOverId(null);
        setActiveId(null);
        setOffsetLeft(0);
        setCurrentPosition(null);
        document.body.style.setProperty('cursor', '');
    }, []);

    const handleDragStart = useCallback(({active: {id: activeId}}: DragStartEvent) => {
        setActiveId(activeId);
        setOverId(activeId);

        const activeItem = flattenedItems.find(({id}) => id === activeId) as FlattenedItem;

        if (activeItem) {
            setCurrentPosition({
                parentId: activeItem.parentId,
                overId: activeId,
            });
        }

        document.body.style.setProperty('cursor', 'grabbing');
    }, [flattenedItems]);

    const handleDragMove = useCallback(({delta}: DragMoveEvent) => {
        setOffsetLeft(delta.x);
    }, []);

    const handleDragOver = useCallback(({over}: DragOverEvent) => {
        setOverId(over?.id ?? null);
    }, []);

    const handleDragEnd = useCallback(({active, over}: DragEndEvent) => {
        resetState();

        if (projected && over) {
            const {depth, parentId} = projected;
            const clonedItems: FlattenedItem[] = JSON.parse(
                JSON.stringify(flattenTree(items))
            );
            const overIndex = clonedItems.findIndex(({id}) => id === over.id);
            const activeIndex = clonedItems.findIndex(({id}) => id === active.id);
            const activeTreeItem = clonedItems[activeIndex];

            clonedItems[activeIndex] = {...activeTreeItem, depth, parentId};

            const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
            const newItems = buildTree(sortedItems);

            setItems(newItems);
        }
    }, [resetState, projected, items, setItems]);

    const handleDragCancel = useCallback(() => {
        resetState();
    }, [resetState]);

    const getMovementAnnouncement = useCallback((eventName: string, activeId: UniqueIdentifier, overId?: UniqueIdentifier) => {
        if (overId && projected) {
            if (eventName !== 'onDragEnd') {
                if (
                    currentPosition &&
                    projected.parentId === currentPosition.parentId &&
                    overId === currentPosition.overId
                ) {
                    return;
                } else {
                    setCurrentPosition({
                        parentId: projected.parentId,
                        overId,
                    });
                }
            }

            const clonedItems: FlattenedItem[] = flattenTree(items);

            const overIndex = clonedItems.findIndex(({id}) => id === overId);
            const activeIndex = clonedItems.findIndex(({id}) => id === activeId);
            const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);

            const previousItem = sortedItems[overIndex - 1];

            let announcement;
            const movedVerb = eventName === 'onDragEnd' ? 'dropped' : 'moved';
            const nestedVerb = eventName === 'onDragEnd' ? 'dropped' : 'nested';

            if (!previousItem) {
                const nextItem = sortedItems[overIndex + 1];
                announcement = `${activeId} was ${movedVerb} before ${nextItem.id}.`;
            } else {
                if (projected.depth > previousItem.depth) {
                    announcement = `${activeId} was ${nestedVerb} under ${previousItem.id}.`;
                } else {
                    let previousSibling: FlattenedItem | undefined = previousItem;
                    while (previousSibling && projected.depth < previousSibling.depth) {
                        const parentId: UniqueIdentifier | null = previousSibling.parentId;
                        previousSibling = sortedItems.find(({id}) => id === parentId);
                    }

                    if (previousSibling) {
                        announcement = `${activeId} was ${movedVerb} after ${previousSibling.id}.`;
                    }
                }
            }

            return announcement;
        }

        return;
    }, [projected, currentPosition, items]);

    return {
        activeId,
        overId,
        offsetLeft,
        currentPosition,
        projected,
        activeItem,
        sensorContext,
        handleDragStart,
        handleDragMove,
        handleDragOver,
        handleDragEnd,
        handleDragCancel,
        getMovementAnnouncement,
    };
}
