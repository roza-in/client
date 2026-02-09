'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorProps {
    title?: string;
    description?: string;
    onRetry?: () => void;
    className?: string;
    fullscreen?: boolean;
}

export function Error({
    title = "Something went wrong",
    description = "We encountered an error while processing your request.",
    onRetry,
    className,
    fullscreen = true
}: ErrorProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center bg-white dark:bg-slate-950 transition-all duration-300",
            fullscreen ? "fixed inset-0 z-50" : "w-full min-h-[60vh]",
            className
        )}>
            <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/10 shadow-xl flex items-center justify-center ring-1 ring-red-100 dark:ring-red-900/20 mb-8 animate-in fade-in zoom-in duration-300">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-500" />
            </div>

            <div className="text-center space-y-4 max-w-sm px-4 animate-in slide-in-from-bottom-4 duration-500 delay-150">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            {description}
                        </p>
                    )}
                </div>

                {onRetry && (
                    <Button
                        onClick={onRetry}
                        variant="outline"
                        className="mt-4 gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </Button>
                )}
            </div>
        </div>
    );
}
