'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Briefcase,
  Package,
  ShoppingCart,
  GitBranch,
  Settings,
  Shield,
  Palette,
  Target,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'Leads', icon: Target },
  { href: '/clients', label: 'Clientes', icon: UserCheck },
  { href: '/services', label: 'Serviços', icon: Briefcase },
  { href: '/products', label: 'Produtos', icon: Package },
  { href: '/orders', label: 'Pedidos', icon: ShoppingCart },
  { href: '/pipeline', label: 'Pipeline', icon: GitBranch },
];

const adminItems = [
  { href: '/admin/users', label: 'Usuários', icon: Users },
  { href: '/admin/rbac', label: 'Permissões', icon: Shield },
  { href: '/admin/design-system', label: 'Design System', icon: Palette },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-[var(--sidebar-width)] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700',
          'flex flex-col transition-transform duration-200',
          'lg:translate-x-0 lg:static lg:z-auto',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        role="navigation"
        aria-label="Menu principal"
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-700">
          <Link href="/dashboard" className="text-xl font-bold text-brand-600">
            freeCRM
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors',
                  active
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                )}
                aria-current={active ? 'page' : undefined}
                onClick={onClose}
              >
                <item.icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}

          {/* Admin section */}
          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Administração
            </p>
            {adminItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors',
                    active
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                  )}
                  aria-current={active ? 'page' : undefined}
                  onClick={onClose}
                >
                  <item.icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}
