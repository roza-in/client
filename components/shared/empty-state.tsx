/**
 * Shared Components - Empty State
 */

'use client';

import { cn } from '@/lib/utils';
import { LucideIcon, FileQuestion, Search, Calendar, ClipboardList, Users } from 'lucide-react';

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({
    icon: Icon = FileQuestion,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center',
                className
            )}
        >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            {description && (
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
            )}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}

// Pre-configured empty states
export function NoSearchResults() {
    return (
        <EmptyState
            icon={Search}
            title="No results found"
            description="Try adjusting your search or filters to find what you're looking for."
        />
    );
}

export function NoAppointments({ action }: { action?: React.ReactNode }) {
    return (
        <EmptyState
            icon={Calendar}
            title="No appointments yet"
            description="You don't have any appointments scheduled. Book your first appointment to get started."
            action={action}
        />
    );
}

export function NoPrescriptions() {
    return (
        <EmptyState
            icon={ClipboardList}
            title="No prescriptions"
            description="Prescriptions from your consultations will appear here."
        />
    );
}

export function NoFamilyMembers({ action }: { action?: React.ReactNode }) {
    return (
        <EmptyState
            icon={Users}
            title="No family members"
            description="Add family members to book appointments on their behalf."
            action={action}
        />
    );
}

export default EmptyState;
