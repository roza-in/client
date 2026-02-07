'use client';

import React from 'react';
import {
    FileText,
    Calendar,
    Users,
    Package,
    Search,
    Bell,
    MessageSquare,
    CreditCard,
    type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type EmptyStateVariant =
    | 'default'
    | 'appointments'
    | 'patients'
    | 'prescriptions'
    | 'orders'
    | 'search'
    | 'notifications'
    | 'messages'
    | 'payments';

interface EmptyStateProps {
    variant?: EmptyStateVariant;
    title?: string;
    description?: string;
    icon?: LucideIcon;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
    compact?: boolean;
}

const variantConfig: Record<EmptyStateVariant, { icon: LucideIcon; title: string; description: string }> = {
    default: {
        icon: FileText,
        title: 'No data found',
        description: 'There is nothing to display at the moment.',
    },
    appointments: {
        icon: Calendar,
        title: 'No appointments',
        description: 'You don\'t have any appointments scheduled.',
    },
    patients: {
        icon: Users,
        title: 'No patients',
        description: 'You haven\'t consulted with any patients yet.',
    },
    prescriptions: {
        icon: FileText,
        title: 'No prescriptions',
        description: 'You don\'t have any prescriptions yet.',
    },
    orders: {
        icon: Package,
        title: 'No orders',
        description: 'You haven\'t placed any orders yet.',
    },
    search: {
        icon: Search,
        title: 'No results found',
        description: 'Try adjusting your search or filters.',
    },
    notifications: {
        icon: Bell,
        title: 'No notifications',
        description: 'You\'re all caught up!',
    },
    messages: {
        icon: MessageSquare,
        title: 'No messages',
        description: 'You don\'t have any messages yet.',
    },
    payments: {
        icon: CreditCard,
        title: 'No payments',
        description: 'You don\'t have any payment history.',
    },
};

export function EmptyState({
    variant = 'default',
    title,
    description,
    icon: CustomIcon,
    action,
    className,
    compact = false,
}: EmptyStateProps) {
    const config = variantConfig[variant];
    const Icon = CustomIcon || config.icon;
    const displayTitle = title || config.title;
    const displayDescription = description || config.description;

    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center text-center',
                compact ? 'py-8 px-4' : 'py-16 px-6',
                'animate-in fade-in duration-300',
                className
            )}
        >
            <div
                className={cn(
                    'rounded-full bg-muted flex items-center justify-center',
                    compact ? 'w-12 h-12 mb-3' : 'w-16 h-16 mb-6'
                )}
            >
                <Icon
                    className={cn(
                        'text-muted-foreground',
                        compact ? 'w-6 h-6' : 'w-8 h-8'
                    )}
                />
            </div>

            <h3
                className={cn(
                    'font-semibold text-foreground',
                    compact ? 'text-base mb-1' : 'text-lg mb-2'
                )}
            >
                {displayTitle}
            </h3>

            <p
                className={cn(
                    'text-muted-foreground max-w-sm',
                    compact ? 'text-sm' : 'text-sm'
                )}
            >
                {displayDescription}
            </p>

            {action && (
                <Button
                    onClick={action.onClick}
                    className={cn('mt-4', compact && 'mt-3')}
                    size={compact ? 'sm' : 'default'}
                >
                    {action.label}
                </Button>
            )}
        </div>
    );
}
