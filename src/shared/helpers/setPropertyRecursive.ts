import type {TreeItem} from "../types";
import type {UniqueIdentifier} from "@dnd-kit/core";

export function setPropertyRecursive<T extends keyof TreeItem>(
    items: TreeItem[],
    id: UniqueIdentifier,
    property: T,
    setter: (value: TreeItem[T]) => TreeItem[T]
): TreeItem[] {
    return items.map(item => {
        if (item.id === id) {
            const newValue = setter(item[property]);

            return {
                ...item,
                [property]: newValue
            };
        }

        if (item.children.length) {
            return {
                ...item,
                children: setPropertyRecursive(item.children, id, property, setter)
            };
        }

        return item;
    });
}
