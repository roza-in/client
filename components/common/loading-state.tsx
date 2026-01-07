import * as React from 'react';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

/**
 * Loading State Component
 * Displays a spinner with optional loading text
 */
interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  minHeight?: string;
}

export function LoadingState({
  text = 'Loading...',
  minHeight = '400px',
  className,
  ...props
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        className
      )}
      style={{ minHeight }}
      {...props}
    >
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
