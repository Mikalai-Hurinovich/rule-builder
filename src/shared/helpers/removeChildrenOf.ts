import type {FlattenedItem} from "@/shared/types";
import type {UniqueIdentifier} from "@dnd-kit/core";

export function removeChildrenOf(
    items: FlattenedItem[],
    ids: UniqueIdentifier[]
) {
    const excludeParentIds = [...ids];

    return items.filter((item) => {
        if (item.parentId && excludeParentIds.includes(item.parentId)) {
            if (item.children.length) {
                excludeParentIds.push(item.id);
            }
            return false;
        }

        return true;
    });
}
