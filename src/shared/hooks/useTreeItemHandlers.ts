import {useCallback} from 'react';
import {type OperatorType} from '@/shared/types';

interface UseTreeItemHandlersProps {
    isLocked: boolean;
    onTitleChange?: (title: string) => void;
    onLogicTypeChange?: (type: 'AND' | 'OR') => void;
    onLockToggle?: () => void;
    onDraftToggle?: () => void;
    onAddSubgroup?: () => void;
    onAddFilter?: () => void;
    onFieldChange?: (field: string) => void;
    onOperatorChange?: (operator: OperatorType) => void;
    onValueChange?: (value: string) => void;
    openEditModal: () => void;
    closeEditModal: () => void;
}

export const useTreeItemHandlers = (
    {
        isLocked,
        onTitleChange,
        onLogicTypeChange,
        onLockToggle,
        onDraftToggle,
        onAddSubgroup,
        onAddFilter,
        onFieldChange,
        onOperatorChange,
        onValueChange,
        openEditModal,
        closeEditModal
    }: UseTreeItemHandlersProps) => {
    const handleTitleClick = useCallback(() => {
        if (!isLocked && onTitleChange) {
            openEditModal();
        }
    }, [isLocked, onTitleChange, openEditModal]);

    const handleTitleSave = useCallback((newTitle: string) => {
        onTitleChange?.(newTitle);
        closeEditModal();
    }, [onTitleChange, closeEditModal]);

    const handleLogicTypeChange = useCallback((newType: 'AND' | 'OR') => {
        onLogicTypeChange?.(newType);
    }, [onLogicTypeChange]);

    return {
        handleTitleClick,
        handleTitleSave,
        handleLogicTypeChange,
        handleLockToggle: onLockToggle,
        handleDraftToggle: onDraftToggle,
        handleAddSubgroup: onAddSubgroup,
        handleAddFilter: onAddFilter,
        handleFieldChange: onFieldChange,
        handleOperatorChange: onOperatorChange,
        handleValueChange: onValueChange
    };
};
