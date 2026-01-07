'use client';

import { useState, useCallback } from 'react';
import { ApiError } from '@/config/api';

interface AsyncState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

interface UseAsyncReturn<T, Args extends unknown[]> extends AsyncState<T> {
  execute: (...args: Args) => Promise<T | null>;
  reset: () => void;
  setData: (data: T | null) => void;
}

/**
 * Hook for handling async operations with loading and error states
 */
export function useAsync<T, Args extends unknown[] = []>(
  asyncFunction: (...args: Args) => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    immediate?: boolean;
  }
): UseAsyncReturn<T, Args> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const data = await asyncFunction(...args);
        setState({ data, error: null, isLoading: false });
        options?.onSuccess?.(data);
        return data;
      } catch (err) {
        const error = err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'An error occurred';
        setState({ data: null, error, isLoading: false });
        options?.onError?.(err instanceof Error ? err : new Error(error));
        return null;
      }
    },
    [asyncFunction, options]
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, isLoading: false });
  }, []);

  const setData = useCallback((data: T | null) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
  };
}

/**
 * Simpler hook for mutations (create, update, delete)
 */
export function useMutation<T, Args extends unknown[] = []>(
  mutationFn: (...args: Args) => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  }
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (...args: Args): Promise<T | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await mutationFn(...args);
        options?.onSuccess?.(data);
        return data;
      } catch (err) {
        const message = err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'An error occurred';
        setError(message);
        options?.onError?.(err instanceof Error ? err : new Error(message));
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn, options]
  );

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return { mutate, isLoading, error, reset };
}
