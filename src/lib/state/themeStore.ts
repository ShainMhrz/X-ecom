import { create } from 'zustand';

export type ThemeData = {
  name: string;
  variables: Record<string, string>; // CSS variable name -> value
};

interface ThemeState {
  activeTheme: ThemeData;
  themes: ThemeData[];
  setTheme: (themeName: string) => void;
  registerTheme: (theme: ThemeData) => void;
}

const defaultThemes: ThemeData[] = [
  {
    name: 'Minimal',
    variables: {
      '--background': '#ffffff',
      '--foreground': '#111111',
      '--primary': '#111111',
      '--primary-foreground': '#ffffff',
      '--secondary': '#888888',
      '--secondary-foreground': '#ffffff',
      '--accent': '#444444',
      '--accent-foreground': '#ffffff',
      '--muted': '#f5f5f5',
      '--muted-foreground': '#555555',
      '--border': '#e2e2e2',
      '--ring': '#111111',
      '--destructive': '#b00020',
      '--destructive-foreground': '#ffffff'
    }
  },
  {
    name: 'Earthen',
    variables: {
      '--background': '#fcf9f5',
      '--foreground': '#2d271f',
      '--primary': '#6b4f3a',
      '--primary-foreground': '#ffffff',
      '--secondary': '#b3915e',
      '--secondary-foreground': '#2d271f',
      '--accent': '#8c4a2f',
      '--accent-foreground': '#ffffff',
      '--muted': '#e8e1d9',
      '--muted-foreground': '#4a4136',
      '--border': '#d9d2c9',
      '--ring': '#6b4f3a',
      '--destructive': '#b00020',
      '--destructive-foreground': '#ffffff'
    }
  },
  {
    name: 'Royal',
    variables: {
      '--background': '#ffffff',
      '--foreground': '#1b1b29',
      '--primary': '#2d3e8f',
      '--primary-foreground': '#ffffff',
      '--secondary': '#c6a664',
      '--secondary-foreground': '#1b1b29',
      '--accent': '#5d7ddc',
      '--accent-foreground': '#ffffff',
      '--muted': '#f2f4f9',
      '--muted-foreground': '#3c465e',
      '--border': '#e3e7ef',
      '--ring': '#2d3e8f',
      '--destructive': '#b00020',
      '--destructive-foreground': '#ffffff'
    }
  }
];

export const useThemeStore = create<ThemeState>((set, get) => ({
  themes: defaultThemes,
  activeTheme: defaultThemes[0],
  setTheme: (themeName) => {
    const theme = get().themes.find((t) => t.name === themeName);
    if (theme) set({ activeTheme: theme });
  },
  registerTheme: (theme) => {
    set((s) => ({ themes: [...s.themes.filter((t) => t.name !== theme.name), theme] }));
  }
}));
