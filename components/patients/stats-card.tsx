/**
 * Patient Components - Dashboard Stats Card
 */

import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        label: string;
    };
    variant?: 'default' | 'primary' | 'success' | 'warning';
    className?: string;
}

const variantStyles = {
    default: {
        bg: 'bg-muted/50',
        iconBg: 'bg-muted',
        iconColor: 'text-foreground',
    },
    primary: {
        bg: 'bg-primary/10',
        iconBg: 'bg-primary',
        iconColor: 'text-primary-foreground',
    },
    success: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        iconBg: 'bg-green-500',
        iconColor: 'text-white',
    },
    warning: {
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        iconBg: 'bg-amber-500',
        iconColor: 'text-white',
    },
};

export function StatsCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    variant = 'default',
    className,
}: StatsCardProps) {
    const styles = variantStyles[variant];

    return (
        <div className={cn('rounded-xl border p-4', styles.bg, className)}>
            <div className="flex items-start justify-between">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', styles.iconBg)}>
                    <Icon className={cn('h-5 w-5', styles.iconColor)} />
                </div>
                {trend && (
                    <div
                        className={cn(
                            'flex items-center gap-1 text-xs font-medium',
                            trend.value >= 0 ? 'text-green-600' : 'text-red-600'
                        )}
                    >
                        {trend.value >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                        ) : (
                            <TrendingDown className="h-3 w-3" />
                        )}
                        {Math.abs(trend.value)}%
                    </div>
                )}
            </div>

            <div className="mt-3">
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-muted-foreground">{title}</p>
                {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
            </div>

            {trend && <p className="mt-2 text-xs text-muted-foreground">{trend.label}</p>}
        </div>
    );
}

// Skeleton variant
export function StatsCardSkeleton() {
    return (
        <div className="rounded-xl border p-4 animate-pulse">
            <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-lg bg-muted" />
            </div>
            <div className="mt-3 space-y-2">
                <div className="h-8 w-20 rounded bg-muted" />
                <div className="h-4 w-24 rounded bg-muted" />
            </div>
        </div>
    );
}

export default StatsCard;
