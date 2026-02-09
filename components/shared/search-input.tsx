/**
 * Shared Components - Search Input
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchInputProps {
    value?: string;
    placeholder?: string;
    onSearch: (value: string) => void;
    debounceMs?: number;
    className?: string;
}

export function SearchInput({
    value: controlledValue,
    placeholder = 'Search...',
    onSearch,
    debounceMs = 300,
    className,
}: SearchInputProps) {
    const [inputValue, setInputValue] = useState(controlledValue || '');
    const debouncedValue = useDebounce(inputValue, debounceMs);
    const isFirstRender = useRef(true);
    const prevDebouncedValue = useRef(debouncedValue);

    useEffect(() => {
        if (controlledValue !== undefined && controlledValue !== inputValue) {
            setInputValue(controlledValue);
        }
    }, [controlledValue]);

    useEffect(() => {
        // Skip the first render and when value hasn't actually changed
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Only call onSearch when value actually changes from previous
        if (prevDebouncedValue.current !== debouncedValue) {
            prevDebouncedValue.current = debouncedValue;
            onSearch(debouncedValue);
        }
    }, [debouncedValue, onSearch]);

    const handleClear = useCallback(() => {
        setInputValue('');
        onSearch('');
    }, [onSearch]);

    return (
        <div className={cn('relative', className)}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
                className={cn(
                    'w-full rounded-md border border-input bg-background px-9 py-2 text-sm',
                    'placeholder:text-muted-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                )}
            />
            {inputValue && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}

export default SearchInput;
