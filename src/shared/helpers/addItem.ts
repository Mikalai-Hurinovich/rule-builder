import type {TreeItem} from "@/shared/types";
import type {UniqueIdentifier} from "@dnd-kit/core";

export function addItem<T extends TreeItem>(
    items: T[],
    parentId: UniqueIdentifier,
    newItem: T
): T[] {
    return items.map((item) => {
        if (item.id === parentId) {
            return {
                ...item,
                children: [...item.children, newItem],
            };
        }

        if (item.children.length) {
            return {
                ...item,
                children: addItem(item.children, parentId, newItem),
            };
        }

        return item;
    });
}
