import { type PropsWithChildren, useEffect, useState } from 'react';

import { ThemeContext } from './ThemeContext';
import { themeStorageKey, type ThemeMode } from './themeMode';

const initialMode = (): ThemeMode =>
  (localStorage.getItem(themeStorageKey) as ThemeMode) ??
  (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    localStorage.setItem(themeStorageKey, mode);
  }, [mode]);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        toggleTheme: () => setMode((value) => (value === 'light' ? 'dark' : 'light')),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
