import { useTheme } from '@app/theme/useTheme';

import styles from './ThemeToggle.module.scss';

export const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <button aria-label="Переключить тему" className={styles.button} onClick={toggleTheme}>
      {mode === 'dark' ? '☀' : '☾'}
    </button>
  );
};
