import { useLayoutEffect, useState } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'light';
  });

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
  };

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]); 

  return { theme, handleThemeChange };
};
