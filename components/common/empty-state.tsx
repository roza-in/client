import * as React from 'react';
import { FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/**
 * Empty State Component
 * Displays a message when there's no data to show
 */
interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode | {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps){
  return (
    <div
      className={cn(
        'flex min-h-100 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 p-8 text-center',
        className
      )}
      {...props}
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        {icon || <FileQuestion className="h-8 w-8 text-muted-foreground" />}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && (
        <div className="mt-6">
          {React.isValidElement(action) ? (
            action
          ) : (
            <Button onClick={(action as { label: string; onClick: () => void }).onClick}>
              {(action as { label: string; onClick: () => void }).label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
