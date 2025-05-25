import type {TreeItem} from "@/shared/types";
import type {UniqueIdentifier} from "@dnd-kit/core";
import {findItemDeep} from "@/shared/helpers/findItemDeep.ts";
import {countChildren} from "@/shared/helpers/countChildren.ts";

export function getChildCount(items: TreeItem[], id: UniqueIdentifier) {
    const item = findItemDeep(items, id);

    return item ? countChildren(item.children) : 0;
}
