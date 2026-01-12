import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'default' | 'lg';
}

export function Spinner({ className, size = 'default', ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('animate-spin text-muted-foreground', className)}
      {...props}
    >
      <Loader2
        className={cn(
          size === 'sm' && 'h-4 w-4',
          size === 'default' && 'h-6 w-6',
          size === 'lg' && 'h-8 w-8'
        )}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

interface LoadingOverlayProps {
  isLoading?: boolean;
  children: React.ReactNode;
}

export function LoadingOverlay({ isLoading, children }: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Spinner size="lg" />
        </div>
      )}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-100 items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export function FullPageLoader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
