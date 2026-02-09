/**
 * Layout Components - Public Header
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X, User, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { routes } from '@/config';
import { siteConfig } from '@/config/site';
import { useAuthStore } from '@/store';
import { getRedirectPath } from '@/store/slices/auth.slice';
import { getInitials } from '@/lib/utils';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Logo } from '@/components/ui/logo';

const navigation = [
    { name: 'Home', href: routes.public.home },
    { name: 'Find Doctors', href: routes.public.doctors },
    { name: 'Hospitals', href: routes.public.hospitals },
    { name: 'About', href: routes.public.about },
    { name: 'Contact', href: routes.public.contact },
];

export function PublicHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuthStore();
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Prevent hydration mismatch
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const initials = user ? getInitials(`${user.name}`) : 'U';
    const dashboardPath = user ? getRedirectPath(user.role) : '/patient';

    const handleLogout = async () => {
        setShowUserMenu(false);
        await logout();
        router.push('/login');
        router.refresh();
    };

    if (!mounted) {
        return (
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="container">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <Logo className="h-24 w-auto" />
                        </Link>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            {/* Main header */}
            <div className="container">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Logo className="h-24 w-auto" />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-6 md:flex">
                        {navigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'text-sm font-medium transition-colors hover:text-primary',
                                    pathname === item.href
                                        ? 'text-primary'
                                        : 'text-muted-foreground'
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>


                    {/* Auth Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <ModeToggle />
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 rounded-full border p-1 pl-3 hover:bg-muted transition-colors"
                                >
                                    <span className="text-sm font-medium max-w-[100px] truncate">
                                        {user?.name || 'User'}
                                    </span>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                        {initials}
                                    </div>
                                </button>

                                {/* User Dropdown */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-56 rounded-lg border bg-background shadow-lg p-1 animate-in fade-in slide-in-from-top-2">
                                        <div className="border-b px-2 py-2 mb-1">
                                            <p className="text-sm font-medium">{user?.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                        </div>

                                        <Link
                                            href={dashboardPath}
                                            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            Dashboard
                                        </Link>

                                        <Link
                                            href="#"
                                            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <Settings className="h-4 w-4" />
                                            Settings
                                        </Link>

                                        <div className="border-t my-1"></div>

                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-destructive hover:bg-destructive/10"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href={routes.public.login}
                                    className="text-sm font-medium text-muted-foreground hover:text-primary"
                                >
                                    Login
                                </Link>
                                <Link
                                    href={routes.public.register}
                                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="border-t pb-4 md:hidden animate-in slide-in-from-top-5">
                        <nav className="flex flex-col gap-2 pt-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        'rounded-md px-3 py-2 text-sm font-medium',
                                        pathname === item.href
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:bg-muted'
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            <div className="mt-4 flex flex-col gap-2 border-t pt-4 px-3">
                                {isAuthenticated ? (
                                    <>
                                        <div className="flex items-center gap-3 px-2 py-2 mb-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                                {initials}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{user?.name}</p>
                                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">{user?.email}</p>
                                            </div>
                                        </div>
                                        <Link
                                            href={dashboardPath}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            Go to Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 text-left"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href={routes.public.login}
                                            onClick={() => setIsOpen(false)}
                                            className="w-full rounded-md border py-2 text-center text-sm font-medium hover:bg-muted"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href={routes.public.register}
                                            onClick={() => setIsOpen(false)}
                                            className="w-full rounded-md bg-primary py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}

export default PublicHeader;
