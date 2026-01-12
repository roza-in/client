'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Bell,
  Search,
  Menu,
  User,
  Settings,
  LogOut,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser, useAuth } from '@/hooks/use-auth';
import { useNotifications } from '@/hooks/use-notifications';

export interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

/**
 * Header Component
 * Uses auth hooks to display user info and handle logout
 */
export function Header({ onMenuClick, showMenuButton = false }: HeaderProps) {
  const router = useRouter();
  const { user } = useUser();
  const { logout } = useAuth();
  // const { unreadCount } = useNotifications();
  const pathname = usePathname();

  const capitalize = (s?: string) => !s ? '' : s.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  // Build breadcrumb items: always start with Dashboard, then path segments (skip role/admin segment)
  const segments = (pathname || '/').split('/').filter(Boolean);
  const skipFirst = segments.length > 0 && (segments[0] === 'admin' || segments[0] === (user?.role ?? '').toLowerCase() || segments[0] === 'dashboard');
  const visibleSegments = skipFirst ? segments.slice(1) : segments;
  const baseHref = user?.role === 'admin' ? '/admin' : '/';
  const crumbs = [
    { label: capitalize(user?.role) ? `${capitalize(user?.role)} Dashboard` : 'Dashboard', href: baseHref },
    ...visibleSegments.map((seg, idx) => ({ label: capitalize(seg), href: `/${segments.slice(0, (skipFirst ? idx + 2 : idx + 1)).join('/')}` })),
  ];

  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 lg:px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            {crumbs.map((c, i) => (
              <li key={i} className="flex items-center">
                {i !== 0 && <span className="mx-2 text-muted-foreground">/</span>}
                {i < crumbs.length - 1 ? (
                  <Link href={c.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {c.label}
                  </Link>
                ) : (
                  <span className="font-medium text-foreground">{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {/* {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )} */}
        </Button>

        {/* Help */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="hidden md:flex"
          aria-label="Help"
          asChild
        >
          <Link href="/help">
            <HelpCircle className="h-5 w-5" />
          </Link>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full"
              aria-label="User menu"
            >
              <Avatar
                src={user.profilePictureUrl}
                fallback={user.fullName ?? 'U'}
                size="sm"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.fullName ?? 'User'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email ?? 'No email'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/${user.role}/profile`}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/${user.role}/settings`}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
