import {createPortal} from 'react-dom';
import {
  closestCenter,
  defaultDropAnimation,
  DndContext,
  DragOverlay,
  type DropAnimation,
  MeasuringStrategy,
  type Modifier,
} from '@dnd-kit/core';
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

import type {TreeItem} from '@/shared/types';
import {getChildCount} from '@/shared/helpers/getChildCount';
import {SortableTreeItem} from '../SortableTreeItem';
import {useTreeState} from '@/shared/hooks/useTreeState.ts';
import {useTreeActions} from '@/shared/hooks/useTreeActions.ts';
import {useDragAndDrop} from '@/shared/hooks/useDragAndDrop.ts';
import {useTreeConfiguration} from '@/shared/hooks/useTreeConfiguration.ts';

const measuring = {
    droppable: {
        strategy: MeasuringStrategy.Always,
    },
};

const dropAnimationConfig: DropAnimation = {
    keyframes({transform}) {
        return [
            {opacity: 1, transform: CSS.Transform.toString(transform.initial)},
            {
                opacity: 0,
                transform: CSS.Transform.toString({
                    ...transform.final,
                    x: transform.final.x + 5,
                    y: transform.final.y + 5,
                }),
            },
        ];
    },
    easing: 'ease-out',
    sideEffects({active}) {
        active.node.animate([{opacity: 0}, {opacity: 1}], {
            duration: defaultDropAnimation.duration,
            easing: defaultDropAnimation.easing,
        });
    },
};

const adjustTranslate: Modifier = ({transform}) => {
    return {
        ...transform,
        y: transform.y - 25,
    };
};

interface Props {
    collapsible?: boolean;
    defaultItems?: TreeItem[];
    indentationWidth?: number;
    indicator?: boolean;
    removable?: boolean;
}

export function SortableTree(
    {
        collapsible,
        defaultItems,
        indicator = false,
        indentationWidth = 50,
        removable,
    }: Props) {
    const {items, setItems, flattenedItems, sortedIds} = useTreeState({defaultItems});

    const {
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
    } = useTreeActions({setItems});

    const {
        activeId,
        projected,
        activeItem,
        sensorContext,
        handleDragStart,
        handleDragMove,
        handleDragOver,
        handleDragEnd,
        handleDragCancel,
        getMovementAnnouncement,
    } = useDragAndDrop({items, setItems, flattenedItems, indentationWidth});

    const {sensors, announcements} = useTreeConfiguration({
        sensorContext,
        indicator,
        indentationWidth,
        getMovementAnnouncement,
    });

    return (
        <DndContext
            accessibility={{announcements}}
            sensors={sensors}
            collisionDetection={closestCenter}
            measuring={measuring}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
                {flattenedItems.map(({
                                         id,
                                         children,
                                         collapsed,
                                         depth,
                                         type,
                                         logicType,
                                         isLocked,
                                         isDraft,
                                         title,
                                         field,
                                         operator,
                                         value,
                                         ...rest
                                     }) => (
                    <SortableTreeItem
                        {...rest}
                        key={id}
                        id={id}
                        value={title || id.toString()}
                        depth={id === activeId && projected ? projected.depth : depth}
                        indentationWidth={indentationWidth}
                        indicator={indicator}
                        collapsed={Boolean(collapsed && children.length)}
                        type={type}
                        logicType={logicType}
                        isLocked={isLocked}
                        isDraft={isDraft}
                        title={title}
                        field={field}
                        operator={operator}
                        filterValue={value}
                        onCollapse={
                            collapsible && children.length
                                ? () => handleCollapse(id)
                                : undefined
                        }
                        onRemove={removable ? () => handleRemove(id) : undefined}
                        onTitleChange={(newTitle) => handleTitleChange(id, newTitle)}
                        onLogicTypeChange={(newType) => handleLogicTypeChange(id, newType)}
                        onLockToggle={() => handleLockToggle(id)}
                        onDraftToggle={() => handleDraftToggle(id)}
                        onAddSubgroup={() => handleAddSubgroup(id)}
                        onAddFilter={() => handleAddFilter(id)}
                        onFieldChange={(newField: string) => handleFieldChange(id, newField)}
                        onOperatorChange={(newOperator) => handleOperatorChange(id, newOperator)}
                        onValueChange={(newValue: string) => handleValueChange(id, newValue)}
                    />
                ))}
                {createPortal(
                    <DragOverlay
                        dropAnimation={dropAnimationConfig}
                        modifiers={indicator ? [adjustTranslate] : undefined}
                    >
                        {activeId && activeItem ? (
                            <SortableTreeItem
                                id={activeId}
                                depth={activeItem.depth}
                                clone
                                childCount={getChildCount(items, activeId) + 1}
                                value={activeId.toString()}
                                indentationWidth={indentationWidth}
                            />
                        ) : null}
                    </DragOverlay>,
                    document.body
                )}
            </SortableContext>
        </DndContext>
    );
}
