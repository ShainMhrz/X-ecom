"use client";
import { useEffect } from 'react';
import { useThemeStore } from '@/lib/state/themeStore';

export default function EarthenActivator() {
  const { activeTheme, setTheme } = useThemeStore();
  useEffect(() => {
    if (activeTheme.name !== 'Earthen') setTheme('Earthen');
  }, [activeTheme.name, setTheme]);
  return null;
}
