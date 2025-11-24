import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/ui/components/**/*.{ts,tsx}',
    './src/ui/providers/**/*.{ts,tsx}',
    './src/lib/state/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        primaryForeground: 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        secondaryForeground: 'var(--secondary-foreground)',
        accent: 'var(--accent)',
        accentForeground: 'var(--accent-foreground)',
        muted: 'var(--muted)',
        mutedForeground: 'var(--muted-foreground)',
        border: 'var(--border)',
        ring: 'var(--ring)',
        destructive: 'var(--destructive)',
        destructiveForeground: 'var(--destructive-foreground)'
      },
      borderColor: { DEFAULT: 'var(--border)' },
      backgroundColor: { DEFAULT: 'var(--background)' },
      textColor: { DEFAULT: 'var(--foreground)' },
      fontFamily: {
        sans: 'var(--font-geist-sans)',
        mono: 'var(--font-geist-mono)'
      }
    }
  },
  plugins: []
};
export default config;
