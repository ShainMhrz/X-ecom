"use client";
import { useEffect } from 'react';
import { useThemeStore } from '@/lib/state/themeStore';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { activeTheme } = useThemeStore();
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(activeTheme.variables).forEach(([k, v]) => {
      root.style.setProperty(k, v);
    });
  }, [activeTheme]);
  return <>{children}</>;
};
