"use client";
import { useThemeStore } from '@/lib/state/themeStore';

export default function ThemeAdminPage() {
  const { themes, activeTheme, setTheme } = useThemeStore();
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Themes</h2>
      <ul className="space-y-2">
        {themes.map(t => (
          <li key={t.name} className="flex items-center justify-between border border-border rounded-md p-2 text-sm">
            <span>{t.name}</span>
            <button
              disabled={activeTheme.name === t.name}
              onClick={() => setTheme(t.name)}
              className="px-3 py-1 rounded-md bg-primary text-primaryForeground disabled:opacity-50"
            >Activate</button>
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-6 gap-2">
        {Object.entries(activeTheme.variables).map(([k, v]) => (
          <div key={k} className="border border-border rounded p-2 text-xs">
            <div className="truncate font-mono" title={k}>{k}</div>
            <div className="h-4 w-full rounded mt-1" style={{ backgroundColor: v }} />
          </div>
        ))}
      </div>
    </div>
  );
}
