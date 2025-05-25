import {type FC} from 'react';
import {type OperatorType} from '@/shared/types';
import styles from '../TreeItem.module.css';

interface FilterFieldsProps {
    field?: string;
    operator?: OperatorType;
    value?: string;
    canEdit: boolean;
    onFieldChange: (field: string) => void;
    onOperatorChange: (operator: OperatorType) => void;
    onValueChange: (value: string) => void;
}

export const FilterFields: FC<FilterFieldsProps> = (
    {
        field,
        operator,
        value,
        canEdit,
        onFieldChange,
        onOperatorChange,
        onValueChange
    }) => {
    return (
        <div className={styles.filterFields}>
            <select
                value={field}
                onChange={(e) => onFieldChange(e.target.value)}
                disabled={!canEdit}
                className={styles.filterSelect}
            >
                <option value="">Выберите поле</option>
                <option value="gender">Пол</option>
                <option value="birth_date">Дата рождения</option>
                <option value="channel">Канал</option>
            </select>

            <select
                value={operator}
                onChange={(e) => onOperatorChange(e.target.value as OperatorType)}
                disabled={!canEdit}
                className={styles.filterSelect}
            >
                <option value="equals">равно</option>
                <option value="not equals">не равно</option>
                <option value="is after">после</option>
                <option value="is before">до</option>
            </select>

            <input
                type="text"
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                disabled={!canEdit}
                placeholder="Значение"
                className={styles.filterInput}
            />
        </div>
    );
};
