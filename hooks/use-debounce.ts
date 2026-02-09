/**
 * ROZX Healthcare Platform - Debounce Hook
 * 
 * Debounce values and callbacks for performance optimization.
 */

'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// =============================================================================
// useDebounce - Debounce a value
// =============================================================================

/**
 * Debounce a value. Returns the debounced value that only updates after
 * the specified delay has passed without changes.
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns The debounced value
 * 
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 500);
 * 
 * useEffect(() => {
 *   fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

// =============================================================================
// useDebouncedCallback - Debounce a function
// =============================================================================

/**
 * Create a debounced version of a callback function.
 * The returned function will only execute after the specified delay
 * has passed without being called again.
 * 
 * @param callback - The callback function to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns The debounced callback
 * 
 * @example
 * const handleSearch = useDebouncedCallback((query: string) => {
 *   fetchResults(query);
 * }, 500);
 * 
 * <input onChange={(e) => handleSearch(e.target.value)} />
 */
export function useDebouncedCallback<T extends (...args: never[]) => void>(
    callback: T,
    delay: number = 300
): (...args: Parameters<T>) => void {
    const callbackRef = useRef(callback);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Keep callback ref updated
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const debouncedCallback = useCallback(
        (...args: Parameters<T>) => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            timerRef.current = setTimeout(() => {
                callbackRef.current(...args);
            }, delay);
        },
        [delay]
    );

    return debouncedCallback;
}

// =============================================================================
// useDebouncedState - Debounced state with immediate and delayed values
// =============================================================================

export interface DebouncedState<T> {
    /** Immediate value (updates on every change) */
    value: T;
    /** Debounced value (updates after delay) */
    debouncedValue: T;
    /** Set the value */
    setValue: React.Dispatch<React.SetStateAction<T>>;
    /** Whether debounce is pending */
    isPending: boolean;
    /** Cancel pending debounce */
    cancel: () => void;
    /** Flush - immediately apply pending value */
    flush: () => void;
}

/**
 * State hook that provides both immediate and debounced values.
 * Useful for search inputs where you want responsive UI but debounced API calls.
 * 
 * @param initialValue - Initial state value
 * @param delay - Debounce delay in milliseconds (default: 300ms)
 * 
 * @example
 * const { value, debouncedValue, setValue, isPending } = useDebouncedState('', 500);
 * 
 * return (
 *   <div>
 *     <input value={value} onChange={(e) => setValue(e.target.value)} />
 *     {isPending && <Spinner />}
 *     <Results query={debouncedValue} />
 *   </div>
 * );
 */
export function useDebouncedState<T>(
    initialValue: T,
    delay: number = 300
): DebouncedState<T> {
    const [value, setValue] = useState<T>(initialValue);
    const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);
    const [isPending, setIsPending] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const latestValueRef = useRef<T>(initialValue);

    // Keep track of latest value for flush
    useEffect(() => {
        latestValueRef.current = value;
    }, [value]);

    useEffect(() => {
        if (value !== debouncedValue) {
            setIsPending(true);
            timerRef.current = setTimeout(() => {
                setDebouncedValue(value);
                setIsPending(false);
            }, delay);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [value, delay, debouncedValue]);

    const cancel = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setIsPending(false);
    }, []);

    const flush = useCallback(() => {
        cancel();
        setDebouncedValue(latestValueRef.current);
    }, [cancel]);

    return useMemo(
        () => ({
            value,
            debouncedValue,
            setValue,
            isPending,
            cancel,
            flush,
        }),
        [value, debouncedValue, isPending, cancel, flush]
    );
}

export default useDebounce;
