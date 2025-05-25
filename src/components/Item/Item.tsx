import {type CSSProperties, forwardRef, memo, type ReactElement, type ReactNode, type Ref, useEffect} from 'react';
import classNames from 'classnames';
import type {DraggableSyntheticListeners} from '@dnd-kit/core';
import type {Transform} from '@dnd-kit/utilities';

import {Handle, Remove} from './components';

import styles from './Item.module.css';

export interface Props {
    dragOverlay?: boolean;
    color?: string;
    disabled?: boolean;
    dragging?: boolean;
    handle?: boolean;
    handleProps?: any;
    height?: number;
    index?: number;
    fadeIn?: boolean;
    transform?: Transform | null;
    listeners?: DraggableSyntheticListeners;
    sorting?: boolean;
    style?: CSSProperties;
    transition?: string | null;
    wrapperStyle?: CSSProperties;
    value: ReactNode;

    onRemove?(): void;

    renderItem?(args: {
        dragOverlay: boolean;
        dragging: boolean;
        sorting: boolean;
        index: number | undefined;
        fadeIn: boolean;
        listeners: DraggableSyntheticListeners;
        ref: Ref<HTMLElement>;
        style: CSSProperties | undefined;
        transform: Props['transform'];
        transition: Props['transition'];
        value: Props['value'];
    }): ReactElement;
}

export const Item = memo(
    forwardRef<HTMLLIElement, Props>(
        (
            {
                color,
                dragOverlay,
                dragging,
                disabled,
                fadeIn,
                handle,
                handleProps,
                index,
                listeners,
                onRemove,
                renderItem,
                sorting,
                style,
                transition,
                transform,
                value,
                ...props
            },
            ref
        ) => {
            useEffect(() => {
                if (!dragOverlay) {
                    return;
                }

                document.body.style.cursor = 'grabbing';

                return () => {
                    document.body.style.cursor = '';
                };
            }, [dragOverlay]);

            return renderItem ? (
                renderItem({
                    dragOverlay: Boolean(dragOverlay),
                    dragging: Boolean(dragging),
                    sorting: Boolean(sorting),
                    index,
                    fadeIn: Boolean(fadeIn),
                    listeners,
                    ref,
                    style,
                    transform,
                    transition,
                    value,
                })
            ) : (
                <li
                    className={classNames(
                        styles.Wrapper,
                        fadeIn && styles.fadeIn,
                        sorting && styles.sorting,
                        dragOverlay && styles.dragOverlay
                    )}

                    ref={ref}
                >
                    <div
                        className={classNames(
                            styles.Item,
                            dragging && styles.dragging,
                            handle && styles.withHandle,
                            dragOverlay && styles.dragOverlay,
                            disabled && styles.disabled,
                            color && styles.color
                        )}
                        style={style}
                        data-cypress="draggable-item"
                        {...(!handle ? listeners : undefined)}
                        {...props}
                        tabIndex={!handle ? 0 : undefined}
                    >
                        {value}
                        <span className={styles.Actions}>
              {onRemove ? (
                  <Remove className={styles.Remove} onClick={onRemove}/>
              ) : null}
                            {handle ? <Handle {...handleProps} {...listeners} /> : null}
            </span>
                    </div>
                </li>
            );
        }
    )
);
