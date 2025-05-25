import type {FlattenedItem, TreeItem} from "@/shared/types";
import {flatten} from "@/shared/helpers/flatten.ts";
import type {UniqueIdentifier} from "@dnd-kit/core";

export function flattenTree(items: TreeItem[]): FlattenedItem[] {
    return flatten(items, undefined as unknown as UniqueIdentifier);
}
