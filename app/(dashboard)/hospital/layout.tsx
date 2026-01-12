'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header, Sidebar } from '@/components/layout';
import { FullPageLoader} from '@/components/ui';
import { useUser, useAuthInit } from '@/hooks/use-auth';
import { VERIFICATION_STATUS } from '@/lib/constants';
import Link from 'next/link';

function HospitalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isInitialized, isAuthenticated } = useUser();
  const { isInitialized: initRan } = useAuthInit();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  useEffect(() => {
    if (initRan && isInitialized && !isAuthenticated) {
      router.replace('/login');
    }
  }, [initRan, isInitialized, isAuthenticated, router]);

  useEffect(() => {
    if (!user || user.role !== 'hospital' || !user.hospital) return;

    const status = (user.hospital as any).verification_status || (user.hospital as any).verificationStatus || 'pending';

    // Block access until verified
    if (status !== VERIFICATION_STATUS.VERIFIED) {
      setShowVerificationModal(true);
    } else {
      setShowVerificationModal(false);
    }
  }, [user]);

  if (!initRan || !isInitialized || !isAuthenticated || !user) {
    return <FullPageLoader label="Loading your dashboard..." />;
  }

  // If not verified, render a blocking verification screen (no access to dashboard)
  if (showVerificationModal) {
    const hospital = user.hospital as any;
    const status = hospital?.verification_status || hospital?.verificationStatus || 'pending';

    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
        <div className="w-full max-w-2xl bg-background rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Hospital verification in progress</h2>
          <p className="text-sm mb-4">
            {status === VERIFICATION_STATUS.PENDING || status === VERIFICATION_STATUS.UNDER_REVIEW ? (
              'Your hospital profile is under review. Our verification team will contact you shortly to complete the remaining steps and enable teleconsultation features.'
            ) : status === VERIFICATION_STATUS.REJECTED ? (
              <>
                Your verification was rejected. Please review your <Link href="/hospital/profile" className="text-primary">profile</Link> and upload the required documents. Our team can assist if you need help.
              </>
            ) : (
              'Your hospital is not verified yet. Our team will reach out to help you complete the verification process.'
            )}
          </p>

          <div className="flex gap-6">
            <Link href="/contact" className="btn btn-primary">Contact support</Link>
            <Link href="/" className="btn">Go to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex w-full h-screen flex-col">
        <Header />
        <main className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

export default HospitalLayout;
