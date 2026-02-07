
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DashboardHeader } from '@/components/layout/header/dashboard-header';
import { Sidebar } from '@/components/layout/sidebar/sidebar';
import { VerificationGuard } from '@/features/auth/components/verification-guard';

interface DashboardLayoutProps {
    children: React.ReactNode;
    className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex min-h-screen flex-col md:pl-44">
                <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

                <main className={cn('flex-1 p-4 md:p-6', className)}>
                    <VerificationGuard>
                        {children}
                    </VerificationGuard>
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;
