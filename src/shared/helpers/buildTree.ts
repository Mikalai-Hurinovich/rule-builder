import type {FlattenedItem, TreeItem} from "@/shared/types";

import {findItem} from "@/shared/helpers/findItem.ts";

export function buildTree(flattenedItems: FlattenedItem[]): TreeItem[] {
    const root: TreeItem = {
        id: 'root',
        children: [],
        type: 'item'
    };
    const nodes: Record<string, TreeItem> = {[root.id]: root};
    const items = flattenedItems.map((item) => ({...item, children: []}));

    for (const item of items) {
        const {id, children} = item;
        const parentId = item.parentId ?? root.id;
        const parent = nodes[parentId] ?? findItem(items, parentId);


        nodes[id] = {id, children, type: item.type};
        parent.children.push(item);
    }

    return root.children;
}
