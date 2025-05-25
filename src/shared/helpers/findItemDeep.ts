import type {TreeItem} from "@/shared/types";
import type {UniqueIdentifier} from "@dnd-kit/core";

export function findItemDeep(
    items: TreeItem[],
    itemId: UniqueIdentifier
): TreeItem | undefined {
    for (const item of items) {
        const {id, children} = item;

        if (id === itemId) {
            return item;
        }

        if (children.length) {
            const child = findItemDeep(children, itemId);

            if (child) {
                return child;
            }
        }
    }

    return undefined;
}
