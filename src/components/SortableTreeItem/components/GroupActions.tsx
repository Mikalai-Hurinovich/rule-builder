import {type FC} from 'react';
import classNames from 'classnames';
import styles from '../TreeItem.module.css';

interface GroupActionsProps {
    isLocked: boolean;
    isDraft: boolean;
    onLockToggle: () => void;
    onDraftToggle: () => void;
    onAddSubgroup: () => void;
    onAddFilter: () => void;
}

export const GroupActions: FC<GroupActionsProps> = (
    {
        isLocked,
        isDraft,
        onLockToggle,
        onDraftToggle,
        onAddSubgroup,
        onAddFilter
    }) => {
    return (
        <div className={styles.groupActions}>
            <button
                className={styles.actionButton}
                onClick={onAddSubgroup}
                title="Добавить подгруппу"
            >
                +Группа
            </button>
            <button
                className={styles.actionButton}
                onClick={onAddFilter}
                title="Добавить фильтр"
            >
                +Фильтр
            </button>
            <button
                className={classNames(styles.actionButton, styles.lockButton, {
                    [styles.locked]: isLocked
                })}
                onClick={onLockToggle}
                title={isLocked ? 'Разблокировать' : 'Заблокировать'}
            >
                {isLocked ? '🔒' : '🔓'}
            </button>
            <button
                className={classNames(styles.actionButton, styles.draftButton, styles.lockButton, {
                    [styles.draft]: isDraft
                })}
                onClick={onDraftToggle}
                title={isDraft ? 'Включить в логику' : 'Пометить как черновик'}
            >
                {isDraft ? '📝' : '✓'}
            </button>
        </div>
    );
};
