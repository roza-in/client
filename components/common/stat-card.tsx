import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Stat Card Component
 * Displays a statistic with title, value, optional trend, and icon
 * Supports currency, percentage, and number formatting
 */
export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  format?: 'number' | 'currency' | 'percentage';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function formatValue(value: string | number, format?: string): string {
  if (typeof value === 'string') return value;
  
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(value);
    case 'percentage':
      return `${value}%`;
    default:
      return new Intl.NumberFormat('en-IN').format(value);
  }
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  format,
  trend,
  className,
  ...props
}: StatCardProps) {
  const displayValue = formatValue(value, format);
  
  return (
    <Card className={cn('', className)} {...props}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold">{displayValue}</p>
              {trend && (
                <span
                  className={cn(
                    'text-xs font-medium',
                    trend.isPositive ? 'text-green-600' : 'text-destructive'
                  )}
                >
                  {trend.isPositive ? '+' : ''}
                  {trend.value}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {Icon && (
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
