import type {FlattenedItem} from "@/shared/types";
import type {UniqueIdentifier} from "@dnd-kit/core";
import {arrayMove} from "@dnd-kit/sortable";
import {getDragDepth} from "@/shared/helpers/getDragDepth.ts";

export function getProjection(
    items: FlattenedItem[],
    activeId: UniqueIdentifier,
    overId: UniqueIdentifier,
    dragOffset: number,
    indentationWidth: number
) {
    const overItemIndex = items.findIndex(({id}) => id === overId);
    const activeItemIndex = items.findIndex(({id}) => id === activeId);
    const activeItem = items[activeItemIndex];
    const newItems = arrayMove(items, activeItemIndex, overItemIndex);
    const previousItem = newItems[overItemIndex - 1];
    const nextItem = newItems[overItemIndex + 1];
    const dragDepth = getDragDepth(dragOffset, indentationWidth);
    const projectedDepth = activeItem?.depth + dragDepth;
    const maxDepth = getMaxDepth({
        previousItem,
    });
    const minDepth = getMinDepth({nextItem});
    let depth = projectedDepth;

    if (projectedDepth >= maxDepth) {
        depth = maxDepth;
    } else if (projectedDepth < minDepth) {
        depth = minDepth;
    }

    return {depth, maxDepth, minDepth, parentId: getParentId()};

    function getParentId() {
        if (depth === 0 || !previousItem) {
            return null;
        }

        if (depth === previousItem.depth) {
            return previousItem.parentId;
        }

        if (depth > previousItem.depth) {
            return previousItem.id;
        }

        const newParent = newItems
            .slice(0, overItemIndex)
            .reverse()
            .find((item) => item.depth === depth)?.parentId;

        return newParent ?? null;
    }
}

function getMaxDepth({previousItem}: { previousItem: FlattenedItem }) {
    if (previousItem) {
        return previousItem.depth + 1;
    }

    return 0;
}

function getMinDepth({nextItem}: { nextItem: FlattenedItem }) {
    if (nextItem) {
        return nextItem.depth;
    }

    return 0;
}
