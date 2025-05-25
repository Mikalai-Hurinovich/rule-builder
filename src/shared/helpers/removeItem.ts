import type {TreeItem} from "@/shared/types";
import type {UniqueIdentifier} from "@dnd-kit/core";

export function removeItem(items: TreeItem[], id: UniqueIdentifier) {
    const newItems = [];

    for (const item of items) {
        if (item.id === id) {
            continue;
        }

        if (item.children.length) {
            item.children = removeItem(item.children, id);
        }

        newItems.push(item);
    }

    return newItems;
}
