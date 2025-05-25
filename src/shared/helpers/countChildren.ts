import type {TreeItem} from "@/shared/types";

export function countChildren(items: TreeItem[], count = 0): number {
    return items.reduce((acc, {children}) => {
        if (children.length) {
            return countChildren(children, acc + 1);
        }

        return acc + 1;
    }, count);
}
