import { ReactNode } from 'react';
import { PublicHeader, Footer } from '@/components/layout';

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <PublicHeader />
            <main className="min-h-[calc(100vh-4rem)]">{children}</main>
            <Footer />
        </>
    );
}
