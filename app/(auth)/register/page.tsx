import { Metadata } from 'next';
import { Suspense } from 'react';
import { RegisterForm } from '@/components/auth';
import { LoadingSpinner } from '@/components/shared';

export const metadata: Metadata = {
    title: 'Create Account | ROZX Healthcare',
    description: 'Register for ROZX Healthcare - India\'s future of healthcare',
};

export default function RegisterPage() {
    return (
        <div className="flex min-h-full items-center justify-center py-8 px-4">
            <Suspense fallback={<LoadingSpinner />}>
                <RegisterForm />
            </Suspense>
        </div>
    );
}
