import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { locales, Language, TranslationKey } from '../locales';

type Theme = 'dark' | 'light';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children?: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') return stored;
    }
    return 'dark'; // Default to dark mode
  });

  // Language state
  const [language, setLanguage] = useState<Language>('zh');

  // Apply theme class to html element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'zh' : 'en'));
  };

  const t = (key: string): string => {
    const currentLocale = locales[language];
    const fallbackLocale = locales['en'];

    // We cast key to TranslationKey because we are allowing any string to be passed
    // but we know that if it doesn't match a key, we'll just get undefined and return the key itself
    const val = currentLocale[key as TranslationKey] || fallbackLocale[key as TranslationKey];
    return val || key;
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, language, toggleLanguage, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
