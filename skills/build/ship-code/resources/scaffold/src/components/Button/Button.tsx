// Component spec: ux/design/components/button.md (name matches the library, DSY-R12)
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: 'primary' | 'secondary';
  readonly children: ReactNode;
}

export function Button({ variant = 'primary', children, type = 'button', ...rest }: Props) {
  return (
    <button {...rest} type={type} className={`${styles.button} ${styles[variant]}`}>
      {children}
    </button>
  );
}
