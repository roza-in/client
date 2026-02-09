'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/slices/auth.slice';
import { LoadingSpinner } from '@/components/shared';
import { isSubdomainEnabled, buildSubdomainUrl } from '@/config/subdomains';
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
            if (isSubdomainEnabled()) {
                // Redirect to main domain login with return URL
                const currentUrl = window.location.href;
                const loginUrl = buildSubdomainUrl('www', '/login');
                window.location.href = `${loginUrl}?redirect=${encodeURIComponent(currentUrl)}`;
            } else {
                router.push('/login');
            }
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
        const status = hospital?.verification_status;
        const isActive = hospital?.isActive ?? hospital?.is_active ?? true;

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
        const status = doctor?.verification_status;
        const isActive = doctor?.isActive ?? doctor?.is_active ?? true;

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
