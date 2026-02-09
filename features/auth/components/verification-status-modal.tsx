'use client';

import { useAuthStore } from '@/store/slices/auth.slice';
import { VERIFICATION_STATUS_LABELS, type VerificationStatus } from '@/types/enums';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface VerificationStatusModalProps {
    status?: string | VerificationStatus;
    role?: 'hospital' | 'doctor';
}

export function VerificationStatusModal({ status, role = 'hospital' }: VerificationStatusModalProps) {
    const router = useRouter();
    const { user } = useAuthStore();

    const entityName = role === 'doctor' ? 'Doctor' : 'Hospital';

    // Derived content helper
    const renderContent = () => {
        // 0. Deactivated
        if (status === 'deactivated') {
            return (
                <div className="text-center space-y-4">
                    <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600 mx-auto w-fit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><line x1="12" y1="2" x2="12" y2="12" /></svg>
                    </div>
                    <h2 className="text-xl font-bold text-red-700">{entityName} Deactivated</h2>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                        This {entityName.toLowerCase()} profile has been deactivated by the administrator.
                        Your dashboard access and public visibility are temporarily restricted.
                    </p>
                    <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                        <p className="text-xs text-red-800 italic">
                            Please contact system support for reactivation or clarification.
                        </p>
                    </div>
                    <Link href="/contact" className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors">
                        Contact Support
                    </Link>
                </div>
            );
        }

        // 2. Pending or Under Review (or if status is not yet loaded)
        if (!status || status === 'pending' || status === 'under_review') {
            return (
                <div className="text-center space-y-4">
                    <div className="mb-4 rounded-full bg-yellow-100 p-3 text-yellow-600 mx-auto w-fit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    </div>
                    <h2 className="text-xl font-bold">Verification In Progress</h2>
                    <div className="mt-4 rounded-lg bg-yellow-50 p-3 border border-yellow-100 text-left">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-semibold text-gray-500 uppercase">Status</span>
                            <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
                                {VERIFICATION_STATUS_LABELS[(status || 'pending') as VerificationStatus] || status || 'Pending'}
                            </span>
                        </div>
                        <p className="text-xs text-yellow-800 leading-relaxed">
                            Your {entityName.toLowerCase()} profile is being reviewed. This usually takes 24-48 hours.
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
                    >
                        Refresh Status
                    </button>
                </div>
            );
        }

        // 3. Rejected
        if (status === 'rejected') {
            return (
                <div className="text-center space-y-4">
                    <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600 mx-auto w-fit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                    </div>
                    <h2 className="text-xl font-bold text-red-700">Application Rejected</h2>
                    <p className="text-muted-foreground mt-2 text-sm">
                        Your {entityName.toLowerCase()} application could not be verified.
                    </p>
                    <Link href="/contact" className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors">
                        Contact Support
                    </Link>
                </div>
            );
        }

        // 4. Suspended
        if (status === 'suspended') {
            return (
                <div className="text-center space-y-4">
                    <div className="mb-4 rounded-full bg-orange-100 p-3 text-orange-600 mx-auto w-fit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                    </div>
                    <h2 className="text-xl font-bold text-orange-700">Account Suspended</h2>
                    <p className="text-muted-foreground mt-2 text-sm">
                        Access has been temporarily suspended.
                    </p>
                    <Link href="/contact" className="w-full rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors">
                        Contact Support
                    </Link>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
                {renderContent()}

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                        onClick={() => router.push('/')}
                        className="w-full rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 py-2 transition-colors"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
