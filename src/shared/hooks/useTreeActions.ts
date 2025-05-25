import {useCallback} from 'react';
import type {UniqueIdentifier} from '@dnd-kit/core';
import type {OperatorType, TreeItem} from '@/shared/types';
import {addItem} from '@/shared/helpers/addItem.ts';
import {removeItem} from '@/shared/helpers/removeItem.ts';
import {setPropertyRecursive} from '@/shared/helpers/setPropertyRecursive.ts';

interface UseTreeActionsProps {
    setItems: React.Dispatch<React.SetStateAction<TreeItem[]>>;
}

interface UseTreeActionsReturn {
    handleTitleChange: (id: UniqueIdentifier, newTitle: string) => void;
    handleLogicTypeChange: (id: UniqueIdentifier, newType: 'AND' | 'OR') => void;
    handleLockToggle: (id: UniqueIdentifier) => void;
    handleDraftToggle: (id: UniqueIdentifier) => void;
    handleAddSubgroup: (parentId: UniqueIdentifier) => void;
    handleAddFilter: (parentId: UniqueIdentifier) => void;
    handleFieldChange: (id: UniqueIdentifier, newField: string) => void;
    handleOperatorChange: (id: UniqueIdentifier, newOperator: OperatorType) => void;
    handleValueChange: (id: UniqueIdentifier, newValue: string) => void;
    handleRemove: (id: UniqueIdentifier) => void;
    handleCollapse: (id: UniqueIdentifier) => void;
}

export function useTreeActions({setItems}: UseTreeActionsProps): UseTreeActionsReturn {
    const handleTitleChange = useCallback((id: UniqueIdentifier, newTitle: string) => {
        setItems((items) =>
            setPropertyRecursive(items, id, 'title', () => newTitle)
        );
    }, [setItems]);

    const handleLogicTypeChange = useCallback((id: UniqueIdentifier, newType: 'AND' | 'OR') => {
        setItems((items) =>
            setPropertyRecursive(items, id, 'logicType', () => newType)
        );
    }, [setItems]);

    const handleLockToggle = useCallback((id: UniqueIdentifier) => {
        setItems((items) => {
            return setPropertyRecursive(items, id, 'isLocked', (value) => !value);
        });
    }, [setItems]);

    const handleDraftToggle = useCallback((id: UniqueIdentifier) => {
        setItems((items) =>
            setPropertyRecursive(items, id, 'isDraft', (value) => !value)
        );
    }, [setItems]);

    const handleAddSubgroup = useCallback((parentId: UniqueIdentifier) => {
        const newGroup: TreeItem = {
            id: `group-${Date.now()}`,
            children: [],
            type: 'group',
            title: 'Новая группа',
            logicType: 'AND'
        };
        setItems((items) => addItem(items, parentId, newGroup));
    }, [setItems]);

    const handleAddFilter = useCallback((parentId: UniqueIdentifier) => {
        const newFilter: TreeItem = {
            id: `filter-${Date.now()}`,
            children: [],
            type: 'filter',
            title: 'Новый фильтр',
            field: '',
            operator: 'equals',
            value: ''
        };
        setItems((items) => addItem(items, parentId, newFilter));
    }, [setItems]);

    const handleFieldChange = useCallback((id: UniqueIdentifier, newField: string) => {
        setItems((items) =>
            setPropertyRecursive(items, id, 'field', () => newField)
        );
    }, [setItems]);

    const handleOperatorChange = useCallback((id: UniqueIdentifier, newOperator: OperatorType) => {
        setItems((items) =>
            setPropertyRecursive(items, id, 'operator', () => newOperator)
        );
    }, [setItems]);

    const handleValueChange = useCallback((id: UniqueIdentifier, newValue: string) => {
        setItems((items) =>
            setPropertyRecursive(items, id, 'value', () => newValue)
        );
    }, [setItems]);

    const handleRemove = useCallback((id: UniqueIdentifier) => {
        setItems((items) => removeItem(items, id));
    }, [setItems]);

    const handleCollapse = useCallback((id: UniqueIdentifier) => {
        setItems((prevItems) => {
            const newItems = structuredClone(prevItems);

            const updateCollapsed = (items: TreeItem[]): TreeItem[] => {
                return items.map(item => {
                    if (item.id === id) {
                        return {
                            ...item,
                            collapsed: !item.collapsed
                        };
                    }

                    if (item.children.length) {
                        return {
                            ...item,
                            children: updateCollapsed(item.children)
                        };
                    }

                    return item;
                });
            };

            return updateCollapsed(newItems);
        });
    }, [setItems]);

    return {
        handleTitleChange,
        handleLogicTypeChange,
        handleLockToggle,
        handleDraftToggle,
        handleAddSubgroup,
        handleAddFilter,
        handleFieldChange,
        handleOperatorChange,
        handleValueChange,
        handleRemove,
        handleCollapse,
    };
}
