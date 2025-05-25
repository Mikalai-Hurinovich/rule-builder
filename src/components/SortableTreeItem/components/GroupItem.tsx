import {type FC} from 'react';
import classNames from 'classnames';
import styles from '../TreeItem.module.css';
import {LogicToggle} from './LogicToggle';
import {GroupActions} from './GroupActions';

interface GroupItemProps {
    title: string;
    logicType: 'AND' | 'OR';
    isLocked: boolean;
    isDraft: boolean;
    onTitleClick: () => void;
    onLogicTypeChange: (type: 'AND' | 'OR') => void;
    onLockToggle: () => void;
    onDraftToggle: () => void;
    onAddSubgroup: () => void;
    onAddFilter: () => void;
}

export const GroupItem: FC<GroupItemProps> = (
    {
        title,
        logicType,
        isLocked,
        isDraft,
        onTitleClick,
        onLogicTypeChange,
        onLockToggle,
        onDraftToggle,
        onAddSubgroup,
        onAddFilter
    }) => {
    return (
        <>
            <LogicToggle
                logicType={logicType}
                isLocked={isLocked}
                onChange={onLogicTypeChange}
            />
            <span
                className={classNames(styles.Text, {
                    [styles.editableText]: !isLocked
                })}
                onClick={onTitleClick}
                title={!isLocked ? 'Нажмите для редактирования' : undefined}
            >
        {title}
      </span>
            <GroupActions
                isLocked={isLocked}
                isDraft={isDraft}
                onLockToggle={onLockToggle}
                onDraftToggle={onDraftToggle}
                onAddSubgroup={onAddSubgroup}
                onAddFilter={onAddFilter}
            />
        </>
    );
};
