import {type KeyboardEvent, useState} from 'react';
import styles from './GroupEditModal.module.css';

interface Props {
    isOpen: boolean;
    title: string;
    onSave: (newTitle: string) => void;
    onCancel: () => void;
}

export function GroupEditModal({isOpen, title, onSave, onCancel}: Props) {
    const [editedTitle, setEditedTitle] = useState(title);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(editedTitle.trim() || 'Группа');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            onCancel();
        }
    };

    return (
        <div className={styles.overlay} onClick={onCancel}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h3>Введите новое название</h3>
                <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Название группы"
                    autoFocus
                    className={styles.input}
                />
                <div className={styles.buttons}>
                    <button onClick={onCancel} className={styles.cancelButton}>
                        Отмена
                    </button>
                    <button onClick={handleSave} className={styles.saveButton}>
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
}
