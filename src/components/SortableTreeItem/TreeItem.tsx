import {type CSSProperties, forwardRef} from 'react';
import classNames from 'classnames';
import {GroupEditModal} from '@/components/GroupEditModal';
import {GroupItem} from './components/GroupItem';
import {FilterItem} from './components/FilterItem';
import {useTreeItemState} from '@/shared/hooks/useTreeItemState';
import {useTreeItemHandlers} from '@/shared/hooks/useTreeItemHandlers';
import styles from './TreeItem.module.css';
import type {ItemProps} from "@/shared/types";
import type {UniqueIdentifier} from '@dnd-kit/core';
import {type AnimateLayoutChanges, useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {Action, Handle, Remove} from "@/components/Item";


export const TreeItem = forwardRef<HTMLDivElement, ItemProps>((
    {
        childCount,
        clone,
        depth,
        disableSelection,
        disableInteraction,
        ghost,
        handleProps,
        indentationWidth,
        indicator,
        collapsed,
        onCollapse,
        onRemove,
        style,
        value,
        type = 'item',
        logicType = 'AND',
        isLocked = false,
        isDraft = false,
        title,
        onTitleChange,
        onLogicTypeChange,
        onLockToggle,
        onDraftToggle,
        onAddSubgroup,
        onAddFilter,
        wrapperRef,
        field,
        onFieldChange,
        operator,
        onOperatorChange,
        filterValue,
        onValueChange,
        ...props
    },
    ref
) => {
    const {isEditModalOpen, openEditModal, closeEditModal} = useTreeItemState();

    const handlers = useTreeItemHandlers({
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
    });

    const isGroup = type === 'group';
    const isFilter = type === 'filter';
    const displayTitle = title || value;

    const renderContent = () => {
        if (isGroup) {
            return (
                <GroupItem
                    title={displayTitle}
                    logicType={logicType}
                    isLocked={isLocked}
                    isDraft={isDraft}
                    onTitleClick={handlers.handleTitleClick}
                    onLogicTypeChange={handlers.handleLogicTypeChange}
                    onLockToggle={handlers.handleLockToggle!}
                    onDraftToggle={handlers.handleDraftToggle!}
                    onAddSubgroup={handlers.handleAddSubgroup!}
                    onAddFilter={handlers.handleAddFilter!}
                />
            );
        }

        if (isFilter) {
            return (
                <FilterItem
                    title={displayTitle}
                    field={field}
                    operator={operator}
                    value={filterValue}
                    isLocked={isLocked}
                    isDraft={isDraft}
                    onTitleClick={handlers.handleTitleClick}
                    onFieldChange={handlers.handleFieldChange!}
                    onOperatorChange={handlers.handleOperatorChange!}
                    onValueChange={handlers.handleValueChange!}
                />
            );
        }

        return (
            <span className={styles.Text}>
        {displayTitle}
      </span>
        );
    };

    return (
        <>
            <li
                className={classNames(
                    styles.Wrapper,
                    clone && styles.clone,
                    ghost && styles.ghost,
                    indicator && styles.indicator,
                    disableSelection && styles.disableSelection,
                    disableInteraction && styles.disableInteraction,
                    isGroup && styles.group,
                    isFilter && styles.filter,
                    isLocked && styles.locked,
                    isDraft && styles.draft
                )}
                ref={wrapperRef}
                style={{
                    '--spacing': `${indentationWidth * depth}px`,
                } as CSSProperties}
                {...props}
            >
                <div className={styles.TreeItem} ref={ref} style={style}>
                    <Handle {...handleProps} disabled={isLocked}/>
                    {onCollapse && (
                        <Action
                            onClick={onCollapse}
                            className={classNames(
                                styles.Collapse,
                                collapsed && styles.collapsed
                            )}
                            disabled={isLocked}
                        >
                            <svg width="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 41">
                                <path
                                    d="M30.76 39.2402C31.885 40.3638 33.41 40.995 35 40.995C36.59 40.995 38.115 40.3638 39.24 39.2402L68.24 10.2402C69.2998 9.10284 69.8768 7.59846 69.8494 6.04406C69.822 4.48965 69.1923 3.00657 68.093 1.90726C66.9937 0.807959 65.5106 0.178263 63.9562 0.150837C62.4018 0.123411 60.8974 0.700397 59.76 1.76024L35 26.5102L10.24 1.76024C9.10259 0.700397 7.59822 0.123411 6.04381 0.150837C4.4894 0.178263 3.00632 0.807959 1.90702 1.90726C0.807714 3.00657 0.178019 4.48965 0.150593 6.04406C0.123167 7.59846 0.700153 9.10284 1.75999 10.2402L30.76 39.2402Z"/>
                            </svg>
                        </Action>
                    )}
                    {renderContent()}
                    {!clone && onRemove && !isLocked && <Remove onClick={onRemove}/>}
                    {clone && childCount && childCount > 1 ? (
                        <span className={styles.Count}>{childCount}</span>
                    ) : null}
                </div>
            </li>
            <GroupEditModal
                isOpen={isEditModalOpen}
                title={displayTitle}
                onSave={handlers.handleTitleSave}
                onCancel={closeEditModal}
            />
        </>
    );
});


interface Props extends ItemProps {
    id: UniqueIdentifier;
}

const animateLayoutChanges: AnimateLayoutChanges = ({isSorting, wasDragging}) =>
    !(isSorting || wasDragging);

export function SortableTreeItem({id, depth, ...props}: Props) {
    const {
        attributes,
        isDragging,
        isSorting,
        listeners,
        setDraggableNodeRef,
        setDroppableNodeRef,
        transform,
        transition,
    } = useSortable({
        id,
        animateLayoutChanges,
    });
    const style: CSSProperties = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    return (
        <TreeItem
            {...props}
            ref={setDraggableNodeRef}
            wrapperRef={setDroppableNodeRef}
            style={style}
            depth={depth}
            ghost={isDragging}
            disableInteraction={isSorting}
            handleProps={{
                ...attributes,
                ...listeners,
            }}
        />
    );
}
