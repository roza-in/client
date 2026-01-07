'use client';

import { useSearchParams as useNextSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';

/**
 * Hook for managing URL search params with type safety
 */
export function useSearchParams<T extends Record<string, string | number | boolean | undefined>>() {
  const searchParams = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get all params as object
  const params = useMemo(() => {
    const result: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      result[key] = value;
    });
    return result as Partial<T>;
  }, [searchParams]);

  // Get single param value
  const get = useCallback(
    <K extends keyof T>(key: K): T[K] | null => {
      const value = searchParams.get(key as string);
      return value as T[K] | null;
    },
    [searchParams]
  );

  // Get param as number
  const getNumber = useCallback(
    (key: keyof T, defaultValue?: number): number | undefined => {
      const value = searchParams.get(key as string);
      if (value === null) return defaultValue;
      const num = parseInt(value, 10);
      return isNaN(num) ? defaultValue : num;
    },
    [searchParams]
  );

  // Get param as boolean
  const getBoolean = useCallback(
    (key: keyof T): boolean => {
      const value = searchParams.get(key as string);
      return value === 'true' || value === '1';
    },
    [searchParams]
  );

  // Set params (replaces current)
  const setParams = useCallback(
    (newParams: Partial<T>, options?: { replace?: boolean }) => {
      const current = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });

      const search = current.toString();
      const url = search ? `${pathname}?${search}` : pathname;

      if (options?.replace) {
        router.replace(url);
      } else {
        router.push(url);
      }
    },
    [searchParams, pathname, router]
  );

  // Update single param
  const setParam = useCallback(
    <K extends keyof T>(key: K, value: T[K] | null, options?: { replace?: boolean }) => {
      setParams({ [key]: value } as unknown as Partial<T>, options);
    },
    [setParams]
  );

  // Remove params
  const removeParams = useCallback(
    (keys: (keyof T)[], options?: { replace?: boolean }) => {
      const current = new URLSearchParams(searchParams.toString());
      keys.forEach((key) => current.delete(key as string));

      const search = current.toString();
      const url = search ? `${pathname}?${search}` : pathname;

      if (options?.replace) {
        router.replace(url);
      } else {
        router.push(url);
      }
    },
    [searchParams, pathname, router]
  );

  // Clear all params
  const clearParams = useCallback(
    (options?: { replace?: boolean }) => {
      if (options?.replace) {
        router.replace(pathname);
      } else {
        router.push(pathname);
      }
    },
    [pathname, router]
  );

  return {
    params,
    get,
    getNumber,
    getBoolean,
    setParams,
    setParam,
    removeParams,
    clearParams,
  };
}
