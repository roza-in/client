'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  CreditCard,
  Settings,
  Stethoscope,
  ClipboardList,
  FileText,
  BarChart3,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { useRole, useUser } from '@/hooks/use-auth';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
}

interface NavGroup {
  title?: string;
  items: NavItem[];
}

const navigationByRole: Record<string, NavGroup[]> = {
  hospital_admin: [
    {
      items: [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Management',
      items: [
        { title: 'Hospital Profile', href: '/hospital/profile', icon: Building2 },
        { title: 'Doctors', href: '/hospital/doctors', icon: Stethoscope },
        { title: 'Schedules', href: '/hospital/schedules', icon: Calendar },
      ],
    },
    {
      title: 'Operations',
      items: [
        { title: 'Appointments', href: '/hospital/appointments', icon: ClipboardList },
        { title: 'Payments', href: '/hospital/payments', icon: CreditCard },
      ],
    },
    {
      title: 'Settings',
      items: [
        { title: 'Settings', href: '/hospital/settings', icon: Settings },
      ],
    },
  ],
  doctor: [
    {
      items: [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Clinical',
      items: [
        { title: "Today's Appointments", href: '/doctor/today', icon: Calendar },
        { title: 'My Patients', href: '/doctor/patients', icon: Users },
        { title: 'Consultations', href: '/doctor/consultations', icon: FileText },
      ],
    },
  ],
  admin: [
    {
      items: [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Platform',
      items: [
        { title: 'Hospitals', href: '/admin/hospitals', icon: Building2 },
        { title: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
        { title: 'Audit Logs', href: '/admin/audits', icon: Shield },
      ],
    },
  ],
  patient: [
    {
      items: [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
  ],
};

export interface SidebarProps {
  isCollapsed?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

/**
 * Sidebar Component
 * Uses auth hooks to display role-based navigation
 */
export function Sidebar({ isCollapsed = false, isOpen = true, onToggle, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const { role } = useRole();

  // If not authenticated or no role, don't render
  if (!user || !role) {
    return null;
  }

  // If isOpen is false (mobile menu closed), hide the sidebar
  if (!isOpen) {
    return null;
  }

  const navigation = navigationByRole[role as keyof typeof navigationByRole] || [];

  return (
    <aside
      className={cn(
        'relative flex h-screen flex-col border-r bg-card transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              R
            </div>
            <span className="text-lg">ROZX</span>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/dashboard" className="mx-auto">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              R
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {navigation.map((group, groupIndex) => (
            <div key={groupIndex}>
              {'title' in group && group.title && !isCollapsed && (
                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.title}
                </p>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                          isCollapsed && 'justify-center'
                        )}
                        title={isCollapsed ? item.title : undefined}
                        onClick={onClose}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span>{item.title}</span>}
                        {!isCollapsed && item.badge && (
                          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs font-medium text-primary">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t p-4">
        <div
          className={cn(
            'flex items-center gap-3',
            isCollapsed && 'justify-center'
          )}
        >
          <Avatar
            src={user.profilePictureUrl}
            fallback={user.fullName ?? undefined}
            size={isCollapsed ? 'sm' : 'default'}
          />
          {!isCollapsed && (
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium">{user.fullName}</p>
              <p className="truncate text-xs text-muted-foreground capitalize">
                {role}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      {onToggle && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-accent"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      )}
    </aside>
  );
}
