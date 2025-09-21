import * as React from 'react';
import { Moon, Sun, Monitor, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/providers/theme-provider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    {
      value: 'light',
      label: 'Light',
      icon: Sun,
      description: 'Light theme for daytime use',
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: Moon,
      description: 'Dark theme for low-light environments',
    },
    {
      value: 'system',
      label: 'System',
      icon: Monitor,
      description: 'Follow system preference',
    },
  ] as const;

  const getCurrentThemeIcon = () => {
    switch (theme) {
      case 'light':
        return Sun;
      case 'dark':
        return Moon;
      case 'system':
      default:
        return Monitor;
    }
  };

  const CurrentIcon = getCurrentThemeIcon();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 w-9 px-0 hover:bg-accent/50 focus-brand"
          title={`Current theme: ${theme}`}
        >
          <CurrentIcon className="h-4 w-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {themeOptions.map(({ value, label, icon: Icon, description }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className={`cursor-pointer ${
              theme === value ? 'bg-accent text-accent-foreground' : ''
            }`}
          >
            <div className="flex items-center w-full">
              <Icon className="mr-3 h-4 w-4" />
              <div className="flex-1">
                <div className="font-medium">{label}</div>
                <div className="text-xs text-muted-foreground">{description}</div>
              </div>
              {theme === value && (
                <div className="ml-2 h-2 w-2 rounded-full bg-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Simple version for use in headers/navigation
export function ThemeToggleSimple() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getCurrentIcon = () => {
    switch (theme) {
      case 'light':
        return Sun;
      case 'dark':
        return Moon;
      case 'system':
      default:
        return Monitor;
    }
  };

  const Icon = getCurrentIcon();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-9 w-9 px-0 hover:bg-accent/50 focus-brand"
      title={`Current theme: ${theme}. Click to cycle through themes.`}
    >
      <Icon className="h-4 w-4 transition-transform hover:scale-110" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}