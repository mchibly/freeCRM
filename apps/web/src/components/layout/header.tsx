'use client';

import { Menu, Bell, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui';
import { useState, useEffect } from 'react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center px-4 gap-4">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
        aria-label="Abrir menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1" />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
        aria-label={dark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      >
        {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Notifications */}
      <button
        className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 relative"
        aria-label="Notificações"
      >
        <Bell className="w-5 h-5" />
      </button>

      {/* User menu */}
      <div className="flex items-center gap-2 ml-2">
        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-sm font-semibold">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <span className="hidden sm:block text-sm font-medium">{user?.name || 'Usuário'}</span>
        <Button variant="ghost" size="sm" onClick={logout}>
          Sair
        </Button>
      </div>
    </header>
  );
}
