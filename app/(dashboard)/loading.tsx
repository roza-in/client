import { StatsGridSkeleton, AppointmentsListSkeleton } from '@/components/shared/skeletons';

/**
 * Dashboard-scoped loading skeleton.
 * Renders inside the sidebar/header layout (not full-screen).
 */
export default function DashboardLoading() {
    return (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
            {/* Stats row */}
            <StatsGridSkeleton count={4} />

            {/* Main content area */}
            <div className="grid gap-6 lg:grid-cols-12">
                {/* Left — table / list area */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Chart placeholder */}
                    <div className="rounded-xl border bg-card p-6">
                        <div className="h-5 w-40 bg-muted rounded animate-pulse mb-4" />
                        <div className="h-[260px] w-full bg-muted/40 rounded-lg animate-pulse" />
                    </div>

                    {/* Recent list */}
                    <AppointmentsListSkeleton count={3} />
                </div>

                {/* Right — sidebar cards */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Card skeleton 1 */}
                    <div className="rounded-xl border bg-card p-6 space-y-3">
                        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                        <div className="h-8 w-20 bg-muted rounded animate-pulse" />
                        <div className="h-2.5 w-full bg-muted rounded-full animate-pulse" />
                        <div className="grid grid-cols-2 gap-2">
                            <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                            <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                            <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                            <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                        </div>
                    </div>

                    {/* Card skeleton 2 */}
                    <div className="rounded-xl border bg-card p-6 space-y-3">
                        <div className="h-5 w-28 bg-muted rounded animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-10 w-full bg-muted/50 rounded-lg animate-pulse" />
                            <div className="h-10 w-full bg-muted/50 rounded-lg animate-pulse" />
                            <div className="h-10 w-full bg-muted/50 rounded-lg animate-pulse" />
                        </div>
                    </div>

                    {/* Quick actions skeleton */}
                    <div className="rounded-xl border bg-card p-6 space-y-3">
                        <div className="h-5 w-24 bg-muted rounded animate-pulse" />
                        <div className="grid grid-cols-2 gap-2">
                            <div className="h-16 bg-muted/50 rounded-lg animate-pulse" />
                            <div className="h-16 bg-muted/50 rounded-lg animate-pulse" />
                            <div className="h-16 bg-muted/50 rounded-lg animate-pulse" />
                            <div className="h-16 bg-muted/50 rounded-lg animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
