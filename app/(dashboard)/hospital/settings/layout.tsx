'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Building2, Clock, Bell, CreditCard, Wifi, Lock } from 'lucide-react';

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const tabs = [
        {
            name: 'Profile',
            href: '/hospital/settings/profile',
            icon: Building2,
        },
        {
            name: 'Facilities',
            href: '/hospital/settings/facilities',
            icon: Wifi,
        },
        {
            name: 'Security',
            href: '/hospital/settings/security',
            icon: Lock,
        },
        {
            name: 'Bank Details',
            href: '/hospital/settings/bank',
            icon: CreditCard,
        },
        {
            name: 'Notifications',
            href: '/hospital/settings/notifications',
            icon: Bell,
        },
    ];

    return (
        <div className="flex flex-col space-y-8">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your hospital profile, operating hours, and preferences.
                </p>
            </div>

            <nav className="flex gap-2 ">
                {tabs.map((tab) => (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                            pathname === tab.href
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <tab.icon className="h-4 w-4" />
                        <span className="whitespace-nowrap">{tab.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="flex-1 bg-card rounded-xl border p-6 shadow-sm">
                {children}
            </div>
        </div>
    );
}
