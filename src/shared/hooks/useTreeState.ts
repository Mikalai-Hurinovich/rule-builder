import {type Dispatch, type SetStateAction, useMemo, useState} from 'react';
import type {UniqueIdentifier} from '@dnd-kit/core';
import type {FlattenedItem, TreeItem} from '@/shared/types';
import {flattenTree} from '@/shared/helpers/flattenTree.ts';
import {removeChildrenOf} from '@/shared/helpers/removeChildrenOf.ts';
import {initialItems} from '@/shared/data';

interface UseTreeStateProps {
    defaultItems?: TreeItem[];
}

interface UseTreeStateReturn {
    items: TreeItem[];
    setItems: Dispatch<SetStateAction<TreeItem[]>>;
    flattenedItems: FlattenedItem[];
    sortedIds: UniqueIdentifier[];
}

export function useTreeState({defaultItems = initialItems}: UseTreeStateProps = {}): UseTreeStateReturn {
    const [items, setItems] = useState<TreeItem[]>(() => defaultItems);

    const flattenedItems = useMemo(() => {
        const flattenedTree = flattenTree(items);
        const collapsedItems = flattenedTree.reduce<string[]>(
            (acc, {children, collapsed, id}) =>
                collapsed && children.length ? [...acc, id.toString()] : acc,
            []
        );

        return removeChildrenOf(flattenedTree, collapsedItems);
    }, [items]);

    const sortedIds = useMemo(
        () => flattenedItems.map(({id}) => id),
        [flattenedItems]
    );

    return {
        items,
        setItems,
        flattenedItems,
        sortedIds,
    };
}
