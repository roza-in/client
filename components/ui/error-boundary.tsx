'use client';

import React, { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    showHome?: boolean;
    className?: string;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * ErrorBoundary component for catching React errors
 * Uses class component as required by React error boundaries
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    handleGoHome = () => {
        if (typeof window !== 'undefined') {
            window.location.href = '/';
        }
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <ErrorFallback
                    error={this.state.error}
                    onRetry={this.handleRetry}
                    onGoHome={this.props.showHome ? this.handleGoHome : undefined}
                    className={this.props.className}
                />
            );
        }

        return this.props.children;
    }
}

interface ErrorFallbackProps {
    error?: Error | null;
    title?: string;
    description?: string;
    onRetry?: () => void;
    onGoHome?: () => void;
    className?: string;
    compact?: boolean;
}

/**
 * ErrorFallback component - can be used standalone or with ErrorBoundary
 */
export function ErrorFallback({
    error,
    title = 'Something went wrong',
    description,
    onRetry,
    onGoHome,
    className,
    compact = false,
}: ErrorFallbackProps) {
    const errorMessage = description || error?.message || 'An unexpected error occurred. Please try again.';

    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center text-center',
                compact ? 'py-8 px-4' : 'py-16 px-6',
                'animate-in fade-in duration-300',
                className
            )}
            role="alert"
        >
            <div
                className={cn(
                    'rounded-full bg-destructive/10 flex items-center justify-center',
                    compact ? 'w-12 h-12 mb-3' : 'w-16 h-16 mb-6'
                )}
            >
                <AlertTriangle
                    className={cn(
                        'text-destructive',
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
                {title}
            </h3>

            <p
                className={cn(
                    'text-muted-foreground max-w-md',
                    compact ? 'text-sm' : 'text-sm'
                )}
            >
                {errorMessage}
            </p>

            {(onRetry || onGoHome) && (
                <div className={cn('flex gap-3', compact ? 'mt-3' : 'mt-6')}>
                    {onRetry && (
                        <Button
                            onClick={onRetry}
                            variant="outline"
                            size={compact ? 'sm' : 'default'}
                            className="gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Try Again
                        </Button>
                    )}
                    {onGoHome && (
                        <Button
                            onClick={onGoHome}
                            variant="ghost"
                            size={compact ? 'sm' : 'default'}
                            className="gap-2"
                        >
                            <Home className="w-4 h-4" />
                            Go Home
                        </Button>
                    )}
                </div>
            )}

            {process.env.NODE_ENV === 'development' && error && (
                <details className="mt-6 text-left w-full max-w-lg">
                    <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                        Error Details (Development Only)
                    </summary>
                    <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto max-h-48">
                        {error.stack || error.message}
                    </pre>
                </details>
            )}
        </div>
    );
}
