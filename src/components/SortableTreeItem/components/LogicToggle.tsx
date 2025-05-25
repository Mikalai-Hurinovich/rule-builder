import {type FC} from 'react';
import classNames from 'classnames';
import styles from '../TreeItem.module.css';

interface LogicToggleProps {
    logicType: 'AND' | 'OR';
    isLocked: boolean;
    onChange: (type: 'AND' | 'OR') => void;
}

export const LogicToggle: FC<LogicToggleProps> = (
    {
        logicType,
        isLocked,
        onChange
    }) => {
    if (isLocked) return null;

    const handleToggle = () => {
        onChange(logicType === 'AND' ? 'OR' : 'AND');
    };

    return (
        <button
            className={classNames(styles.logicToggle, {
                [styles.andToggle]: logicType === 'AND',
                [styles.orToggle]: logicType === 'OR'
            })}
            onClick={handleToggle}
            title={`Переключить на ${logicType === 'AND' ? 'OR' : 'AND'}`}
        >
            {logicType}
        </button>
    );
};
