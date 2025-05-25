import {type CSSProperties, type HTMLAttributes, type MutableRefObject} from 'react';
import type {UniqueIdentifier} from '@dnd-kit/core';

export interface ActionProps extends HTMLAttributes<HTMLButtonElement> {
    active?: {
        fill: string;
        background: string;
    };
    cursor?: CSSProperties['cursor'];
    disabled?: boolean;
}

export type OperatorType = 'equals' | 'not equals' | 'is after' | 'is before'

export interface TreeItem {
    id: UniqueIdentifier;
    children: TreeItem[];
    collapsed?: boolean;
    type: 'item' | 'group' | 'filter';
    name?: string;
    logicType?: 'AND' | 'OR';
    isLocked?: boolean;
    isDisabled?: boolean;
    title?: string;
    isDraft?: boolean;
    field?: string;
    operator?: OperatorType;
    value?: string;
}

export interface FlattenedItem extends TreeItem {
    parentId: UniqueIdentifier | null;
    depth: number;
    index: number;
}

export type SensorContext = MutableRefObject<{
    items: FlattenedItem[];
    offset: number;
}>;

export interface ItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'id'> {
    childCount?: number;
    clone?: boolean;
    collapsed?: boolean;
    depth: number;
    disableInteraction?: boolean;
    disableSelection?: boolean;
    ghost?: boolean;
    handleProps?: ActionProps;
    indicator?: boolean;
    indentationWidth: number;
    value: string;
    type?: 'item' | 'group' | 'filter';
    logicType?: 'AND' | 'OR';
    isLocked?: boolean;
    isDraft?: boolean;
    title?: string;
    field?: string;
    operator?: OperatorType;
    filterValue?: string;

    onCollapse?(): void;

    onRemove?(): void;

    onTitleChange?(newTitle: string): void;

    onLogicTypeChange?(newType: 'AND' | 'OR'): void;

    onLockToggle?(): void;

    onDraftToggle?(): void;

    onAddSubgroup?(): void;

    onAddFilter?(): void;

    onFieldChange?(newField: string): void;

    onOperatorChange?(newOperator: OperatorType): void;

    onValueChange?(newValue: string): void;

    wrapperRef?(node: HTMLLIElement): void;
}
