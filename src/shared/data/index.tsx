import type {TreeItem} from "../types";

export const initialItems: TreeItem[] = [
    {
        id: 'root-group',
        children: [
            {
                id: 'filter-1',
                children: [],
                type: 'filter',
                title: 'Фильтр 1'
            },
            {
                id: 'first-1',
                children: [],
                type: 'group',
                title: 'Первая группа'
            },
        ],
        type: 'group',
        title: 'Основная группа',
        logicType: 'AND'
    },
];
