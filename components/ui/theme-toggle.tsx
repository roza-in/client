'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

/**
 * Theme toggle button with dropdown for light/dark/system modes
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors',
          className
        )}
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className={cn('relative inline-block', className)}>
      <button
        onClick={() => {
          if (theme === 'light') setTheme('dark');
          else if (theme === 'dark') setTheme('system');
          else setTheme('light');
        }}
        className="inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'light' && <Sun className="h-5 w-5" />}
        {theme === 'dark' && <Moon className="h-5 w-5" />}
        {theme === 'system' && <Monitor className="h-5 w-5" />}
      </button>
    </div>
  );
}

/**
 * Theme toggle with explicit options
 */
export function ThemeSelector({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={cn('flex items-center gap-1 rounded-lg bg-muted p-1', className)}>
      <button
        onClick={() => setTheme('light')}
        className={cn(
          'flex items-center justify-center rounded-md p-2 transition-colors',
          theme === 'light'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
        aria-label="Light mode"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={cn(
          'flex items-center justify-center rounded-md p-2 transition-colors',
          theme === 'dark'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
        aria-label="Dark mode"
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={cn(
          'flex items-center justify-center rounded-md p-2 transition-colors',
          theme === 'system'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
        aria-label="System mode"
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  );
}
