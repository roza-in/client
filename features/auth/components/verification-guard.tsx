'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/slices/auth.slice';
import { LoadingSpinner } from '@/components/shared';
import { getLoginUrl } from '@/config/subdomains';
import { VerificationStatusModal } from './verification-status-modal';

export function VerificationGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, isInitialized } = useAuthStore();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // 1. Wait for store initialization AND loading to finish
        if (!isInitialized || isLoading) return;

        // 2. Now safe to check authentication
        if (!isAuthenticated || !user) {
            const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
            const params: Record<string, string> = {};
            if (currentUrl) params.redirect = currentUrl;
            window.location.replace(getLoginUrl(params));
        } else {
            // If authenticated, stop "checking"
            setIsChecking(false);
        }
    }, [isAuthenticated, user, isLoading, isInitialized, router]);

    if (!isInitialized || isLoading || isChecking) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // Role-based strict verification check
    if (user?.role === 'hospital') {
        const hospital = user.hospital;
        const status = hospital?.verificationStatus;
        const isActive = hospital?.isActive ?? true;

        const isVerified = hospital && status === 'verified';

        if (!isVerified) {
            return <VerificationStatusModal status={status} role="hospital" />;
        }

        if (!isActive) {
            return <VerificationStatusModal status="deactivated" role="hospital" />;
        }
    }

    if (user?.role === 'doctor') {
        const doctor = user.doctor;
        const status = doctor?.verificationStatus;
        const isActive = doctor?.isActive ?? true;

        const isVerified = doctor && status === 'verified';

        if (!isVerified) {
            return <VerificationStatusModal status={status} role="doctor" />;
        }

        if (!isActive) {
            return <VerificationStatusModal status="deactivated" role="doctor" />;
        }
    }

    // If verified (or different role), render children normally
    return <>{children}</>;
}
