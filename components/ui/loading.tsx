'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
    title?: string;
    description?: string;
    className?: string;
    fullscreen?: boolean;
}

export function Loading({
    title = "Loading...",
    description,
    className,
    fullscreen = true
}: LoadingProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center bg-white dark:bg-slate-950 transition-all duration-300",
            fullscreen ? "fixed inset-0 z-50" : "w-full min-h-[60vh]",
            className
        )}>
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 shadow-xl flex items-center justify-center ring-1 ring-black/5 dark:ring-white/10 mb-8 animate-in fade-in zoom-in duration-300">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>

            <div className="text-center space-y-2 max-w-sm px-4 animate-in slide-in-from-bottom-4 duration-500 delay-150">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                    {title}
                </h2>
                {description && (
                    <p className="text-slate-500 dark:text-slate-400 text-sm animate-pulse">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}
