/**
 * Layout Components - Dashboard Header
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, Bell, Search, LogOut, Settings, User, HelpCircle } from 'lucide-react';
import { useAuthStore } from '@/store';
import { useUnreadCount } from '@/features/notifications';
import { getInitials } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Logo } from '@/components/ui/logo';
import { Breadcrumb } from '@/components/ui/breadcrumb';

interface DashboardHeaderProps {
    onMenuClick: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { data: unreadCount } = useUnreadCount();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const initials = user ? getInitials(`${user.name}`) : 'U';

    const handleLogout = async () => {
        setShowUserMenu(false);
        await logout();
        window.location.href = '/login';
    };

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            {/* Mobile Menu Toggle */}
            <button
                onClick={onMenuClick}
                className="md:hidden"
                aria-label="Toggle sidebar"
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* Logo (mobile) */}
            <Link href="/" className="flex items-center gap-2 md:hidden">
                <Logo variant="icon" className="h-16 w-16" />
            </Link>

            {/* Search (desktop) */}
            <div className="hidden flex-1 md:flex md:max-w-md">
                <Breadcrumb />
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right side */}
            <div className="flex items-center gap-2">
                {/* Help */}
                <button className="hidden h-10 w-10 items-center justify-center rounded-full hover:bg-muted md:flex">
                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                </button>

                <ModeToggle />

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
                    >
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        {unreadCount?.total && unreadCount.total > 0 && (
                            <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-white">
                                {unreadCount.total > 9 ? '9+' : unreadCount.total}
                            </span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 rounded-lg border bg-background shadow-lg">
                            <div className="flex items-center justify-between border-b px-4 py-3">
                                <h3 className="font-semibold">Notifications</h3>
                                <Link
                                    href="/notifications"
                                    className="text-xs text-primary hover:underline"
                                    onClick={() => setShowNotifications(false)}
                                >
                                    View all
                                </Link>
                            </div>
                            <div className="max-h-80 overflow-y-auto p-2">
                                <p className="py-8 text-center text-sm text-muted-foreground">
                                    No new notifications
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 rounded-full hover:bg-muted p-1"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                            {initials}
                        </div>
                    </button>

                    {/* User Menu Dropdown */}
                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-56 rounded-lg border bg-background shadow-lg">
                            <div className="border-b px-4 py-3">
                                <p className="font-medium">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-muted-foreground">{user?.email}</p>
                            </div>
                            <div className="p-1">
                                <Link
                                    href={`/${user?.role || 'patient'}/settings`}
                                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <User className="h-4 w-4" />
                                    Profile
                                </Link>
                                <Link
                                    href={`/${user?.role || 'patient'}/settings`}
                                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <Settings className="h-4 w-4" />
                                    Settings
                                </Link>
                                <hr className="my-1" />
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default DashboardHeader;
