import { createContext, type PropsWithChildren, useContext, useEffect, useState } from 'react';

import { themeStorageKey, type ThemeMode } from './themeMode';

type ThemeContextValue = { mode: ThemeMode; toggleTheme: () => void };
const ThemeContext = createContext<ThemeContextValue | null>(null);
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
export const useTheme = () => {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('ThemeProvider is required');
  return value;
};
