import {type CSSProperties, forwardRef} from 'react';
import classNames from 'classnames';

import styles from './Action.module.css';
import type {ActionProps} from "@/shared/types";


export const Action = forwardRef<HTMLButtonElement, ActionProps>(
    ({active, className, cursor, style, ...props}, ref) => {

        return (
            <button
                ref={ref}
                {...props}
                className={classNames(styles.Action, className)}
                tabIndex={0}
                style={
                    {
                        ...style,
                        cursor,
                        '--fill': active?.fill,
                        '--background': active?.background,
                    } as CSSProperties
                }
            />
        );
    }
);
