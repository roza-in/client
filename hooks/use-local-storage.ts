/**
 * ROZX Healthcare Platform - Local Storage Hook
 * 
 * Type-safe local storage with SSR support and reactive updates.
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

// =============================================================================
// Types
// =============================================================================

export interface UseLocalStorageOptions<T> {
    /** Custom serializer (default: JSON.stringify) */
    serializer?: (value: T) => string;
    /** Custom deserializer (default: JSON.parse) */
    deserializer?: (value: string) => T;
    /** Sync across browser tabs */
    syncTabs?: boolean;
}

export interface UseLocalStorageReturn<T> {
    /** Current value */
    value: T;
    /** Set value */
    setValue: (value: T | ((prev: T) => T)) => void;
    /** Remove from storage */
    remove: () => void;
    /** Check if key exists */
    exists: boolean;
}

// =============================================================================
// Helper Functions
// =============================================================================

function getStorageValue<T>(
    key: string,
    defaultValue: T,
    deserializer: (value: string) => T
): T {
    if (typeof window === 'undefined') return defaultValue;

    try {
        const item = window.localStorage.getItem(key);
        if (item === null) return defaultValue;
        return deserializer(item);
    } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
        return defaultValue;
    }
}

function setStorageValue<T>(
    key: string,
    value: T,
    serializer: (value: T) => string
): void {
    if (typeof window === 'undefined') return;

    try {
        window.localStorage.setItem(key, serializer(value));
        // Dispatch custom event for same-tab updates
        window.dispatchEvent(new StorageEvent('storage', { key, newValue: serializer(value) }));
    } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
    }
}

function removeStorageValue(key: string): void {
    if (typeof window === 'undefined') return;

    try {
        window.localStorage.removeItem(key);
        window.dispatchEvent(new StorageEvent('storage', { key, newValue: null }));
    } catch (error) {
        console.warn(`Error removing localStorage key "${key}":`, error);
    }
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * Type-safe localStorage hook with reactive updates.
 * 
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @param options - Configuration options
 * 
 * @example
 * // Simple usage
 * const { value, setValue } = useLocalStorage('theme', 'light');
 * 
 * // With complex types
 * const { value: settings, setValue: setSettings } = useLocalStorage('settings', {
 *   notifications: true,
 *   language: 'en',
 * });
 * 
 * // Update single property
 * setSettings(prev => ({ ...prev, notifications: false }));
 */
export function useLocalStorage<T>(
    key: string,
    defaultValue: T,
    options: UseLocalStorageOptions<T> = {}
): UseLocalStorageReturn<T> {
    const {
        serializer = JSON.stringify,
        deserializer = JSON.parse,
        syncTabs = true,
    } = options;

    // Initialize state with stored value or default
    const [value, setValueState] = useState<T>(() =>
        getStorageValue(key, defaultValue, deserializer)
    );

    const [exists, setExists] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        return window.localStorage.getItem(key) !== null;
    });

    // Handle hydration mismatch
    useEffect(() => {
        setValueState(getStorageValue(key, defaultValue, deserializer));
        setExists(window.localStorage.getItem(key) !== null);
    }, [key, defaultValue, deserializer]);

    // Sync across tabs
    useEffect(() => {
        if (!syncTabs) return;

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key !== key) return;

            if (event.newValue === null) {
                setValueState(defaultValue);
                setExists(false);
            } else {
                try {
                    setValueState(deserializer(event.newValue));
                    setExists(true);
                } catch (error) {
                    console.warn(`Error parsing localStorage value for key "${key}":`, error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key, defaultValue, deserializer, syncTabs]);

    // Set value
    const setValue = useCallback(
        (newValue: T | ((prev: T) => T)) => {
            setValueState((prev) => {
                const resolvedValue = typeof newValue === 'function'
                    ? (newValue as (prev: T) => T)(prev)
                    : newValue;

                setStorageValue(key, resolvedValue, serializer);
                setExists(true);
                return resolvedValue;
            });
        },
        [key, serializer]
    );

    // Remove from storage
    const remove = useCallback(() => {
        removeStorageValue(key);
        setValueState(defaultValue);
        setExists(false);
    }, [key, defaultValue]);

    return useMemo(
        () => ({ value, setValue, remove, exists }),
        [value, setValue, remove, exists]
    );
}

// =============================================================================
// Typed Storage Keys (for type safety across the app)
// =============================================================================

/**
 * Predefined storage keys with types
 */
export const storageKeys = {
    theme: 'rozx-theme' as const,
    sidebarCollapsed: 'rozx-sidebar-collapsed' as const,
    recentSearches: 'rozx-recent-searches' as const,
    preferredLanguage: 'rozx-language' as const,
    notificationPreferences: 'rozx-notification-prefs' as const,
    onboardingCompleted: 'rozx-onboarding' as const,
} as const;

// =============================================================================
// Convenience Hooks
// =============================================================================

/**
 * Theme preference hook
 */
export function useThemePreference() {
    return useLocalStorage<'light' | 'dark' | 'system'>(
        storageKeys.theme,
        'system'
    );
}

/**
 * Sidebar collapsed state hook
 */
export function useSidebarState() {
    return useLocalStorage<boolean>(storageKeys.sidebarCollapsed, false);
}

/**
 * Recent searches hook
 */
export function useRecentSearches(maxItems: number = 10) {
    const { value, setValue, remove } = useLocalStorage<string[]>(
        storageKeys.recentSearches,
        []
    );

    const addSearch = useCallback(
        (query: string) => {
            setValue((prev) => {
                const filtered = prev.filter((s) => s !== query);
                return [query, ...filtered].slice(0, maxItems);
            });
        },
        [setValue, maxItems]
    );

    const clearSearches = remove;

    return { searches: value, addSearch, clearSearches };
}

export default useLocalStorage;
