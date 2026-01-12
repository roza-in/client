'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header, Sidebar } from '@/components/layout';
import { FullPageLoader } from '@/components/ui';
import { useUser, useAuthInit } from '@/hooks/use-auth';

function PatientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isInitialized, isAuthenticated } = useUser();
  const { isInitialized: initRan } = useAuthInit();

  useEffect(() => {
    if (initRan && isInitialized && !isAuthenticated) {
      router.replace('/login');
    }
  }, [initRan, isInitialized, isAuthenticated, router]);

  if (!initRan || !isInitialized || !isAuthenticated || !user) {
    return <FullPageLoader label="Loading your dashboard..." />;
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

export default PatientLayout;
