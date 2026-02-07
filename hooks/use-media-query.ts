/**
 * ROZX Healthcare Platform - Media Query Hook
 * 
 * Responsive design utilities using CSS media queries.
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

// =============================================================================
// Breakpoints (matching Tailwind defaults)
// =============================================================================

export const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// =============================================================================
// useMediaQuery - Match a specific media query
// =============================================================================

/**
 * Match a CSS media query.
 * 
 * @param query - CSS media query string
 * @returns Whether the media query matches
 * 
 * @example
 * const isLargeScreen = useMediaQuery('(min-width: 1024px)');
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState<boolean>(() => {
        // SSR fallback
        if (typeof window === 'undefined') return false;
        return window.matchMedia(query).matches;
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia(query);

        // Set initial value
        setMatches(mediaQuery.matches);

        // Handler for changes
        const handleChange = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Modern browsers
        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [query]);

    return matches;
}

// =============================================================================
// useBreakpoint - Check if viewport is at or above a breakpoint
// =============================================================================

/**
 * Check if the viewport is at or above a specific breakpoint.
 * 
 * @param breakpoint - The breakpoint to check
 * @returns Whether the viewport width is >= the breakpoint
 * 
 * @example
 * const isDesktop = useBreakpoint('lg'); // >= 1024px
 * const isTablet = useBreakpoint('md'); // >= 768px
 */
export function useBreakpoint(breakpoint: Breakpoint): boolean {
    const width = breakpoints[breakpoint];
    return useMediaQuery(`(min-width: ${width}px)`);
}

// =============================================================================
// useBreakpointValue - Get value based on current breakpoint
// =============================================================================

export interface BreakpointValues<T> {
    base?: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
    '2xl'?: T;
}

/**
 * Get a value based on the current breakpoint.
 * Values cascade up (mobile-first approach).
 * 
 * @param values - Object with breakpoint keys and values
 * @returns The value for the current breakpoint
 * 
 * @example
 * const columns = useBreakpointValue({ base: 1, md: 2, lg: 3, xl: 4 });
 * // Returns 1 on mobile, 2 on tablet, 3 on desktop, 4 on large screens
 */
export function useBreakpointValue<T>(values: BreakpointValues<T>): T | undefined {
    const isSm = useBreakpoint('sm');
    const isMd = useBreakpoint('md');
    const isLg = useBreakpoint('lg');
    const isXl = useBreakpoint('xl');
    const is2Xl = useBreakpoint('2xl');

    return useMemo(() => {
        if (is2Xl && values['2xl'] !== undefined) return values['2xl'];
        if (isXl && values.xl !== undefined) return values.xl;
        if (isLg && values.lg !== undefined) return values.lg;
        if (isMd && values.md !== undefined) return values.md;
        if (isSm && values.sm !== undefined) return values.sm;
        return values.base;
    }, [isSm, isMd, isLg, isXl, is2Xl, values]);
}

// =============================================================================
// useIsMobile / useIsDesktop - Convenience hooks
// =============================================================================

/**
 * Check if on mobile device (< 768px)
 */
export function useIsMobile(): boolean {
    return !useBreakpoint('md');
}

/**
 * Check if on tablet (>= 768px and < 1024px)
 */
export function useIsTablet(): boolean {
    const isMd = useBreakpoint('md');
    const isLg = useBreakpoint('lg');
    return isMd && !isLg;
}

/**
 * Check if on desktop (>= 1024px)
 */
export function useIsDesktop(): boolean {
    return useBreakpoint('lg');
}

// =============================================================================
// useWindowSize - Get window dimensions
// =============================================================================

export interface WindowSize {
    width: number;
    height: number;
}

/**
 * Get current window size with live updates.
 * 
 * @returns Current window width and height
 * 
 * @example
 * const { width, height } = useWindowSize();
 */
export function useWindowSize(): WindowSize {
    const [size, setSize] = useState<WindowSize>(() => {
        if (typeof window === 'undefined') {
            return { width: 0, height: 0 };
        }
        return {
            width: window.innerWidth,
            height: window.innerHeight,
        };
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return size;
}

// =============================================================================
// usePreferredColorScheme - Detect system color preference
// =============================================================================

export type ColorScheme = 'light' | 'dark';

/**
 * Get system color scheme preference.
 * 
 * @returns 'light' or 'dark' based on system preference
 * 
 * @example
 * const colorScheme = usePreferredColorScheme();
 */
export function usePreferredColorScheme(): ColorScheme {
    const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
    return prefersDark ? 'dark' : 'light';
}

// =============================================================================
// useIsReducedMotion - Detect motion preference
// =============================================================================

/**
 * Check if user prefers reduced motion.
 * Important for accessibility.
 * 
 * @returns true if user prefers reduced motion
 * 
 * @example
 * const prefersReducedMotion = useIsReducedMotion();
 * const animationDuration = prefersReducedMotion ? 0 : 300;
 */
export function useIsReducedMotion(): boolean {
    return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export default useMediaQuery;
