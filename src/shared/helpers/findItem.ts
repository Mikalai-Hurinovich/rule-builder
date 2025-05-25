import type {TreeItem} from "@/shared/types";
import type {UniqueIdentifier} from "@dnd-kit/core";

export function findItem(items: TreeItem[], itemId: UniqueIdentifier) {
    return items.find(({id}) => id === itemId);
}
