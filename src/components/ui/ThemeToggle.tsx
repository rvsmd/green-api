import { useTheme } from '@app/theme/ThemeProvider';

export const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();
  return (
    <button aria-label="Переключить тему" onClick={toggleTheme}>
      {mode === 'dark' ? '☀' : '☾'}
    </button>
  );
};
