/**
 * Rozx Healthcare Platform — Case Transformation Utilities
 *
 * Converts object keys between snake_case and camelCase.
 * Used by the API client to normalize server responses.
 */

// =============================================================================
// Key Converters
// =============================================================================

/**
 * Convert a single snake_case string to camelCase.
 * Already-camelCase strings pass through unchanged.
 *
 * @example snakeToCamel('consultation_fee_online') → 'consultationFeeOnline'
 */
export function snakeToCamel(str: string): string {
    return str.replace(/_([a-z0-9])/g, (_, char) => char.toUpperCase());
}

/**
 * Convert a single camelCase string to snake_case.
 *
 * @example camelToSnake('consultationFeeOnline') → 'consultation_fee_online'
 */
export function camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);
}

// =============================================================================
// Deep Object Transformers
// =============================================================================

/**
 * Recursively convert all keys in an object/array from snake_case to camelCase.
 *
 * - Handles nested objects and arrays
 * - Preserves null, primitives, and Date instances
 * - Skips keys that are already camelCase (no underscores)
 */
export function toCamelCase<T = unknown>(data: unknown): T {
    if (data === null || data === undefined) return data as T;
    if (typeof data !== 'object') return data as T;
    if (data instanceof Date) return data as T;

    if (Array.isArray(data)) {
        return data.map((item) => toCamelCase(item)) as T;
    }

    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
        const camelKey = snakeToCamel(key);
        result[camelKey] = toCamelCase(value);
    }
    return result as T;
}

/**
 * Recursively convert all keys in an object/array from camelCase to snake_case.
 *
 * Useful for sending request bodies to the server.
 */
export function toSnakeCase<T = unknown>(data: unknown): T {
    if (data === null || data === undefined) return data as T;
    if (typeof data !== 'object') return data as T;
    if (data instanceof Date) return data as T;

    if (Array.isArray(data)) {
        return data.map((item) => toSnakeCase(item)) as T;
    }

    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
        const snakeKey = camelToSnake(key);
        result[snakeKey] = toSnakeCase(value);
    }
    return result as T;
}
