
export default function ConsultationLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans">


            {/* Main Content */}
            <main className="flex-1 relative">
                {children}
            </main>
        </div>
    );
}