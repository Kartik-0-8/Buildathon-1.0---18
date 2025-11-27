import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeProviderProps {
  children?: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeContextState {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const initialState: ThemeContextState = {
  theme: 'system',
  effectiveTheme: 'light',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeContextState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'collabx-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(storageKey);
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
            return stored;
        }
    }
    return defaultTheme;
  });

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = (t: Theme) => {
        let resolvedTheme = t;
        
        if (t === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
            resolvedTheme = systemTheme;
        }

        setEffectiveTheme(resolvedTheme as 'light' | 'dark');

        root.classList.remove('light', 'dark');
        root.classList.add(resolvedTheme);
    };

    applyTheme(theme);

    if (theme === 'system') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => applyTheme('system');
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const setTheme = (value: Theme) => {
    setThemeState(value);
    localStorage.setItem(storageKey, value);
  };

  return (
    <ThemeProviderContext.Provider value={{ theme, effectiveTheme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};