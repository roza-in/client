import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default function ConsultationLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans">


            {/* Main Content */}
            <main className="flex-1 relative">
                <Suspense fallback={
                    <div className="flex h-screen w-full items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                }>
                    {children}
                </Suspense>
            </main>
        </div>
    );
}