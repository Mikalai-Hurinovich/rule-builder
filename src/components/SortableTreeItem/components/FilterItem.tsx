import {type FC} from 'react';
import classNames from 'classnames';
import {FilterFields} from './FilterFields';
import {type OperatorType} from '@/shared/types';
import styles from '../TreeItem.module.css';

interface FilterItemProps {
    title: string;
    field?: string;
    operator?: OperatorType;
    value?: string;
    isLocked: boolean;
    isDraft: boolean;
    onTitleClick: () => void;
    onFieldChange: (field: string) => void;
    onOperatorChange: (operator: OperatorType) => void;
    onValueChange: (value: string) => void;
}

export const FilterItem: FC<FilterItemProps> = (
    {
        title,
        field,
        operator,
        value,
        isLocked,
        isDraft,
        onTitleClick,
        onFieldChange,
        onOperatorChange,
        onValueChange
    }) => {
    const canEdit = !isLocked && !isDraft;

    return (
        <>
      <span
          className={classNames(styles.Text, {
              [styles.editableText]: canEdit
          })}
          onClick={onTitleClick}
          title={canEdit ? 'Нажмите для редактирования' : undefined}
      >
        {title}
      </span>
            <FilterFields
                field={field}
                operator={operator}
                value={value}
                canEdit={canEdit}
                onFieldChange={onFieldChange}
                onOperatorChange={onOperatorChange}
                onValueChange={onValueChange}
            />
        </>
    );
};
