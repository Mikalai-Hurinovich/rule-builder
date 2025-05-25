import type {FlattenedItem, TreeItem} from "@/shared/types";
import type {UniqueIdentifier} from "@dnd-kit/core";

export function flatten(
    items: TreeItem[],
    parentId: UniqueIdentifier,
    depth = 0
): FlattenedItem[] {
    return items.reduce<FlattenedItem[]>((acc, item, index) => {
        return [
            ...acc,
            {...item, parentId, depth, index},
            ...flatten(item.children, item.id, depth + 1),
        ];
    }, []);
}
